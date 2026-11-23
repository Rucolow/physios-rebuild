import 'server-only'
import { playerStates } from '@/lib/team'
import { adminDb } from '@/lib/supabase/server'
import { addDays, daysBetween, jaDate, localDate, weekSince } from '@/lib/date'
import { personName } from '@/lib/format/name'
import { activeEpisodes } from '@/lib/roster'
import { prescribe } from '@/lib/prescribe'
import type { Trainer } from '@/lib/auth'
import type { Signal } from '@/lib/design/signal'

export interface DashboardAlert {
  playerId: string
  playerName: string
  note: string | null
  tone: Signal
  label: string
}

export interface DashboardSlot {
  id: string
  time: string
  title: string
  detail: string | null
  state: 'past' | 'next' | 'later'
}

export interface DashboardData {
  date: string
  weekday: string
  metrics: { id: string; label: string; value: number; unit: string; tone: Signal | null }[]
  nextMatch: null | { days: number; note: string }
  /** 前の日までに確定しなかった下書き */
  carried: { total: number; review: number; oldest: string | null }
  /** 今日の下書きで答えが要るもの */
  todayReview: number
  alerts: DashboardAlert[]
  watching: { playerId: string; playerName: string; week: number }[]
  slots: DashboardSlot[]
  menuDelivered: number
  menuGaps: { playerId: string; playerName: string; kind: 'menu_row_not_set' | 'no_protocol' }[]
}

const KIND_LABEL = { match: '試合', training: 'チーム練習', off: 'オフ' } as const

function hhmm(iso: string, tz: string) {
  return new Intl.DateTimeFormat('ja-JP', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso))
}

