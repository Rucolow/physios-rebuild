import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, localDate } from '@/lib/date'
import { personName } from '@/lib/format/name'
import type { Trainer } from '@/lib/auth'
import type { MonthlyCalendar, ScheduleEvent } from '@/lib/types'

export interface TeamRef {
  id: string
  name: string
  /** 指導者ボードのリンクの鍵（0005 の適用前は null） */
  coach_token?: string | null
}

export type Participation = 'full' | 'limited' | 'out' | null

export interface TeamPlayer {
  id: string
  name: string
  teamId: string | null
  participation: Participation
  expectedReturn: string | null
  restriction: string | null
  watching: boolean
}

export interface TeamResult {
  id: string
  dateIso: string
  date: string
  weekday: string
  opponent: string
  homeAway: 'home' | 'away' | null
  teamId: string
  score: { for: number; against: number } | null
}

export interface TeamData {
  teams: TeamRef[]
  /** 選んでいるチーム。null = 全チーム */
  current: TeamRef | null
  today: string
  nextMatch: null | { daysUntil: number; opponent: string; when: string; venue: string }
  thisWeek: ScheduleEvent[]
  upcoming: ScheduleEvent[]
  changeCount: number
  record: { win: number; draw: number; loss: number; goalsFor: number; goalsAgainst: number }
  results: TeamResult[]
  players: TeamPlayer[]
}

const WD = ['日', '月', '火', '水', '木', '金', '土']
const KIND_TITLE = { training: 'チーム練習', off: 'オフ' } as const

function md(iso: string) {
  const [, m, d] = iso.split('-').map(Number)
  return `${m}/${d}`
}
function wd(iso: string) {
  return WD[new Date(`${iso}T00:00:00Z`).getUTCDay()]
}
function hhmm(at: string, tz: string) {
  return new Intl.DateTimeFormat('ja-JP', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(at))
}
/** その週の月曜 */
function monday(iso: string) {
  const dow = new Date(`${iso}T00:00:00Z`).getUTCDay()
  return addDays(iso, -((dow + 6) % 7))
}

/** トレーナーの時間帯の「日付 + 時刻」を UTC の時刻にする */
export function zonedIso(date: string, time: string, tz: string): string {
  const guess = new Date(`${date}T${time || '00:00'}:00Z`)
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' }).formatToParts(guess)
  const off = parts.find((p) => p.type === 'timeZoneName')?.value.replace('GMT', '') || '+00:00'
  return new Date(`${date}T${time || '00:00'}:00${off === '' ? '+00:00' : off}`).toISOString()
}

export async function listTeams(trainerId: string): Promise<TeamRef[]> {
  const db = adminDb()
  const withToken = await db.from('team').select('id, name, coach_token').eq('trainer_id', trainerId).order('sort_order').order('created_at')
  if (!withToken.error) return withToken.data ?? []
  const { data } = await db.from('team').select('id, name').eq('trainer_id', trainerId).order('sort_order').order('created_at')
  return data ?? []
}

/** 選手の今の参加区分・復帰見込み・要観察 */
export async function playerStates(playerIds: string[]) {
  const ids = playerIds.concat(['00000000-0000-0000-0000-000000000000'])
  const db = adminDb()
  const [{ data: st }, { data: w }] = await Promise.all([
    db.from('availability_status').select('player_id, status, expected_return, restriction').in('player_id', ids).is('valid_to', null),
    db.from('watch_period').select('player_id').in('player_id', ids).is('released_at', null),
  ])
  return {
    status: new Map((st ?? []).map((s) => [s.player_id, s])),
    watching: new Set((w ?? []).map((x) => x.player_id)),
  }
}

