import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, localDate, weekSince } from '@/lib/date'
import { personName } from '@/lib/format/name'
import { prescribe } from '@/lib/prescribe'
import { ITEMS_SELECT, toItems, type PlayerDayItem } from '@/lib/playerDay'
import { playerStates } from '@/lib/team'
import type { Trainer } from '@/lib/auth'

export type Participation = 'full' | 'limited' | 'out'

export interface WeekDay {
  date: string
  episodeLabel: string
  period: string | null
  dayGroup: 'A' | 'B' | null
  rest: boolean
  items: PlayerDayItem[]
}

export interface KarteView {
  id: string
  writtenOn: string
  summary: string
  parts: [string, string][]
  images: { id: string; url: string }[]
}

export async function loadPlayerHead(trainer: Trainer, id: string) {
  const db = adminDb()
  const { data: p } = await db
    .from('player')
    .select('id, family_name, given_name, team, team_id, share_token, is_fictional')
    .eq('id', id)
    .eq('trainer_id', trainer.id)
    .maybeSingle()
  if (!p) return null
  const today = localDate(trainer.time_zone)
  const [{ data: eps }, st] = await Promise.all([
    db.from('injury_episode').select('id, label, injured_on, status, protocol_id').eq('player_id', p.id).order('created_at', { ascending: false }),
    playerStates([p.id]),
  ])
  const s = st.status.get(p.id)
  const active = (eps ?? []).filter((e) => e.status === 'active')
  return {
    id: p.id,
    name: personName(p.family_name, p.given_name),
    team: p.team,
    teamId: p.team_id,
    token: p.share_token,
    fictional: p.is_fictional,
    today,
    active: active.map((e) => ({ id: e.id, label: e.label, injuredOn: e.injured_on, week: weekSince(e.injured_on, today), protocolId: e.protocol_id })),
    participation: (s?.status as Participation | undefined) ?? null,
    restriction: s?.restriction ?? null,
    expectedReturn: s?.expected_return ?? null,
    watching: st.watching.has(p.id),
  }
}
export type PlayerHead = NonNullable<Awaited<ReturnType<typeof loadPlayerHead>>>

/** 今週の月曜から明日まで。今日と明日のまだ組まれていないメニューはここで組む */
export async function loadWeek(head: PlayerHead): Promise<{ from: string; to: string; days: WeekDay[] }> {
  const db = adminDb()
  const dow = new Date(`${head.today}T00:00:00Z`).getUTCDay()
  const from = addDays(head.today, -((dow + 6) % 7))
  const to = addDays(head.today, 1)
  for (const e of head.active) for (const d of [head.today, to]) await prescribe(e.id, d)
  const ids = head.active.map((e) => e.id).concat(['00000000-0000-0000-0000-000000000000'])
  const { data: rx } = await db
    .from('prescription')
    .select(`injury_episode_id, target_on, day_group, is_rest_day, row:menu_row_id(period_raw), ${ITEMS_SELECT}`)
    .in('injury_episode_id', ids)
    .gte('target_on', from)
    .lte('target_on', to)
    .order('target_on')
  const label = new Map(head.active.map((e) => [e.id, e.label]))
  return {
    from,
    to,
    days: (rx ?? []).map((r) => ({
      date: r.target_on,
      episodeLabel: label.get(r.injury_episode_id) ?? '',
      period: (r.row as unknown as { period_raw: string } | null)?.period_raw ?? null,
      dayGroup: (r.day_group as 'A' | 'B' | null) ?? null,
      rest: r.is_rest_day,
      items: toItems(r.items),
    })),
  }
}

