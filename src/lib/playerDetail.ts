import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, localDate, weekSince } from '@/lib/date'
import { pastEpisodes } from '@/lib/episode'
import { personName } from '@/lib/format/name'
import { prescribe } from '@/lib/prescribe'
import { dayFocusLabel } from '@/lib/dayFocus'
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
  /** 今日だけ。その日の中心（「下半身メイン」など） */
  focus: string | null
  items: PlayerDayItem[]
}

export interface KarteView {
  id: string
  writtenOn: string
  summary: string
  parts: [string, string][]
  images: { id: string; url: string }[]
}

/** カルテの既定の項目と、それを入れる列 */
export const KARTE_DEFAULT: [string, 'subjective' | 'objective' | 'assessment' | 'treatment' | 'plan'][] = [
  ['訴え', 'subjective'],
  ['所見', 'objective'],
  ['評価', 'assessment'],
  ['治療', 'treatment'],
  ['次の予定', 'plan'],
]
export const KARTE_COLUMN = new Map(KARTE_DEFAULT)

/** 選手ごとのカルテの項目（0006 の適用前や未設定なら既定の五項目） */
export async function loadKarteFields(playerId: string): Promise<string[]> {
  const { data, error } = await adminDb().from('player').select('karte_fields').eq('id', playerId).maybeSingle()
  const f = !error ? ((data as { karte_fields?: string[] } | null)?.karte_fields ?? []) : []
  return f.length ? f : KARTE_DEFAULT.map(([l]) => l)
}

