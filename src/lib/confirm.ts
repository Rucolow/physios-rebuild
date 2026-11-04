import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, localDate } from '@/lib/date'
import { activeEpisodes } from '@/lib/roster'
import { prescribe } from '@/lib/prescribe'
import type { Trainer } from '@/lib/auth'
import type { InterpretedSegment } from '@/lib/llm/interpret'

export interface DraftAnswer {
  action: 'confirm' | 'reject'
  player_id?: string
  protocol_id?: string
  menu_row_id?: string
  injured_on?: string
  /** 日程の変更を反映するか（要確認の答え） */
  accept_schedule?: boolean
  /** 読み返して直した一行 */
  summary?: string
}

export class ConfirmError extends Error {}

/**
 * 今日のダイジェストを一括で確定する（設計書 2.5）。
 * 要確認に答えが無いものがあれば、何も書かずに止める（半分だけ確定した状態を作らない）。
 * 確定したあと、担当選手全員の翌日のメニューを組む。
 */
export async function confirmDigest(trainer: Trainer, answers: Record<string, DraftAnswer>) {
  const db = adminDb()
  const today = localDate(trainer.time_zone)
  const tomorrow = addDays(today, 1)

  const { data: drafts, error } = await db
    .from('draft')
    .select('id, kind, player_id, payload, confirm_reason, local_date, seq, created_at')
    .eq('trainer_id', trainer.id)
    .eq('status', 'pending')
    .lte('local_date', today)
    .order('created_at')
    .order('seq')
  if (error) throw error
  if (!drafts?.length) return { confirmed: 0, rejected: 0, prescriptions: 0 }

  const { data: own } = await db.from('player').select('id').eq('trainer_id', trainer.id)
  const ownIds = new Set((own ?? []).map((p) => p.id))

  // 答えの検査（書く前に全部）
  const plan = drafts.map((d) => {
    const a = answers[d.id] ?? { action: 'confirm' as const }
    const seg = d.payload as InterpretedSegment
    const playerId = a.player_id ?? d.player_id
    if (a.action === 'reject') return { d, a, seg, playerId }
    if (!playerId && d.kind !== 'schedule') throw new ConfirmError('選手が決まっていない記録があります')
    if (playerId && !ownIds.has(playerId)) throw new ConfirmError('担当外の選手が選ばれています')
    if (d.kind === 'injury' && (!a.protocol_id || !a.menu_row_id)) throw new ConfirmError('新しい怪我のプロトコルと時期を選んでください')
    if (d.kind === 'menu_row' && !a.menu_row_id) throw new ConfirmError('メニューの時期を選んでください')
    if (d.kind === 'schedule' && !a.accept_schedule) throw new ConfirmError('日程の変更を反映するか選んでください')
    return { d, a, seg, playerId }
  })

  const now = new Date().toISOString()
  const order = { injury: 0, menu_row: 1, karte: 2, schedule: 3 } as const
  for (const { d, a, seg, playerId } of [...plan].sort((x, y) => order[x.d.kind as keyof typeof order] - order[y.d.kind as keyof typeof order])) {
    if (a.action === 'reject') {
      await db.from('draft').update({ status: 'rejected', answer: a, resolved_at: now }).eq('id', d.id)
      continue
    }
    if (d.kind === 'injury') {
      const { data: proto } = await db.from('protocol').select('id, title').eq('id', a.protocol_id!).single()
      const { data: row } = await db.from('protocol_menu_row').select('id').eq('id', a.menu_row_id!).eq('protocol_id', a.protocol_id!).single()
      if (!proto || !row) throw new ConfirmError('プロトコルと時期の組み合わせが合いません')
      const { data: ep, error: e1 } = await db
        .from('injury_episode')
        .insert({ player_id: playerId, protocol_id: proto.id, injured_on: a.injured_on ?? seg.injured_on ?? d.local_date, label: proto.title })
        .select('id')
        .single()
      if (e1) throw e1
      await db.from('menu_position').insert({ injury_episode_id: ep.id, menu_row_id: row.id, anchor_on: tomorrow, set_by: trainer.id, source_draft_id: d.id })
    }
    if (d.kind === 'menu_row') {
      const ep = (await activeEpisodes(trainer.id)).find((e) => e.player_id === playerId)
      if (!ep?.protocol_id) throw new ConfirmError('時期を変える怪我が見つかりません')
      const { data: row } = await db.from('protocol_menu_row').select('id').eq('id', a.menu_row_id!).eq('protocol_id', ep.protocol_id).single()
      if (!row) throw new ConfirmError('時期がこの怪我のプロトコルの行ではありません')
      await db.from('menu_position').insert({ injury_episode_id: ep.id, menu_row_id: row.id, anchor_on: tomorrow, set_by: trainer.id, source_draft_id: d.id })
    }
    if (d.kind === 'karte') {
      const ep = (await activeEpisodes(trainer.id)).find((e) => e.player_id === playerId)
      const { error: e2 } = await db.from('karte_entry').insert({
        player_id: playerId,
        injury_episode_id: ep?.id ?? null,
        written_on: d.local_date,
        summary: a.summary ?? seg.summary,
        subjective: seg.subjective,
        objective: seg.objective,
        assessment: seg.assessment,
        treatment: seg.treatment,
        plan: seg.plan,
        source_draft_id: d.id,
        confirmed_by: trainer.id,
      })
      if (e2) throw e2
    }
    if (d.kind === 'schedule') {
      if (!seg.kickoff_at) throw new ConfirmError('新しい試合の日時が読めませんでした')
      const { data: team } = playerId ? await db.from('player').select('team').eq('id', playerId).single() : { data: null }
      await db.from('match_schedule').insert({ trainer_id: trainer.id, team: team?.team ?? null, kickoff_at: seg.kickoff_at, note: seg.schedule_note })
    }
    await db.from('draft').update({ status: 'confirmed', answer: a, player_id: playerId, resolved_at: now }).eq('id', d.id)
  }

  let prescriptions = 0
  for (const ep of await activeEpisodes(trainer.id)) {
    if (await prescribe(ep.id, tomorrow)) prescriptions += 1
  }
  return {
    confirmed: plan.filter((p) => p.a.action !== 'reject').length,
    rejected: plan.filter((p) => p.a.action === 'reject').length,
    prescriptions,
  }
}
