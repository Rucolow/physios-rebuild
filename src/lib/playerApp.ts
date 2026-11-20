import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, localDate, weekSince } from '@/lib/date'

export interface PlayerStage {
  today: string
  episode: null | { label: string; week: number }
  /** 復帰見込み（トレーナーが決めた日）。無ければ null */
  ret: null | { days: number; percent: number }
  participation: 'full' | 'limited' | 'out' | null
  stage: null | { index: number; total: number; name: string; next: string | null }
  condition: { pain: number | null; fatigue: number | null }
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
  const [ep, { data: st }, { data: cond }] = await Promise.all([
    activeEpisode(player.id),
    db.from('availability_status').select('status, expected_return').eq('player_id', player.id).is('valid_to', null).maybeSingle(),
    db.from('condition_report').select('pain_score, fatigue').eq('player_id', player.id).eq('reported_on', today).maybeSingle(),
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
  if (ep && st?.expected_return) {
    const span = Math.max(1, daysBetween(ep.injured_on, st.expected_return))
    ret = {
      days: daysBetween(today, st.expected_return),
      percent: Math.round(Math.min(1, Math.max(0, daysBetween(ep.injured_on, today) / span)) * 100),
    }
  }
  return {
    today,
    episode: ep ? { label: ep.label, week: weekSince(ep.injured_on, today) } : null,
    ret,
    participation: (st?.status as PlayerStage['participation']) ?? null,
    stage,
    condition: { pain: cond?.pain_score ?? null, fatigue: cond?.fatigue ?? null },
  }
}

/** 経過: 直近 7 日の痛み・疲労・実施と、これまでの段階 */
export async function loadPlayerProgress(player: { id: string; trainer_id: string }) {
  const db = adminDb()
  const today = localDate(await tzOf(player.trainer_id))
  const from = addDays(today, -6)
  const ep = await activeEpisode(player.id)
  const [{ data: cond }, { data: rx }, { data: pos }] = await Promise.all([
    db.from('condition_report').select('reported_on, pain_score, fatigue').eq('player_id', player.id).gte('reported_on', from),
    db.from('prescription').select('target_on, is_rest_day, items:prescription_item(done_at)').eq('player_id', player.id).gte('target_on', from).lte('target_on', today),
    ep ? db.from('menu_position').select('anchor_on, set_at, row:menu_row_id(row_index, period_raw)').eq('injury_episode_id', ep.id).order('set_at') : Promise.resolve({ data: [] as never[] }),
  ])
  const days = Array.from({ length: 7 }, (_, i) => addDays(from, i)).map((date) => {
    const c = (cond ?? []).find((x) => x.reported_on === date)
    const items = (rx ?? []).filter((r) => r.target_on === date && !r.is_rest_day).flatMap((r) => r.items as { done_at: string | null }[])
    return { date, pain: c?.pain_score ?? null, fatigue: c?.fatigue ?? null, total: items.length, done: items.filter((i) => i.done_at).length }
  })
  // 同じ時期を何度指定しても 1 行にする（指定し直しは履歴として出さない）
  const stages: { from: string; name: string }[] = []
  for (const p of pos ?? []) {
    const row = (p as { row: unknown }).row as { period_raw: string } | null
    if (!row) continue
    if (stages.at(-1)?.name === row.period_raw) continue
    stages.push({ from: (p as { anchor_on: string }).anchor_on, name: row.period_raw })
  }
  return { today, days, stages }
}