export async function loadPlayerHead(trainer: Trainer, id: string) {
  const db = adminDb()
  const { data: p } = await db
    .from('player')
    .select('id, family_name, given_name, aliases, team, team_id, share_token, is_fictional')
    .eq('id', id)
    .eq('trainer_id', trainer.id)
    .eq('is_active', true)
    .maybeSingle()
  if (!p) return null
  const today = localDate(trainer.time_zone)
  const [{ data: eps }, st, past] = await Promise.all([
    db.from('injury_episode').select('id, label, injured_on, status, protocol_id').eq('player_id', p.id).order('created_at', { ascending: false }),
    playerStates([p.id]),
    pastEpisodes(db, p.id),
  ])
  const s = st.status.get(p.id)
  const active = (eps ?? []).filter((e) => e.status === 'active')
  return {
    id: p.id,
    name: personName(p.family_name, p.given_name),
    familyName: p.family_name,
    givenName: p.given_name,
    aliases: (p.aliases ?? []) as string[],
    past,
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
  const proto = new Map(head.active.map((e) => [e.id, e.protocolId]))
  const days = await Promise.all((rx ?? []).map(async (r) => ({
    date: r.target_on,
    episodeLabel: label.get(r.injury_episode_id) ?? '',
    period: (r.row as unknown as { period_raw: string } | null)?.period_raw ?? null,
    dayGroup: (r.day_group as 'A' | 'B' | null) ?? null,
    rest: r.is_rest_day,
    focus: r.target_on === head.today && !r.is_rest_day ? await dayFocusLabel(proto.get(r.injury_episode_id) ?? null, r.day_group) : null,
    items: toItems(r.items),
  })))
  return { from, to, days }
}

export async function loadKarte(playerId: string): Promise<KarteView[]> {
  const db = adminDb()
  const cols = 'id, written_on, summary, subjective, objective, assessment, treatment, plan, att:karte_attachment(id, storage_path, created_at)'
  const q = (c: string) => db.from('karte_entry').select(c).eq('player_id', playerId).order('written_on', { ascending: false }).order('confirmed_at', { ascending: false }).limit(500)
  let res = await q(`${cols}, fields`)
  if (res.error) res = await q(cols)
  type Row = { id: string; written_on: string; summary: string; subjective: string | null; objective: string | null; assessment: string | null; treatment: string | null; plan: string | null; fields?: Record<string, string> | null; att: { id: string; storage_path: string }[] }
  const kartes = (res.data ?? []) as unknown as Row[]
  const order = await loadKarteFields(playerId)
  const paths = kartes.flatMap((k) => k.att.map((a) => a.storage_path))
  const signed = new Map<string, string>()
  if (paths.length) {
    const { data } = await db.storage.from('karte').createSignedUrls(paths, 60 * 60)
    for (const s of data ?? []) if (s.signedUrl && s.path) signed.set(s.path, s.signedUrl)
  }
  return kartes.map((k) => {
    const values = new Map<string, string>()
    for (const [l, c] of KARTE_DEFAULT) if (k[c]) values.set(l, k[c]!)
    for (const [l, v] of Object.entries(k.fields ?? {})) if (v) values.set(l, v)
    // 選手の項目の順に並べ、項目から外したものも記録としては残して後ろに出す
    const labels = [...order.filter((l) => values.has(l)), ...[...values.keys()].filter((l) => !order.includes(l))]
    return {
      id: k.id,
      writtenOn: k.written_on,
      summary: k.summary,
      parts: labels.map((l) => [l, values.get(l)!] as [string, string]),
      images: k.att.map((a) => ({ id: a.id, url: signed.get(a.storage_path) ?? '' })).filter((a) => a.url),
    }
  })
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

export type ReportScale = 'week' | 'month' | 'year'

export interface ReportBucket {
  key: string
  label: string
  total: number
  done: number
  pain: number | null
  fatigue: number | null
}

/** 実施と調子。週（7 日）・月（30 日）は日ごと、年は月ごとにまとめる */
export async function loadReport(head: PlayerHead, scale: ReportScale) {
  const db = adminDb()
  const from = scale === 'week' ? addDays(head.today, -6) : scale === 'month' ? addDays(head.today, -29) : (() => { const d = new Date(`${head.today.slice(0, 7)}-01T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() - 11); return d.toISOString().slice(0, 10) })()
  const [{ data: rx }, { data: cond }] = await Promise.all([
    db.from('prescription').select('target_on, is_rest_day, items:prescription_item(done_at)').eq('player_id', head.id).gte('target_on', from).lte('target_on', head.today),
    db.from('condition_report').select('reported_on, pain_score, fatigue, comment').eq('player_id', head.id).gte('reported_on', from).order('reported_on'),
  ])
  const keyOf = (d: string) => (scale === 'year' ? d.slice(0, 7) : d)
  const keys: string[] = []
  if (scale === 'year') {
    for (let d = from; d <= head.today; d = addDays(`${d.slice(0, 7)}-01`, 32).slice(0, 7) + '-01') keys.push(d.slice(0, 7))
  } else {
    for (let d = from; d <= head.today; d = addDays(d, 1)) keys.push(d)
  }
  const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null)
  const buckets: ReportBucket[] = keys.map((k) => {
    // 実施は昨日まで（今日はまだ途中）
    const r = (rx ?? []).filter((x) => keyOf(x.target_on) === k && !x.is_rest_day && x.target_on < head.today)
    const items = r.flatMap((x) => x.items as { done_at: string | null }[])
    const c = (cond ?? []).filter((x) => keyOf(x.reported_on) === k)
    return {
      key: k,
      label: scale === 'year' ? `${Number(k.slice(5))}月` : `${Number(k.slice(5, 7))}/${Number(k.slice(8))}`,
      total: items.length,
      done: items.filter((i) => i.done_at).length,
      pain: avg(c.map((x) => x.pain_score).filter((v): v is number => v !== null)),
      fatigue: avg(c.map((x) => x.fatigue).filter((v): v is number => v !== null)),
    }
  })
  const total = buckets.reduce((s, b) => s + b.total, 0)
  return {
    scale,
    buckets,
    rate: total ? Math.round((buckets.reduce((s, b) => s + b.done, 0) / total) * 100) : null,
    reported: (cond ?? []).filter((c) => c.pain_score !== null || c.fatigue !== null).length,
    comments: (cond ?? []).filter((c) => c.comment).map((c) => ({ date: c.reported_on, comment: c.comment as string })),
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
