import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { personName } from '@/lib/format/name'
import { addDays, localDate } from '@/lib/date'
import { playerStates } from '@/lib/team'
import { SIGNAL } from '@/lib/design/signal'

export const PART = {
  full: { word: '完全参加', tone: SIGNAL.good.text },
  limited: { word: '制限付き', tone: SIGNAL.watch.text },
  out: { word: '離脱中', tone: SIGNAL.act.text },
} as const

/**
 * 指導者ボード。見せるのは参加区分・制限・復帰見込みと、チームの予定だけ。
 * カルテ・痛み・メニュー・怪我の名前はここから読まない（選手の生データはトレーナーで止める）。
 */
export async function loadBoard(token: string) {
  if (!/^[0-9a-f]{32}$/.test(token)) return null
  const db = adminDb()
  const { data: team } = await db.from('team').select('id, name, trainer:trainer_id(time_zone)').eq('coach_token', token).maybeSingle()
  if (!team) return null
  const tz = (team.trainer as unknown as { time_zone: string } | null)?.time_zone ?? 'Europe/Berlin'
  const today = localDate(tz)
  const { data: players } = await db.from('player').select('id, family_name, given_name').eq('team_id', team.id).eq('is_active', true).order('family_name')
  const st = await playerStates((players ?? []).map((p) => p.id))
  const order = { null: 0, out: 1, limited: 2, full: 3 } as Record<string, number>
  const rows = (players ?? [])
    .map((p) => {
      const s = st.status.get(p.id)
      return {
        id: p.id,
        name: personName(p.family_name, p.given_name),
        status: (s?.status as 'full' | 'limited' | 'out' | undefined) ?? null,
        restriction: s?.restriction ?? null,
        expectedReturn: s?.expected_return ?? null,
      }
    })
    .sort((a, b) => order[String(a.status)] - order[String(b.status)])
  const { data: events } = await db
    .from('team_event')
    .select('id, kind, starts_at, opponent')
    .eq('team_id', team.id)
    .is('replaced_by', null)
    .gte('starts_at', `${addDays(today, -1)}T00:00:00Z`)
    .lt('starts_at', `${addDays(today, 29)}T00:00:00Z`)
    .order('starts_at')
  return {
    team: { id: team.id, name: team.name },
    tz,
    today,
    rows,
    events: (events ?? []).map((e) => ({ ...e, date: localDate(tz, new Date(e.starts_at)) })).filter((e) => e.date >= today && e.kind !== 'off'),
  }
}