/** ダッシュボードの材料。数字と状態は全てデータからその場で出す */
export async function loadDashboard(trainer: Trainer): Promise<DashboardData> {
  const db = adminDb()
  const tz = trainer.time_zone
  const today = localDate(tz)
  const yesterday = addDays(today, -1)
  const eps = await activeEpisodes(trainer.id)
  // 今日のメニューがまだ無ければ組む（確定した時期から決まるので、いつ組んでも同じ）
  for (const e of eps) if (e.position) await prescribe(e.id, today)

  const { data: players } = await db
    .from('player')
    .select('id, family_name, given_name, team_id')
    .eq('trainer_id', trainer.id)
    .eq('is_active', true)
    .order('family_name')
  const ids = (players ?? []).map((p) => p.id).concat(['00000000-0000-0000-0000-000000000000'])
  const nameOf = new Map((players ?? []).map((p) => [p.id, personName(p.family_name, p.given_name)]))

  const { data: teams } = await db.from('team').select('id, name').eq('trainer_id', trainer.id)
  const teamIds = (teams ?? []).map((t) => t.id).concat(['00000000-0000-0000-0000-000000000000'])
  const teamName = new Map((teams ?? []).map((t) => [t.id, t.name]))

  const [st, { data: watch }, { data: drafts }, { data: events }, { data: rx }, { data: reports }] = await Promise.all([
    playerStates((players ?? []).map((p) => p.id), today),
    db.from('watch_period').select('player_id, added_at').in('player_id', ids).is('released_at', null),
    db.from('draft').select('local_date, confirm_reason, answer').eq('trainer_id', trainer.id).eq('status', 'pending'),
    db
      .from('team_event')
      .select('id, team_id, kind, starts_at, opponent, home_away, note')
      .in('team_id', teamIds)
      .is('replaced_by', null)
      .gte('starts_at', `${addDays(today, -1)}T00:00:00Z`)
      .order('starts_at'),
    db
      .from('prescription')
      .select('player_id, target_on, is_rest_day, items:prescription_item(done_at)')
      .in('player_id', ids)
      .in('target_on', [today, yesterday]),
    db.from('condition_report').select('player_id, reported_on, pain_score').in('player_id', ids).gte('reported_on', addDays(today, -2)),
  ])

  const count = (s: string) => [...st.status.values()].filter((x) => x.status === s).length
  const needsAnswer = (d: { confirm_reason: string | null; answer: unknown }) => d.confirm_reason !== null && d.answer === null
  const carriedRows = (drafts ?? []).filter((d) => d.local_date < today)
  const todayRows = (drafts ?? []).filter((d) => d.local_date === today)
  const reviewTotal = (drafts ?? []).filter(needsAnswer).length

  // 次の試合（全チーム）
  const nowIso = new Date().toISOString()
  const match = (events ?? []).find((e) => e.kind === 'match' && e.starts_at >= nowIso)
  const nextMatch = match
    ? {
        days: daysBetween(today, localDate(tz, new Date(match.starts_at))),
        note: [
          (() => {
            const d = jaDate(localDate(tz, new Date(match.starts_at)))
            return `${d.md}（${d.wd.charAt(0)}）`
          })(),
          match.opponent ? `vs ${match.opponent}` : null,
          (teams ?? []).length > 1 ? teamName.get(match.team_id) : null,
        ]
          .filter(Boolean)
          .join(' '),
      }
    : null

  // 本日の予定（全チーム）
  const todays = (events ?? []).filter((e) => localDate(tz, new Date(e.starts_at)) === today)
  const nextIdx = todays.findIndex((e) => e.starts_at >= nowIso)
  const slots: DashboardSlot[] = todays.map((e, i) => ({
    id: e.id,
    time: e.kind === 'off' ? '—' : hhmm(e.starts_at, tz),
    title: e.kind === 'match' ? `vs ${e.opponent ?? '相手未定'}` : KIND_LABEL[e.kind as keyof typeof KIND_LABEL],
    detail: [teamName.get(e.team_id), e.home_away === 'home' ? 'Home' : e.home_away === 'away' ? 'Away' : null, e.note]
      .filter(Boolean)
      .join(' ・ ') || null,
    state: e.starts_at < nowIso && e.kind !== 'off' ? 'past' : i === nextIdx ? 'next' : 'later',
  }))

  // 近況報告: 昨日のメニューが全部は済んでいない、痛みが上がった
  const alerts: DashboardAlert[] = []
  for (const p of players ?? []) {
    const y = (rx ?? []).find((r) => r.player_id === p.id && r.target_on === yesterday && !r.is_rest_day)
    const items = (y?.items ?? []) as { done_at: string | null }[]
    const reps = (reports ?? []).filter((r) => r.player_id === p.id && r.pain_score !== null).sort((a, b) => a.reported_on.localeCompare(b.reported_on))
    const last = reps.at(-1)
    const prev = reps.at(-2)
    if (last && prev && (last.pain_score ?? 0) > (prev.pain_score ?? 0)) {
      alerts.push({ playerId: p.id, playerName: nameOf.get(p.id)!, note: null, tone: 'act', label: `痛み ${prev.pain_score}→${last.pain_score}` })
    } else if (items.length > 0) {
      const done = items.filter((i) => i.done_at).length
      if (done === 0) alerts.push({ playerId: p.id, playerName: nameOf.get(p.id)!, note: `昨日 0/${items.length}`, tone: 'watch', label: '未実施' })
      else if (done < items.length) alerts.push({ playerId: p.id, playerName: nameOf.get(p.id)!, note: `昨日 ${done}/${items.length}`, tone: 'watch', label: '一部実施' })
    }
  }

  const reported = new Set(alerts.map((a) => a.playerId))
  const watching = (watch ?? [])
    .filter((w) => !reported.has(w.player_id) && nameOf.has(w.player_id))
    .map((w) => ({ playerId: w.player_id, playerName: nameOf.get(w.player_id)!, week: weekSince(w.added_at.slice(0, 10), today) }))

  const delivered = (rx ?? []).filter((r) => r.target_on === today && !r.is_rest_day).length
  const menuGaps = eps
    .filter((e) => !e.position)
    .map((e) => ({ playerId: e.player_id, playerName: nameOf.get(e.player_id) ?? '', kind: (e.protocol_id ? 'menu_row_not_set' : 'no_protocol') as 'menu_row_not_set' | 'no_protocol' }))

  const d = jaDate(today)
  return {
    date: d.full,
    weekday: d.wd,
    metrics: [
      { id: 'out', label: '離脱中', value: count('out'), unit: '名', tone: 'act' },
      { id: 'limited', label: '制限付き', value: count('limited'), unit: '名', tone: 'watch' },
      { id: 'review', label: '要確認', value: reviewTotal, unit: '件', tone: reviewTotal > 0 ? 'watch' : null },
    ],
    nextMatch,
    carried: {
      total: carriedRows.length,
      review: carriedRows.filter(needsAnswer).length,
      oldest: carriedRows.length ? (() => { const o = jaDate(carriedRows.map((r) => r.local_date).sort()[0]); return o.md })() : null,
    },
    todayReview: todayRows.filter(needsAnswer).length,
    alerts,
    watching,
    slots,
    menuDelivered: delivered,
    menuGaps,
  }
}