export async function loadTeam(trainer: Trainer, teamId: string | null): Promise<TeamData> {
  const db = adminDb()
  const tz = trainer.time_zone
  const today = localDate(tz)
  const teams = await listTeams(trainer.id)
  const current = teamId ? teams.find((t) => t.id === teamId) ?? null : null
  const ids = (current ? [current.id] : teams.map((t) => t.id)).concat(['00000000-0000-0000-0000-000000000000'])
  const teamName = new Map(teams.map((t) => [t.id, t.name]))
  const showTeam = !current && teams.length > 1

  const weekStart = monday(today)
  const weekEnd = addDays(weekStart, 6)
  const [{ data: events }, { data: past }, { data: players }] = await Promise.all([
    db
      .from('team_event')
      .select('id, team_id, kind, starts_at, opponent, venue, home_away, note, score_for, score_against, replaced_by, source')
      .in('team_id', ids)
      .gte('starts_at', `${addDays(weekStart, -1)}T00:00:00Z`)
      .lt('starts_at', `${addDays(weekStart, 7 * 9)}T00:00:00Z`)
      .order('starts_at'),
    db
      .from('team_event')
      .select('id, team_id, starts_at, opponent, home_away, score_for, score_against')
      .in('team_id', ids)
      .eq('kind', 'match')
      .is('replaced_by', null)
      .lt('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: false })
      .limit(60),
    db
      .from('player')
      .select('id, family_name, given_name, team_id')
      .eq('trainer_id', trainer.id)
      .eq('is_active', true)
      .order('family_name'),
  ])

  // 日程変更で外れた行（replaced_by あり）は、新しい行の「○/○ から移動」に使う
  const replacedFrom = new Map<string, string>()
  for (const e of events ?? []) if (e.replaced_by) replacedFrom.set(e.replaced_by, localDate(tz, new Date(e.starts_at)))
  const live = (events ?? []).filter((e) => !e.replaced_by)
  const nowIso = new Date().toISOString()
  const nextIdx = live.findIndex((e) => e.starts_at >= nowIso && localDate(tz, new Date(e.starts_at)) >= today)

  const toEvent = (e: (typeof live)[number], i: number): ScheduleEvent => {
    const dateIso = localDate(tz, new Date(e.starts_at))
    const moved = replacedFrom.get(e.id)
    const detail = [
      showTeam ? teamName.get(e.team_id) : null,
      e.kind === 'match' && e.home_away ? (e.home_away === 'home' ? 'Home' : 'Away') : null,
      e.venue,
      moved ? `${md(moved)} から移動` : null,
      e.note,
    ]
      .filter(Boolean)
      .join(' ・ ')
    const state = dateIso < today ? 'past' : i === nextIdx ? 'next' : 'future'
    const offset = daysBetween(today, dateIso)
    return {
      id: e.id,
      dateIso,
      kind: e.kind as ScheduleEvent['kind'],
      date: md(dateIso),
      weekday: wd(dateIso),
      time: e.kind === 'off' ? '—' : hhmm(e.starts_at, tz),
      title: e.kind === 'match' ? `vs ${e.opponent ?? '相手未定'}` : KIND_TITLE[e.kind as 'training' | 'off'],
      detail: detail || undefined,
      state,
      tone: moved ? 'watch' : undefined,
      toneLabel: moved ? '日程変更' : undefined,
      nowLabel: state === 'past' ? undefined : offset === 0 ? '今日' : offset === 1 ? '明日' : undefined,
      teamId: e.team_id,
      score: e.score_for !== null && e.score_against !== null ? { for: e.score_for, against: e.score_against } : null,
    }
  }
  const all = live.map(toEvent)
  const thisWeek = all.filter((e) => e.dateIso >= weekStart && e.dateIso <= weekEnd)
  const upcoming = all.filter((e) => e.dateIso > weekEnd)

  const nm = live.find((e) => e.kind === 'match' && e.starts_at >= nowIso)
  const nextMatch = nm
    ? (() => {
        const d = localDate(tz, new Date(nm.starts_at))
        return {
          daysUntil: daysBetween(today, d),
          opponent: `vs ${nm.opponent ?? '相手未定'}`,
          when: `${md(d)} (${wd(d)}) ${hhmm(nm.starts_at, tz)}`,
          venue: [nm.home_away === 'home' ? 'Home' : nm.home_away === 'away' ? 'Away' : null, showTeam ? teamName.get(nm.team_id) : null].filter(Boolean).join(' ・ '),
        }
      })()
    : null

  const results: TeamResult[] = (past ?? []).map((m) => {
    const d = localDate(tz, new Date(m.starts_at))
    return {
      id: m.id,
      dateIso: d,
      date: md(d),
      weekday: wd(d),
      opponent: m.opponent ?? '相手未定',
      homeAway: (m.home_away as 'home' | 'away' | null) ?? null,
      teamId: m.team_id,
      score: m.score_for !== null && m.score_against !== null ? { for: m.score_for, against: m.score_against } : null,
    }
  })
  const scored = results.filter((r) => r.score)
  const record = {
    win: scored.filter((r) => r.score!.for > r.score!.against).length,
    draw: scored.filter((r) => r.score!.for === r.score!.against).length,
    loss: scored.filter((r) => r.score!.for < r.score!.against).length,
    goalsFor: scored.reduce((s, r) => s + r.score!.for, 0),
    goalsAgainst: scored.reduce((s, r) => s + r.score!.against, 0),
  }

  const scope = (players ?? []).filter((p) => !current || p.team_id === current.id)
  const st = await playerStates(scope.map((p) => p.id))
  return {
    teams,
    current,
    today,
    nextMatch,
    thisWeek,
    upcoming,
    changeCount: all.filter((e) => e.tone === 'watch' && e.state !== 'past').length,
    record,
    results,
    players: scope.map((p) => {
      const s = st.status.get(p.id)
      return {
        id: p.id,
        name: personName(p.family_name, p.given_name),
        teamId: p.team_id,
        participation: (s?.status as Participation) ?? null,
        expectedReturn: s?.expected_return ?? null,
        restriction: s?.restriction ?? null,
        watching: st.watching.has(p.id),
      }
    }),
  }
}

/** 月間カレンダー（セルには日付・試合と練習の点だけ） */
export async function loadTeamMonth(trainer: Trainer, teamId: string | null, year: number, month: number): Promise<MonthlyCalendar> {
  const tz = trainer.time_zone
  const today = localDate(tz)
  const teams = await listTeams(trainer.id)
  const ids = (teamId ? [teamId] : teams.map((t) => t.id)).concat(['00000000-0000-0000-0000-000000000000'])
  const teamName = new Map(teams.map((t) => [t.id, t.name]))
  const first = `${year}-${String(month).padStart(2, '0')}-01`
  const gridStart = addDays(first, -new Date(`${first}T00:00:00Z`).getUTCDay())
  const gridEnd = addDays(gridStart, 42)
  const { data: events } = await adminDb()
    .from('team_event')
    .select('id, team_id, kind, starts_at, opponent, home_away, note')
    .in('team_id', ids)
    .is('replaced_by', null)
    .gte('starts_at', `${addDays(gridStart, -1)}T00:00:00Z`)
    .lt('starts_at', `${addDays(gridEnd, 1)}T00:00:00Z`)
    .order('starts_at')
  const byDay = new Map<string, NonNullable<typeof events>>()
  for (const e of events ?? []) {
    const d = localDate(tz, new Date(e.starts_at))
    byDay.set(d, [...(byDay.get(d) ?? []), e])
  }
  const days = Array.from({ length: 42 }, (_, i) => {
    const date = addDays(gridStart, i)
    const evs = byDay.get(date) ?? []
    return {
      date,
      day: Number(date.slice(8)),
      inMonth: date.slice(0, 7) === first.slice(0, 7),
      isToday: date === today,
      events: evs.filter((e) => e.kind !== 'off').map((e) => ({ id: e.id, kind: e.kind as 'match' | 'training' })),
      needsReview: false,
      bands: [],
    }
  })
  const details: MonthlyCalendar['details'] = {}
  for (const [d, evs] of byDay) {
    details[d] = evs.map((e) => ({
      time: e.kind === 'off' ? '—' : hhmm(e.starts_at, tz),
      title: e.kind === 'match' ? `vs ${e.opponent ?? '相手未定'}` : KIND_TITLE[e.kind as 'training' | 'off'],
      detail: [teams.length > 1 && !teamId ? teamName.get(e.team_id) : null, e.note].filter(Boolean).join(' ・ ') || undefined,
    }))
  }
  return { year, month, days, legend: [], details }
}
