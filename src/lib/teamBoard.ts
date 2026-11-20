import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, localDate } from '@/lib/date'
import { personName } from '@/lib/format/name'
import { loadRejoin, type Participation } from '@/lib/rejoin'

const WD = ['日', '月', '火', '水', '木', '金', '土']
export const mdw = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8))}（${WD[new Date(`${iso}T00:00:00Z`).getUTCDay()]}）`
const hhmm = (at: string, tz: string) => new Intl.DateTimeFormat('ja-JP', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(at))

export interface BoardEvent {
  id: string
  date: string
  time: string | null
  kind: 'match' | 'training' | 'off'
  title: string
  detail: string | null
  movedFrom: string | null
  score: { for: number; against: number } | null
  /** この日に全て参加できない選手（離脱・一部参加） */
  limits: { id: string; name: string; joinable: string[] }[]
}

export interface BoardPlayer {
  id: string
  name: string
  status: Participation | null
  week: number | null
  steps: { name: string; date: string | null; reached: boolean }[]
  fullOn: string | null
}

export interface BoardJoin {
  date: string
  playerId: string
  name: string
  steps: string[]
}

export interface TeamBoard {
  team: { id: string; name: string }
  today: string
  tz: string
  events: BoardEvent[]
  /** 選手が新しい練習に参加できるようになる日 */
  joins: BoardJoin[]
  players: BoardPlayer[]
  nextMatch: { date: string; title: string; daysUntil: number } | null
  record: { win: number; draw: number; loss: number }
}

/**
 * チームの「いつ何があるか」と「いつ誰が何の練習に参加できるか」。トレーナーと指導者で同じものを見る。
 * 怪我の名前・カルテ・痛みはここに入れない（指導者に出すため）。
 */
export async function loadTeamBoard(teamId: string, tz: string, range: { from: string; to: string }): Promise<TeamBoard | null> {
  const db = adminDb()
  const today = localDate(tz)
  const { data: team } = await db.from('team').select('id, name').eq('id', teamId).maybeSingle()
  if (!team) return null
  const [{ data: events }, { data: players }, { data: past }] = await Promise.all([
    db
      .from('team_event')
      .select('id, kind, starts_at, opponent, venue, home_away, note, score_for, score_against, replaced_by')
      .eq('team_id', teamId)
      .gte('starts_at', `${addDays(range.from, -1)}T00:00:00Z`)
      .lt('starts_at', `${addDays(range.to, 2)}T00:00:00Z`)
      .order('starts_at'),
    db.from('player').select('id, family_name, given_name').eq('team_id', teamId).eq('is_active', true).order('family_name'),
    db.from('team_event').select('score_for, score_against').eq('team_id', teamId).eq('kind', 'match').is('replaced_by', null).lt('starts_at', new Date().toISOString()),
  ])
  const rejoin = await loadRejoin((players ?? []).map((p) => p.id), today)
  const boardPlayers: BoardPlayer[] = (players ?? []).map((p) => {
    const r = rejoin.get(p.id)
    return {
      id: p.id,
      name: personName(p.family_name, p.given_name),
      status: r ? r.status : 'full',
      week: r?.week ?? null,
      steps: (r?.steps ?? []).map((s) => ({ name: s.name, date: s.date, reached: s.reached })),
      fullOn: r?.fullOn ?? null,
    }
  })
  const pending = boardPlayers.filter((p) => p.status !== 'full' && p.steps.length > 0)

  const movedFrom = new Map<string, string>()
  for (const e of events ?? []) if (e.replaced_by) movedFrom.set(e.replaced_by, localDate(tz, new Date(e.starts_at)))
  const live = (events ?? []).filter((e) => !e.replaced_by)
  const boardEvents: BoardEvent[] = live
    .map((e) => {
      const date = localDate(tz, new Date(e.starts_at))
      const limits = e.kind === 'off' || date < today ? [] : pending
        .map((p) => ({ id: p.id, name: p.name, joinable: p.steps.filter((s) => s.date !== null && s.date <= date).map((s) => s.name), total: p.steps.length }))
        .filter((x) => x.joinable.length < x.total)
        .map(({ id, name, joinable }) => ({ id, name, joinable }))
      return {
        id: e.id,
        date,
        time: e.kind === 'off' ? null : hhmm(e.starts_at, tz),
        kind: e.kind as BoardEvent['kind'],
        title: e.kind === 'match' ? `vs ${e.opponent ?? '相手未定'}` : e.kind === 'training' ? 'チーム練習' : 'オフ',
        detail: [e.kind === 'match' && e.home_away ? (e.home_away === 'home' ? 'ホーム' : 'アウェイ') : null, e.venue, e.note].filter(Boolean).join(' ・ ') || null,
        movedFrom: movedFrom.get(e.id) ?? null,
        score: e.score_for !== null && e.score_against !== null ? { for: e.score_for, against: e.score_against } : null,
        limits,
      }
    })
    .filter((e) => e.date >= range.from && e.date <= range.to)

  const joins: BoardJoin[] = []
  for (const p of pending) {
    const byDate = new Map<string, string[]>()
    for (const s of p.steps) if (!s.reached && s.date) byDate.set(s.date, [...(byDate.get(s.date) ?? []), s.name])
    for (const [date, steps] of byDate) if (date >= range.from && date <= range.to) joins.push({ date, playerId: p.id, name: p.name, steps })
  }
  joins.sort((a, b) => a.date.localeCompare(b.date))

  const nm = live.find((e) => e.kind === 'match' && localDate(tz, new Date(e.starts_at)) >= today)
  const scored = (past ?? []).filter((m) => m.score_for !== null && m.score_against !== null)
  return {
    team,
    today,
    tz,
    events: boardEvents,
    joins,
    players: boardPlayers,
    nextMatch: nm ? { date: localDate(tz, new Date(nm.starts_at)), title: `vs ${nm.opponent ?? '相手未定'}`, daysUntil: daysBetween(today, localDate(tz, new Date(nm.starts_at))) } : null,
    record: {
      win: scored.filter((m) => m.score_for! > m.score_against!).length,
      draw: scored.filter((m) => m.score_for === m.score_against).length,
      loss: scored.filter((m) => m.score_for! < m.score_against!).length,
    },
  }
}
