import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { daysBetween, localDate, weekSince } from '@/lib/date'
import { loadRejoin } from '@/lib/rejoin'

export interface PlayerStage {
  today: string
  episode: null | { label: string; week: number }
  /** 復帰見込み（トレーナーが決めた日）。無ければ null */
  ret: null | { days: number; percent: number }
  participation: 'full' | 'limited' | 'out' | null
  stage: null | { index: number; total: number; name: string; next: string | null }
  condition: { pain: number | null; fatigue: number | null; comment: string | null }
}

async function tzOf(trainerId: string) {
  const { data } = await adminDb().from('trainer').select('time_zone').eq('id', trainerId).single()
  return data?.time_zone ?? 'Europe/Berlin'
}

async function activeEpisode(playerId: string) {
  const { data } = await adminDb()
    .from('injury_episode')
    .select('id, label, injured_on, protocol_id')
    .eq('player_id', playerId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

/** ホームの上半分: 復帰までの輪・段階（表1の時期）・今日の調子 */
export async function loadPlayerStage(player: { id: string; trainer_id: string }): Promise<PlayerStage> {
  const db = adminDb()
  const today = localDate(await tzOf(player.trainer_id))
  const [ep, rejoin, { data: cond }] = await Promise.all([
    activeEpisode(player.id),
    loadRejoin([player.id], today),
    db.from('condition_report').select('pain_score, fatigue, comment').eq('player_id', player.id).eq('reported_on', today).maybeSingle(),
  ])
  let stage: PlayerStage['stage'] = null
  if (ep?.protocol_id) {
    const [{ data: rows }, { data: pos }] = await Promise.all([
      db.from('protocol_menu_row').select('id, row_index, period_raw').eq('protocol_id', ep.protocol_id).order('row_index'),
      db.from('menu_position').select('menu_row_id').eq('injury_episode_id', ep.id).lte('anchor_on', today).order('set_at', { ascending: false }).limit(1).maybeSingle(),
    ])
    const i = (rows ?? []).findIndex((r) => r.id === pos?.menu_row_id)
    if (rows && i >= 0) stage = { index: i + 1, total: rows.length, name: rows[i].period_raw, next: rows[i + 1]?.period_raw ?? null }
  }
  let ret: PlayerStage['ret'] = null
  const r = rejoin.get(player.id)
  if (ep && r?.fullOn) {
    const span = Math.max(1, daysBetween(ep.injured_on, r.fullOn))
    ret = {
      days: daysBetween(today, r.fullOn),
      percent: Math.round(Math.min(1, Math.max(0, daysBetween(ep.injured_on, today) / span)) * 100),
    }
  }
  return {
    today,
    episode: ep ? { label: ep.label, week: weekSince(ep.injured_on, today) } : null,
    ret,
    participation: r ? r.status : 'full',
    stage,
    condition: { pain: cond?.pain_score ?? null, fatigue: cond?.fatigue ?? null, comment: cond?.comment ?? null },
  }
}