export async function loadKarte(playerId: string): Promise<KarteView[]> {
  const db = adminDb()
  const { data: kartes } = await db
    .from('karte_entry')
    .select('id, written_on, summary, subjective, objective, assessment, treatment, plan, att:karte_attachment(id, storage_path, created_at)')
    .eq('player_id', playerId)
    .order('written_on', { ascending: false })
    .order('confirmed_at', { ascending: false })
    .limit(50)
  const paths = (kartes ?? []).flatMap((k) => (k.att as { storage_path: string }[]).map((a) => a.storage_path))
  const signed = new Map<string, string>()
  if (paths.length) {
    const { data } = await db.storage.from('karte').createSignedUrls(paths, 60 * 60)
    for (const s of data ?? []) if (s.signedUrl && s.path) signed.set(s.path, s.signedUrl)
  }
  return (kartes ?? []).map((k) => ({
    id: k.id,
    writtenOn: k.written_on,
    summary: k.summary,
    parts: (
      [
        ['訴え', k.subjective],
        ['所見', k.objective],
        ['評価', k.assessment],
        ['治療', k.treatment],
        ['次の予定', k.plan],
      ] as [string, string | null][]
    ).filter((x): x is [string, string] => !!x[1]),
    images: (k.att as { id: string; storage_path: string }[])
      .map((a) => ({ id: a.id, url: signed.get(a.storage_path) ?? '' }))
      .filter((a) => a.url),
  }))
}

/** 選手のチームのこれからの予定（合流の計画を立てる材料） */
export async function loadPlayerTeamEvents(head: PlayerHead, tz: string) {
  if (!head.teamId) return []
  const { data } = await adminDb()
    .from('team_event')
    .select('id, kind, starts_at, opponent, venue, note')
    .eq('team_id', head.teamId)
    .is('replaced_by', null)
    .gte('starts_at', `${addDays(head.today, -1)}T00:00:00Z`)
    .lt('starts_at', `${addDays(head.today, 43)}T00:00:00Z`)
    .order('starts_at')
  return (data ?? [])
    .map((e) => ({ ...e, date: localDate(tz, new Date(e.starts_at)) }))
    .filter((e) => e.date >= head.today)
    .map((e) => ({ ...e, inDays: daysBetween(head.today, e.date) }))
}

/** 直近 4 週の実施と調子 */
export async function loadReport(head: PlayerHead) {
  const db = adminDb()
  const from = addDays(head.today, -27)
  const ids = head.active.map((e) => e.id).concat(['00000000-0000-0000-0000-000000000000'])
  const [{ data: rx }, { data: cond }] = await Promise.all([
    db.from('prescription').select('target_on, is_rest_day, items:prescription_item(done_at)').in('injury_episode_id', ids).gte('target_on', from).lte('target_on', head.today),
    db.from('condition_report').select('reported_on, pain_score, fatigue, comment').eq('player_id', head.id).gte('reported_on', from).order('reported_on'),
  ])
  const days = Array.from({ length: 28 }, (_, i) => addDays(from, i)).map((date) => {
    const r = (rx ?? []).filter((x) => x.target_on === date && !x.is_rest_day)
    const items = r.flatMap((x) => x.items as { done_at: string | null }[])
    const c = (cond ?? []).find((x) => x.reported_on === date)
    return { date, total: items.length, done: items.filter((i) => i.done_at).length, pain: c?.pain_score ?? null, fatigue: c?.fatigue ?? null, comment: c?.comment ?? null }
  })
  // 実施率は昨日まで（今日はまだ途中）
  const withMenu = days.filter((d) => d.total > 0 && d.date < head.today)
  return {
    days,
    rate: withMenu.length ? Math.round((withMenu.reduce((s, d) => s + d.done, 0) / withMenu.reduce((s, d) => s + d.total, 0)) * 100) : null,
    comments: days.filter((d) => d.comment),
  }
}

/** 清水のプロトコルにある、チーム練習の段階と合流の目安の週 */
export async function loadTeamSteps(head: PlayerHead) {
  const eps = head.active.filter((e) => e.protocolId)
  if (eps.length === 0) return []
  const { data } = await adminDb()
    .from('protocol_team_unlock')
    .select('protocol_id, unlock_week, condition_raw, step:team_step_id(name, sort_order)')
    .in('protocol_id', eps.map((e) => e.protocolId!))
  return eps.map((e) => ({
    label: e.label,
    week: e.week,
    steps: (data ?? [])
      .filter((u) => u.protocol_id === e.protocolId)
      .map((u) => {
        const step = u.step as unknown as { name: string; sort_order: number }
        return { name: step.name, order: step.sort_order, week: u.unlock_week as number | null, condition: u.condition_raw as string | null }
      })
      .sort((a, b) => (a.week ?? 999) - (b.week ?? 999) || a.order - b.order),
  }))
}
