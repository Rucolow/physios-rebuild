import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { localDate } from '@/lib/date'
import { transcribe } from '@/lib/stt/deepgram'
import { interpretTranscript, type InterpretedSegment } from '@/lib/llm/interpret'
import { buildRoster, interpretHints, rosterKeyterms } from '@/lib/roster'
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
 * 途中で失敗しても voice_memo に状態と理由が残り、音声は消さない（reprocessMemo でやり直せる）。
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
      transcript: input.kind === 'text' ? input.text : null,
    })
    .select('id, local_date')
    .single()
  if (error) throw error

  if (input.kind === 'voice') {
    try {
      const ext = input.mimeType.includes('mp4') ? 'm4a' : input.mimeType.includes('ogg') ? 'ogg' : 'webm'
      const path = `${trainer.id}/${memo.local_date}/${memo.id}.${ext}`
      const up = await db.storage.from('voice').upload(path, input.audio, { contentType: input.mimeType, upsert: false })
      if (up.error) throw up.error
      // 文字起こしより前に置き場を記録する（失敗しても音声からやり直せるように）
      await db.from('voice_memo').update({ storage_path: path }).eq('id', memo.id)
    } catch (e) {
      await markFailed(memo.id, e)
      throw e
    }
  }
  return processMemo(trainer, { id: memo.id, local_date: memo.local_date }, input.kind === 'voice' ? { audio: input.audio, mimeType: input.mimeType } : null)
}

/** 処理が途中で止まった（サーバの時間切れなど）とみなすまでの時間。上限 300 秒より長く取る */
export const STUCK_AFTER_MS = 6 * 60 * 1000

/** やり直しの対象か: 失敗したもの、または受け取ってから長く経っても解釈まで終わっていないもの */
export function needsRetry(memo: { status: string; created_at: string }, now = Date.now()): boolean {
  if (memo.status === 'failed') return true
  return (memo.status === 'received' || memo.status === 'transcribed') && now - new Date(memo.created_at).getTime() > STUCK_AFTER_MS
}

/** 処理できなかった録音を、残っている音声（または文）から最初からやり直す */
export async function reprocessMemo(trainer: Trainer, memoId: string): Promise<{ memoId: string; drafts: number }> {
  const db = adminDb()
  const { data: memo, error } = await db
    .from('voice_memo')
    .select('id, trainer_id, local_date, input_kind, storage_path, transcript, status, created_at')
    .eq('id', memoId)
    .single()
  if (error) throw error
  // 担当関係はサーバ側で確かめる
  if (memo.trainer_id !== trainer.id) throw new Error('この録音を扱う権限がありません')
  if (!needsRetry(memo)) return { memoId, drafts: 0 }
  // 前回の途中で入った下書きが残っていれば、未確定のものだけ消してから作り直す
  await db.from('draft').delete().eq('voice_memo_id', memoId).eq('status', 'pending')
  await db.from('voice_memo').update({ status: 'received', error: null }).eq('id', memoId)

  let audio: { audio: ArrayBuffer; mimeType: string } | null = null
  if (memo.input_kind === 'voice') {
    if (!memo.storage_path) {
      await markFailed(memoId, '音声が保存されていません')
      throw new Error('音声が保存されていません')
    }
    const dl = await db.storage.from('voice').download(memo.storage_path)
    if (dl.error) {
      await markFailed(memoId, dl.error)
      throw dl.error
    }
    audio = { audio: await dl.data.arrayBuffer(), mimeType: dl.data.type || 'audio/webm' }
  }
  return processMemo(trainer, { id: memoId, local_date: memo.local_date }, audio)
}

async function markFailed(memoId: string, e: unknown) {
  await adminDb()
    .from('voice_memo')
    .update({ status: 'failed', error: String(e instanceof Error ? e.message : e) })
    .eq('id', memoId)
}

async function processMemo(
  trainer: Trainer,
  memo: { id: string; local_date: string },
  audio: { audio: ArrayBuffer; mimeType: string } | null,
): Promise<{ memoId: string; drafts: number }> {
  const db = adminDb()
  const fail = async (e: unknown): Promise<never> => {
    await markFailed(memo.id, e)
    throw e
  }

  let marked: string
  try {
    if (audio) {
      const t = await transcribe(audio.audio, audio.mimeType, await rosterKeyterms(trainer.id))
      marked = t.marked
      await db
        .from('voice_memo')
        .update({
          duration_sec: t.duration,
          transcript: t.plain,
          stt_language: t.languages.join(',') || null,
          stt_detail: { marked: t.marked },
          status: 'transcribed',
        })
        .eq('id', memo.id)
    } else {
      const { data, error } = await db.from('voice_memo').select('transcript').eq('id', memo.id).single()
      if (error) throw error
      marked = data.transcript ?? ''
      await db.from('voice_memo').update({ status: 'transcribed' }).eq('id', memo.id)
    }
  } catch (e) {
    return fail(e)
  }

  if (!marked.trim()) {
    await db.from('voice_memo').update({ status: 'failed', error: '声が入っていませんでした' }).eq('id', memo.id)
    return { memoId: memo.id, drafts: 0 }
  }

  try {
    const [{ roster, protocols }, hints] = await Promise.all([buildRoster(trainer.id), interpretHints(trainer.id)])
    const segments = await interpretTranscript({
      transcript: marked,
      today: memo.local_date,
      timeZone: trainer.time_zone,
      roster,
      protocols,
      hints,
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
