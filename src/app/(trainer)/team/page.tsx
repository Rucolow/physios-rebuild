import Link from 'next/link'
import type { ReactNode } from 'react'
import { List, ListRow, Num } from '@/components/ui'
import { AddTeamEventButton } from '@/components/trainer/AddTeamEventButton'
import { AddTeamButton, EditTeamButton, ScoreButton } from '@/components/trainer/TeamTools'
import { CopyLink } from '@/components/trainer/CopyLink'
import { headers } from 'next/headers'
import { TeamBoardView, type BoardView } from '@/components/team/TeamBoardView'
import { SIGNAL, type Signal } from '@/lib/design/signal'
import { requireTrainer } from '@/lib/auth'
import { listTeams, loadTeam, type TeamData } from '@/lib/team'
import { loadTeamBoard, mdw } from '@/lib/teamBoard'
import { addDays, localDate } from '@/lib/date'
import { cn } from '@/lib/utils'

type Tab = 'schedule' | 'results'

/**
 * チーム。チームごとに、いつ何があるかと、いつ誰が何の練習に参加できるかを見る。
 * 指導者にはこの画面と同じものをリンクで見せる。
 */
export default async function TeamPage({ searchParams }: { searchParams: Promise<{ t?: string; tab?: string; view?: string; ym?: string; day?: string }> }) {
  const params = await searchParams
  const trainer = await requireTrainer()
  const teams = await listTeams(trainer.id)
  const h = await headers()
  const origin = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`
  if (teams.length === 0) return <main className="px-4 py-6 md:px-6 md:py-8">
    <div className="space-y-4"><p className="text-sm text-navy-300">チームはまだありません。</p><AddTeamButton /></div>
  </main>
  const current = teams.find((t) => t.id === params.t) ?? teams[0]
  const tab: Tab = params.tab === 'results' ? 'results' : 'schedule'
  const view: BoardView = params.view === 'calendar' ? 'calendar' : 'timeline'
  const today = localDate(trainer.time_zone)
  const ym = /^\d{4}-\d{2}$/.test(params.ym ?? '') ? params.ym! : today.slice(0, 7)
  const day = /^\d{4}-\d{2}-\d{2}$/.test(params.day ?? '') ? params.day! : null
  const range = view === 'calendar'
    ? { from: addDays(`${ym}-01`, -7), to: addDays(`${ym}-01`, 42) }
    : { from: today, to: addDays(today, 56) }
  const board = tab === 'schedule' ? await loadTeamBoard(current.id, trainer.time_zone, range) : null
  const data = tab === 'results' ? await loadTeam(trainer, current.id) : null
  const href = (q: { view?: BoardView; ym?: string; day?: string }) => {
    const s = new URLSearchParams({ t: current.id })
    if (q.view === 'calendar') s.set('view', 'calendar')
    if (q.ym) s.set('ym', q.ym)
    if (q.day) s.set('day', q.day)
    return `/team?${s}`
  }

  return <main className="px-4 py-6 md:px-6 md:py-8">
    <div className="mx-auto max-w-detail space-y-6">
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:px-0">
        {teams.map((t) => <TeamChip key={t.id} href={`/team?t=${t.id}`} active={t.id === current.id}>{t.name}</TeamChip>)}
        <span className="ml-auto shrink-0"><AddTeamButton /></span>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-white">{current.name}</h1>
            <EditTeamButton key={current.id + current.name} teamId={current.id} name={current.name} />
          </div>
          {board?.nextMatch && <p className="mt-2 text-sm text-navy-300">次の試合 <Num className="font-bold text-white">{mdw(board.nextMatch.date)}</Num> {board.nextMatch.title} ・ あと <Num className="font-bold text-white">{board.nextMatch.daysUntil}</Num> 日</p>}
        </div>
        {current.coach_token && <CopyLink url={`${origin}/c/${current.coach_token}`} openLabel="指導者の画面を開く" />}
      </header>

      <div role="tablist" className="flex gap-1 border-b border-layer-10">
        <ViewTab href={`/team?t=${current.id}`} active={tab === 'schedule'}>予定と合流</ViewTab>
        <ViewTab href={`/team?t=${current.id}&tab=results`} active={tab === 'results'}>成績</ViewTab>
      </div>

      {board && <TeamBoardView board={board} view={view} ym={ym} day={day} href={href} playerHref={(id) => `/players/${id}?tab=team`}
        actions={<AddTeamEventButton teams={teams} currentTeamId={current.id} initialDate={day ?? today} variant="secondary" />}
        eventAction={(e) => <AddTeamEventButton key={`${e.id}-${e.date}-${e.time}-${e.kind}`} teams={teams} currentTeamId={current.id}
          edit={{ id: e.id, date: e.date, kind: e.kind, time: e.time ?? '', ...e.raw }} />} />}
      {data && <Results data={data} />}
    </div>
  </main>
}

function TeamChip({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return <Link href={href} aria-current={active ? 'page' : undefined} className={cn(
    'shrink-0 rounded-pill border px-4 py-1.5 text-sm font-bold transition-colors duration-fast',
    active ? 'border-gold-500/30 bg-gold-500/10 text-gold-400' : 'border-layer-10 text-navy-300 hover:bg-layer-5 hover:text-white',
  )}>{children}</Link>
}

function ViewTab({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return <Link href={href} role="tab" aria-selected={active} className={cn('shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors duration-fast',
    active ? 'border-gold-500 text-gold-400' : 'border-transparent text-navy-400 hover:text-navy-200')}>{children}</Link>
}

function Metric({ label, value, tone, first }: { label: string; value: ReactNode; tone?: Extract<Signal, 'act' | 'watch'>; first?: boolean }) {
  return <div className={cn('px-4', first ? 'pl-0' : 'border-l border-layer-5')}>
    <p className="text-2xs text-navy-400">{label}</p>
    <p className={cn('text-xl font-bold', tone ? SIGNAL[tone].text : 'text-white')}>{value}</p>
  </div>
}

function Results({ data }: { data: TeamData }) {
  const r = data.record
  const name = new Map(data.teams.map((t) => [t.id, t.name]))
  return <div className="space-y-6">
    <div className="flex items-stretch">
      <Metric first label="得点" value={<Num mono>{r.goalsFor}</Num>} />
      <Metric label="失点" value={<Num mono>{r.goalsAgainst}</Num>} />
      <Metric label="得失点差" value={<Num mono>{r.goalsFor - r.goalsAgainst > 0 ? '+' : ''}{r.goalsFor - r.goalsAgainst}</Num>} />
    </div>
    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">試合</h2>
      {data.results.length === 0
        ? <p className="text-sm text-navy-400">終わった試合はまだありません</p>
        : <List>{data.results.map((m) => {
            const res = m.score ? (m.score.for > m.score.against ? '勝' : m.score.for < m.score.against ? '敗' : '分') : null
            return <ListRow key={m.id} variant="standard">
              <Num mono className="w-16 shrink-0 text-2xs text-navy-300">{m.date} {m.weekday}</Num>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">vs {m.opponent}</span>
                <span className="block text-2xs text-navy-400">
                  {[!data.current && data.teams.length > 1 ? name.get(m.teamId) : null, m.homeAway === 'home' ? 'Home' : m.homeAway === 'away' ? 'Away' : null].filter(Boolean).join(' ・ ') || ' '}
                </span>
              </span>
              {res && <span className={cn('w-6 shrink-0 text-center text-sm font-bold', res === '勝' ? SIGNAL.good.text : res === '敗' ? SIGNAL.act.text : 'text-navy-300')}>{res}</span>}
              <ScoreButton eventId={m.id} opponent={m.opponent} score={m.score} />
            </ListRow>
          })}</List>}
    </section>
  </div>
}

