import Link from 'next/link'
import type { ReactNode } from 'react'
import { List, ListRow, Num } from '@/components/ui'
import { listRow } from '@/components/ui/ListRow'
import { AddTeamEventButton } from '@/components/trainer/AddTeamEventButton'
import { AddTeamButton, ScoreButton } from '@/components/trainer/TeamTools'
import { MonthlyCalendar } from '@/components/trainer/MonthlyCalendar'
import { SIGNAL, type Signal } from '@/lib/design/signal'
import { requireTrainer } from '@/lib/auth'
import { loadTeam, loadTeamMonth, type TeamData, type TeamPlayer } from '@/lib/team'
import type { ScheduleEvent } from '@/lib/types'
import { cn } from '@/lib/utils'

type Tab = 'schedule' | 'results' | 'players'

/**
 * チーム。日程（元の physios のスケジュール：リスト／月間）・成績・選手を一つで見る。
 * 複数のチームは上のチップで切り替え、「全チーム」で重ねて見る。状態は URL に持つ。
 */
export default async function TeamPage({ searchParams }: { searchParams: Promise<{ t?: string; tab?: string; view?: string; ym?: string }> }) {
  const params = await searchParams
  const trainer = await requireTrainer()
  const data = await loadTeam(trainer, params.t ?? null)
  const tab: Tab = params.tab === 'results' || params.tab === 'players' ? params.tab : 'schedule'
  const month = tab === 'schedule' && params.view === 'month'
  const now = new Date(`${data.today}T00:00:00Z`)
  const [year, monthNo] = (params.ym ?? '').match(/^\d{4}-\d{2}$/)
    ? params.ym!.split('-').map(Number)
    : [now.getUTCFullYear(), now.getUTCMonth() + 1]
  const calendar = month ? await loadTeamMonth(trainer, data.current?.id ?? null, year, monthNo) : null
  const href = (q: Record<string, string | undefined>) => {
    const s = new URLSearchParams()
    const merged = { t: data.current?.id, tab: tab === 'schedule' ? undefined : tab, ...q }
    for (const [k, v] of Object.entries(merged)) if (v) s.set(k, v)
    const qs = s.toString()
    return qs ? `/team?${qs}` : '/team'
  }
  const prev = monthNo === 1 ? `${year - 1}-12` : `${year}-${String(monthNo - 1).padStart(2, '0')}`
  const next = monthNo === 12 ? `${year + 1}-01` : `${year}-${String(monthNo + 1).padStart(2, '0')}`
  const r = data.record

  return <main className="px-4 py-6 md:px-6 md:py-8">
    <div className="space-y-6">

      {/* チームの切り替え */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:px-0">
        {data.teams.length > 1 && <TeamChip href={`/team${tab === 'schedule' ? '' : `?tab=${tab}`}`} active={!data.current}>全チーム</TeamChip>}
        {data.teams.map((t) => <TeamChip key={t.id} href={`/team?t=${t.id}${tab === 'schedule' ? '' : `&tab=${tab}`}`} active={data.current?.id === t.id || (data.teams.length === 1)}>{t.name}</TeamChip>)}
        <span className="ml-auto shrink-0"><AddTeamButton /></span>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">{data.current?.name ?? (data.teams.length === 1 ? data.teams[0].name : 'チーム')}</h1>
          <div className="flex items-stretch">
            <Metric label="今季の成績" first value={<><Num mono>{r.win}</Num><span className="text-2xs font-normal text-navy-400"> 勝 </span><Num mono>{r.draw}</Num><span className="text-2xs font-normal text-navy-400"> 分 </span><Num mono>{r.loss}</Num><span className="text-2xs font-normal text-navy-400"> 敗</span></>} />
            <Metric label="今週の予定" value={<><Num mono>{data.thisWeek.length}</Num><span className="text-2xs font-normal text-navy-400"> 件</span></>} />
            <Metric label="日程変更" tone={data.changeCount > 0 ? 'watch' : undefined} value={<><Num mono>{data.changeCount}</Num><span className="text-2xs font-normal text-navy-400"> 件</span></>} />
          </div>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">次の試合まで</p>
          <p className="mt-1">
            {data.nextMatch
              ? <><Num mono className="text-4xl font-bold text-white">{data.nextMatch.daysUntil}</Num><span className="ml-1 text-sm text-navy-400">日</span></>
              : <Num mono className="text-4xl font-bold text-navy-500">—</Num>}
          </p>
          {data.nextMatch && <p className="mt-1 text-2xs text-navy-400">{data.nextMatch.opponent} ・ <Num>{data.nextMatch.when}</Num>{data.nextMatch.venue && ` ${data.nextMatch.venue}`}</p>}
        </div>
      </header>

      <div role="tablist" className="flex gap-1 border-b border-layer-10">
        <ViewTab href={href({ tab: undefined, view: undefined })} active={tab === 'schedule'}>日程</ViewTab>
        <ViewTab href={href({ tab: 'results', view: undefined })} active={tab === 'results'}>成績</ViewTab>
        <ViewTab href={href({ tab: 'players', view: undefined })} active={tab === 'players'}>選手</ViewTab>
      </div>

      {tab === 'schedule' && <>
        <div className="flex gap-1">
          <SubTab href={href({ view: undefined })} active={!month}>リスト</SubTab>
          <SubTab href={href({ view: 'month' })} active={month}>月間</SubTab>
        </div>
        {month && calendar
          ? <>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={href({ view: 'month', ym: prev })} className="rounded-field px-3 py-1.5 text-2xs font-bold text-navy-300 transition-colors duration-fast hover:bg-layer-5 hover:text-white">前の月</Link>
                <p className="text-sm font-bold text-white"><Num>{calendar.year}</Num>年<Num>{calendar.month}</Num>月</p>
                <Link href={href({ view: 'month', ym: next })} className="ml-auto rounded-field px-3 py-1.5 text-2xs font-bold text-navy-300 transition-colors duration-fast hover:bg-layer-5 hover:text-white">次の月</Link>
                <AddTeamEventButton teams={data.teams} currentTeamId={data.current?.id ?? null} variant="secondary" />
              </div>
              <MonthlyCalendar data={calendar} />
            </>
          : <ScheduleList data={data} />}
      </>}

      {tab === 'results' && <Results data={data} />}
      {tab === 'players' && <Players players={data.players} />}
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

function SubTab({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return <Link href={href} aria-current={active ? 'true' : undefined} className={cn('rounded-field px-3 py-1.5 text-2xs font-bold transition-colors duration-fast',
    active ? 'bg-layer-10 text-white' : 'text-navy-400 hover:bg-layer-5 hover:text-white')}>{children}</Link>
}

function Metric({ label, value, tone, first }: { label: string; value: ReactNode; tone?: Extract<Signal, 'act' | 'watch'>; first?: boolean }) {
  return <div className={cn('px-4', first ? 'pl-0' : 'border-l border-layer-5')}>
    <p className="text-2xs text-navy-400">{label}</p>
    <p className={cn('text-xl font-bold', tone ? SIGNAL[tone].text : 'text-white')}>{value}</p>
  </div>
}

function StateWord({ tone, gold, children }: { tone?: Signal; gold?: boolean; children: ReactNode }) {
  return <span className={cn('w-col-state shrink-0 text-right text-2xs font-bold', gold ? 'text-gold-400' : SIGNAL[tone ?? 'none'].text)}>{children}</span>
}

const EVENT_VARIANT = { past: 'completed', next: 'current', future: 'standard' } as const
const EVENT_DATE_TEXT = { past: 'text-navy-400', next: 'font-bold text-gold-400', future: 'text-navy-200' } as const

function EventRow({ event }: { event: ScheduleEvent }) {
  const past = event.state === 'past'
  return <div className={listRow({ variant: EVENT_VARIANT[event.state] })}>
    <span className="flex w-14 shrink-0 flex-col">
      <Num mono className={cn('text-2xs', EVENT_DATE_TEXT[event.state])}>{event.date} {event.weekday}</Num>
      <Num mono className={cn('text-2xs', past ? 'text-navy-400' : 'font-bold text-white')}>{event.time}</Num>
    </span>
    <span className="min-w-0 flex-1">
      <span className={cn('block text-sm', past ? 'text-navy-300' : 'font-bold text-white')}>{event.title}</span>
      {event.detail && <span className="block text-2xs text-navy-400">{event.detail}</span>}
    </span>
    {event.kind === 'match' && past && event.score
      ? <StateWord tone="none"><Num mono>{event.score.for}-{event.score.against}</Num></StateWord>
      : event.nowLabel
        ? <StateWord gold>{event.nowLabel}</StateWord>
        : event.tone && event.toneLabel
          ? <StateWord tone={event.tone}>{event.toneLabel}</StateWord>
          : <span className="w-col-state shrink-0" aria-hidden="true" />}
  </div>
}

function ScheduleList({ data }: { data: TeamData }) {
  return <div className="space-y-6">
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-white">今週</h2>
        <AddTeamEventButton teams={data.teams} currentTeamId={data.current?.id ?? null} initialDate={data.today} />
      </div>
      {data.thisWeek.length === 0
        ? <p className="text-sm text-navy-400">今週の予定はありません</p>
        : <List>{data.thisWeek.map((e) => <EventRow key={e.id} event={e} />)}</List>}
    </section>
    <section className="space-y-3">
      <h2 className="text-base font-bold text-white">来週以降</h2>
      {data.upcoming.length === 0
        ? <p className="text-sm text-navy-400">来週以降の予定はありません</p>
        : <List>{data.upcoming.map((e) => <EventRow key={e.id} event={e} />)}</List>}
    </section>
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

const PART = {
  out: { label: '離脱中', tone: 'act' as Signal },
  limited: { label: '制限付き', tone: 'watch' as Signal },
  full: { label: '完全参加', tone: 'good' as Signal },
}

function Players({ players }: { players: TeamPlayer[] }) {
  const groups: { key: string; label: string; rows: TeamPlayer[] }[] = [
    { key: 'out', label: '離脱中', rows: players.filter((p) => p.participation === 'out') },
    { key: 'limited', label: '制限付き', rows: players.filter((p) => p.participation === 'limited') },
    { key: 'full', label: '完全参加', rows: players.filter((p) => p.participation === 'full') },
    { key: 'unset', label: '参加区分 未設定', rows: players.filter((p) => p.participation === null) },
  ]
  if (players.length === 0) return <p className="text-sm text-navy-400">このチームの選手はまだいません。選手の画面で足せます。</p>
  return <div className="space-y-6">
    {groups.filter((g) => g.rows.length > 0).map((g) => <section key={g.key} className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold text-white">{g.label}</h2>
        <span className="text-2xs text-navy-400"><Num>{g.rows.length}</Num> 名</span>
      </div>
      <List>{g.rows.map((p) => <Link key={p.id} href={`/players/${p.id}`} className="block">
        <ListRow variant="interactive">
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-white">{p.name}</span>
            {(p.restriction || p.expectedReturn) && <span className="block truncate text-2xs text-navy-400">
              <Num>{[p.restriction, p.expectedReturn ? `復帰見込み ${p.expectedReturn.slice(5).replace('-', '/')}` : null].filter(Boolean).join(' ・ ')}</Num>
            </span>}
          </span>
          {p.participation
            ? <StateWord tone={p.watching && p.participation === 'full' ? 'watch' : PART[p.participation].tone}>{p.watching && p.participation === 'full' ? '要観察' : PART[p.participation].label}</StateWord>
            : <StateWord tone="none">未設定</StateWord>}
        </ListRow>
      </Link>)}</List>
    </section>)}
  </div>
}
