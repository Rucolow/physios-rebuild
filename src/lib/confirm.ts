import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, localDate } from '@/lib/date'
import { activeEpisodes } from '@/lib/roster'
import { prescribe } from '@/lib/prescribe'
import { closeEpisode } from '@/lib/episode'
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
  /** 復帰の話に対する答え。true なら怪我を復帰にして故障者リストから外す */
  close_episode?: boolean
}

export class ConfirmError extends Error {}

/**
 * ダイジェストを確定する（設計書 2.5）。
 * 答えが揃っている下書きだけを記録し、まだ答えていない要確認は下書きのまま残す（2026-11-21 Rucolow）。
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
  if (!drafts?.length) return { confirmed: 0, rejected: 0, prescriptions: 0, left: 0 }

  const { data: own } = await db.from('player').select('id').eq('trainer_id', trainer.id)
  const ownIds = new Set((own ?? []).map((p) => p.id))
  const activeNow = new Set((await activeEpisodes(trainer.id)).map((e) => e.player_id))

  // 記録するのは、画面で見て答えが揃っているものだけ。画面を開いた後に入った下書きや、答えていない要確認は残す
  const ready = drafts.flatMap((d) => {
    const a = answers[d.id]
    if (!a) return []
    const seg = d.payload as InterpretedSegment
    const playerId = a.player_id ?? d.player_id
    if (a.action === 'reject') return [{ d, a, seg, playerId }]
    if (!playerId && d.kind !== 'schedule') return []
    if (playerId && !ownIds.has(playerId)) throw new ConfirmError('担当外の選手が選ばれています')
    if (d.kind === 'injury' && (!a.protocol_id || !a.menu_row_id)) return []
    if (d.kind === 'menu_row' && !a.menu_row_id) return []
    if (d.kind === 'schedule' && !a.accept_schedule) return []
    if (d.kind === 'karte' && seg.returned && playerId && activeNow.has(playerId) && a.close_episode === undefined) return []
    return [{ d, a, seg, playerId }]
  })
  // 時期の変更は、進行中の怪我があるか、同じ回に新しい怪我を記録する選手の分だけ
  const newInjury = new Set(ready.filter((p) => p.d.kind === 'injury' && p.a.action !== 'reject').map((p) => p.playerId))
  const plan = ready.filter((p) => p.d.kind !== 'menu_row' || p.a.action === 'reject' || activeNow.has(p.playerId!) || newInjury.has(p.playerId))
  if (plan.length === 0) return { confirmed: 0, rejected: 0, prescriptions: 0, left: drafts.length }

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
        // トレーナーが文を直したときは、直す前の文字起こしから作った項目を残さない（直した文と食い違うため）
        subjective: a.summary ? null : seg.subjective,
        objective: a.summary ? null : seg.objective,
        assessment: a.summary ? null : seg.assessment,
        treatment: a.summary ? null : seg.treatment,
        plan: a.summary ? null : seg.plan,
        source_draft_id: d.id,
        confirmed_by: trainer.id,
      })
      if (e2) throw e2
      // 復帰の話に「復帰にする」と答えたとき: 怪我を閉じて故障者リストから外す（記録は残す）
      if (seg.returned && a.close_episode && ep) await closeEpisode(db, ep.id, d.local_date)
    }
    if (d.kind === 'schedule') {
      if (!seg.kickoff_at) throw new ConfirmError('新しい試合の日時が読めませんでした')
      // 選手が分かればその選手のチーム、分からなければトレーナーの全チームから、いま一番近い試合を新しい日時で置き換える
      const { data: player } = playerId ? await db.from('player').select('team_id').eq('id', playerId).single() : { data: null }
      const { data: teams } = await db.from('team').select('id').eq('trainer_id', trainer.id)
      const teamIds = player?.team_id ? [player.team_id] : (teams ?? []).map((t) => t.id)
      if (teamIds.length === 0) throw new ConfirmError('チームがまだありません。チームの画面で先にチームを作ってください')
      const { data: prev } = await db
        .from('team_event')
        .select('id, team_id, opponent, venue, home_away')
        .in('team_id', teamIds)
        .eq('kind', 'match')
        .is('replaced_by', null)
        .gte('starts_at', now)
        .order('starts_at')
        .limit(1)
        .maybeSingle()
      const { data: next, error: e4 } = await db
        .from('team_event')
        .insert({
          team_id: prev?.team_id ?? teamIds[0],
          kind: 'match',
          opponent: prev?.opponent ?? null,
          venue: prev?.venue ?? null,
          home_away: prev?.home_away ?? null,
          starts_at: seg.kickoff_at,
          note: seg.schedule_note,
          source: 'voice',
        })
        .select('id')
        .single()
      if (e4) throw e4
      if (prev) await db.from('team_event').update({ replaced_by: next.id }).eq('id', prev.id)
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
    left: drafts.length - plan.length,
  }
}
