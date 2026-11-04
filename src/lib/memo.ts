import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { localDate } from '@/lib/date'
import { transcribe } from '@/lib/stt/deepgram'
import { interpretTranscript, type InterpretedSegment } from '@/lib/llm/interpret'
import { buildRoster } from '@/lib/roster'
import type { Trainer } from '@/lib/auth'

export type ConfirmReason = 'player' | 'protocol' | 'menu_row' | 'schedule' | null

/** 下書きの種類ごとに、夜に答えが要るかを決める。カルテは選手が一人に決まっていれば読むだけ */
export function confirmReasonOf(seg: Pick<InterpretedSegment, 'kind' | 'player_id'>): ConfirmReason {
  if (seg.kind === 'injury') return 'protocol'
  if (seg.kind === 'menu_row') return 'menu_row'
  if (seg.kind === 'schedule') return 'schedule'
  return seg.player_id ? null : 'player'
}

/**
 * 音声（または打ち込んだ文）を受け取り、文字起こし → 解釈 → 下書きまで進める。
 * 途中で失敗しても voice_memo に状態と理由が残り、音声は消さない。
 */
export async function ingestMemo(
  trainer: Trainer,
  input: { kind: 'voice'; audio: ArrayBuffer; mimeType: string } | { kind: 'text'; text: string },
): Promise<{ memoId: string; drafts: number }> {
  const db = adminDb()
  const now = new Date()
  const { data: memo, error } = await db
    .from('voice_memo')
    .insert({
      trainer_id: trainer.id,
      recorded_at: now.toISOString(),
      local_date: localDate(trainer.time_zone, now),
      input_kind: input.kind,
    })
    .select('id, local_date')
    .single()
  if (error) throw error

  const fail = async (e: unknown) => {
    await db.from('voice_memo').update({ status: 'failed', error: String(e instanceof Error ? e.message : e) }).eq('id', memo.id)
    throw e
  }

  let marked: string
  try {
    if (input.kind === 'voice') {
      const ext = input.mimeType.includes('mp4') ? 'm4a' : input.mimeType.includes('ogg') ? 'ogg' : 'webm'
      const path = `${trainer.id}/${memo.local_date}/${memo.id}.${ext}`
      const up = await db.storage.from('voice').upload(path, input.audio, { contentType: input.mimeType, upsert: false })
      if (up.error) throw up.error
      const t = await transcribe(input.audio, input.mimeType)
      marked = t.marked
      await db
        .from('voice_memo')
        .update({
          storage_path: path,
          duration_sec: t.duration,
          transcript: t.plain,
          stt_language: t.languages.join(',') || null,
          stt_detail: { marked: t.marked },
          status: 'transcribed',
        })
        .eq('id', memo.id)
    } else {
      marked = input.text
      await db.from('voice_memo').update({ transcript: input.text, status: 'transcribed' }).eq('id', memo.id)
    }
  } catch (e) {
    return fail(e)
  }

  if (!marked.trim()) {
    await db.from('voice_memo').update({ status: 'failed', error: '声が入っていませんでした' }).eq('id', memo.id)
    return { memoId: memo.id, drafts: 0 }
  }

  try {
    const { roster, protocols } = await buildRoster(trainer.id)
    const segments = await interpretTranscript({
      transcript: marked,
      today: memo.local_date,
      timeZone: trainer.time_zone,
      roster,
      protocols,
    })
    const playerIds = new Set(roster.map((p) => p.id))
    const protocolIds = new Set(protocols.map((p) => p.id))
    const rows = segments.map((s, i) => {
      // 名簿に無い id は捨てる（解釈が作った id を信じない）
      const player_id = s.player_id && playerIds.has(s.player_id) ? s.player_id : null
      const candidates = s.candidates.filter((c) => playerIds.has(c))
      const seg = { ...s, player_id, candidates, protocol_candidates: s.protocol_candidates.filter((c) => protocolIds.has(c)) }
      return {
        trainer_id: trainer.id,
        voice_memo_id: memo.id,
        local_date: memo.local_date,
        seq: i,
        kind: s.kind,
        player_id,
        payload: seg,
        confirm_reason: confirmReasonOf(seg),
      }
    })
    if (rows.length) {
      const { error: e2 } = await db.from('draft').insert(rows)
      if (e2) throw e2
    }
    await db.from('voice_memo').update({ status: 'interpreted' }).eq('id', memo.id)
    return { memoId: memo.id, drafts: rows.length }
  } catch (e) {
    return fail(e)
  }
}
