import Link from 'next/link'
import type { ReactNode } from 'react'
import { Num } from '@/components/ui/Num'
import { cn } from '@/lib/cn'
import { addDays } from '@/lib/date'
import { mdw, type BoardEvent, type BoardJoin, type BoardPlayer, type TeamBoard } from '@/lib/teamBoard'

export type BoardView = 'timeline' | 'calendar'

const WD = ['日', '月', '火', '水', '木', '金', '土']

/**
 * チームの予定と合流の見込み。トレーナーのチーム画面と指導者の画面で同じものを出す。
 * href は表示の切り替え（view・ym・day）の URL を作る。
 */
export function TeamBoardView({ board, view, ym, day, href, playerHref, actions }: {
  board: TeamBoard
  view: BoardView
  ym: string
  day: string | null
  href: (q: { view?: BoardView; ym?: string; day?: string }) => string
  playerHref?: (id: string) => string
  actions?: ReactNode
}) {
  return <div className="space-y-8">
    <Rejoins players={board.players} today={board.today} playerHref={playerHref} />
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-pill border border-layer-10 p-0.5">
          <Seg href={href({ view: 'timeline' })} active={view === 'timeline'}>タイムライン</Seg>
          <Seg href={href({ view: 'calendar', ym })} active={view === 'calendar'}>カレンダー</Seg>
        </div>
        <div className="ml-auto">{actions}</div>
      </div>
      {view === 'timeline'
        ? <Timeline board={board} playerHref={playerHref} />
        : <Calendar board={board} ym={ym} day={day} href={href} playerHref={playerHref} />}
    </section>
  </div>
}

function Seg({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return <Link href={href} aria-current={active ? 'page' : undefined} className={cn('rounded-pill px-4 py-1.5 text-sm', active ? 'bg-layer-10 font-bold text-white' : 'text-navy-400 hover:text-white')}>{children}</Link>
}

function Name({ id, name, playerHref }: { id: string; name: string; playerHref?: (id: string) => string }) {
  return playerHref ? <Link href={playerHref(id)} className="font-bold text-white hover:text-gold-400">{name}</Link> : <span className="font-bold text-white">{name}</span>
}

/** 合流の見込み。全て参加できる選手は人数だけ */
function Rejoins({ players, today, playerHref }: { players: BoardPlayer[]; today: string; playerHref?: (id: string) => string }) {
  const pending = players.filter((p) => p.status !== 'full')
  const full = players.length - pending.length
  return <section>
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-lg font-bold text-white">合流の見込み</h2>
      <p className="text-sm text-navy-400">全て参加できる選手 <Num className="font-bold text-white">{full}</Num> 人</p>
    </div>
    {pending.length === 0
      ? <p className="rounded-card border border-layer-10 bg-layer-5 px-4 py-4 text-sm text-navy-300">全員がチームの練習に参加できます。</p>
      : <div className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
          {pending.map((p) => {
            const next = p.steps.find((s) => !s.reached)
            return <div key={p.id} className="grid gap-2 px-4 py-3 md:grid-cols-[10rem_1fr_9rem] md:items-center md:gap-4">
              <p className="text-sm"><Name id={p.id} name={p.name} playerHref={playerHref} /></p>
              {p.steps.length === 0
                ? <p className="text-2xs text-navy-400">合流の目安はまだありません</p>
                : <div className="min-w-0">
                    <div className="flex gap-1" aria-hidden="true">
                      {p.steps.map((s, i) => <span key={i} className={cn('h-1.5 flex-1 rounded-pill', s.reached ? 'bg-emerald-400' : 'bg-layer-10')} />)}
                    </div>
                    <p className="mt-1.5 truncate text-2xs text-navy-300">
                      {p.steps.some((s) => s.reached) ? `参加できる: ${p.steps.filter((s) => s.reached).map((s) => s.name).join('・')}` : 'チームの練習には不参加'}
                      {next?.date && <span className="text-navy-400"> ／ 次 {next.name}　<Num>{mdw(next.date)}</Num>〜</span>}
                    </p>
                  </div>}
              <p className="text-sm md:text-right">
                {p.fullOn
                  ? <><span className="text-2xs text-navy-400">全て参加 </span><Num className="font-bold text-emerald-400">{mdw(p.fullOn)}</Num></>
                  : <span className="text-2xs text-navy-500">—</span>}
              </p>
            </div>
          })}
        </div>}
    {pending.some((p) => p.fullOn && p.fullOn < today) && null}
  </section>
}

function EventLine({ e, playerHref }: { e: BoardEvent; playerHref?: (id: string) => string }) {
  const out = e.limits.filter((l) => l.joinable.length === 0)
  const part = e.limits.filter((l) => l.joinable.length > 0)
  return <div className="flex gap-3 px-4 py-3">
    <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-pill', e.kind === 'match' ? 'bg-gold-400' : e.kind === 'training' ? 'border-2 border-navy-300' : 'bg-layer-20')} aria-hidden="true" />
    <div className="min-w-0 flex-1">
      <p className="flex flex-wrap items-baseline gap-x-2">
        {e.time && <Num mono className="text-sm text-navy-300">{e.time}</Num>}
        <span className={cn('text-sm', e.kind === 'off' ? 'text-navy-400' : 'font-bold text-white')}>{e.title}</span>
        {e.score && <Num mono className="text-sm text-navy-200">{e.score.for} - {e.score.against}</Num>}
        {e.movedFrom && <span className="text-2xs font-bold text-amber-400">{mdw(e.movedFrom)} から変更</span>}
      </p>
      {e.detail && <p className="text-2xs text-navy-400">{e.detail}</p>}
      {(out.length > 0 || part.length > 0) && <div className="mt-1.5 space-y-0.5 text-2xs">
        {out.length > 0 && <p className="text-red-400">不参加 <span className="text-navy-200">{out.map((l, i) => <span key={l.id}>{i > 0 && '・'}{playerHref ? <Link href={playerHref(l.id)} className="hover:text-white">{l.name}</Link> : l.name}</span>)}</span></p>}
        {part.map((l) => <p key={l.id} className="text-amber-400">一部参加 <span className="text-navy-200">{playerHref ? <Link href={playerHref(l.id)} className="hover:text-white">{l.name}</Link> : l.name}（{l.joinable.join('・')}）</span></p>)}
      </div>}
    </div>
  </div>
}

function JoinLine({ j, playerHref }: { j: BoardJoin; playerHref?: (id: string) => string }) {
  return <div className="flex gap-3 px-4 py-3">
    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-pill bg-emerald-400" aria-hidden="true" />
    <p className="min-w-0 flex-1 text-sm text-navy-200"><Name id={j.playerId} name={j.name} playerHref={playerHref} /> が {j.steps.join('・')} に参加できるようになります</p>
  </div>
}

function DayBlock({ date, today, events, joins, playerHref }: { date: string; today: string; events: BoardEvent[]; joins: BoardJoin[]; playerHref?: (id: string) => string }) {
  return <div className={cn('overflow-hidden rounded-card border', date === today ? 'border-gold-500' : 'border-layer-10')}>
    <p className={cn('border-b border-layer-5 px-4 py-2 text-sm font-bold', date === today ? 'text-gold-400' : 'text-navy-200')}>
      <Num>{mdw(date)}</Num>{date === today && ' 今日'}
    </p>
    <div className="divide-y divide-layer-5">
      {joins.map((j) => <JoinLine key={j.playerId + j.date} j={j} playerHref={playerHref} />)}
      {events.map((e) => <EventLine key={e.id} e={e} playerHref={playerHref} />)}
      {joins.length === 0 && events.length === 0 && <p className="px-4 py-3 text-sm text-navy-500">予定はありません</p>}
    </div>
  </div>
}

function Timeline({ board, playerHref }: { board: TeamBoard; playerHref?: (id: string) => string }) {
  const dates = [...new Set([...board.events.map((e) => e.date), ...board.joins.map((j) => j.date)])].filter((d) => d >= board.today).sort()
  if (dates.length === 0) return <p className="text-sm text-navy-400">これからの予定はありません。</p>
  return <div className="space-y-3">
    {dates.map((d) => <DayBlock key={d} date={d} today={board.today} events={board.events.filter((e) => e.date === d)} joins={board.joins.filter((j) => j.date === d)} playerHref={playerHref} />)}
  </div>
}

function Calendar({ board, ym, day, href, playerHref }: { board: TeamBoard; ym: string; day: string | null; href: (q: { view?: BoardView; ym?: string; day?: string }) => string; playerHref?: (id: string) => string }) {
  const first = `${ym}-01`
  const start = addDays(first, -new Date(`${first}T00:00:00Z`).getUTCDay())
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i))
  const shift = (n: number) => { const d = new Date(`${first}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + n); return d.toISOString().slice(0, 7) }
  const sel = day ?? (board.today.startsWith(ym) ? board.today : null)
  return <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
    <div className="overflow-hidden rounded-card border border-layer-10">
      <div className="flex items-center justify-between border-b border-layer-5 px-2 py-1.5">
        <Link href={href({ view: 'calendar', ym: shift(-1) })} className="rounded-field px-3 py-1.5 text-sm text-navy-300 hover:bg-layer-5 hover:text-white">前の月</Link>
        <Num className="text-sm font-bold text-white">{Number(ym.slice(0, 4))}年{Number(ym.slice(5))}月</Num>
        <Link href={href({ view: 'calendar', ym: shift(1) })} className="rounded-field px-3 py-1.5 text-sm text-navy-300 hover:bg-layer-5 hover:text-white">次の月</Link>
      </div>
      <div className="grid grid-cols-7 border-b border-layer-5">{WD.map((w) => <span key={w} className="py-1.5 text-center text-2xs text-navy-400">{w}</span>)}</div>
      <div className="grid grid-cols-7">
        {cells.map((d) => {
          const evs = board.events.filter((e) => e.date === d && e.kind !== 'off')
          const off = board.events.some((e) => e.date === d && e.kind === 'off')
          const joins = board.joins.filter((j) => j.date === d)
          return <Link key={d} href={href({ view: 'calendar', ym, day: d })} aria-label={mdw(d)}
            className={cn('flex min-h-16 flex-col gap-1 border-b border-r border-layer-5 p-1 hover:bg-layer-5 md:min-h-20',
              d.slice(0, 7) !== ym && 'opacity-40', d === sel && 'bg-layer-10', d === board.today && 'ring-1 ring-inset ring-gold-500')}>
            <Num className={cn('text-2xs', off ? 'text-navy-500' : 'text-navy-200')}>{Number(d.slice(8))}</Num>
            {evs.map((e) => <span key={e.id} className={cn('truncate rounded-badge px-1 text-2xs', e.kind === 'match' ? 'bg-gold-500/20 text-gold-400' : 'bg-layer-10 text-navy-200')}>
              <span className="md:hidden">{e.kind === 'match' ? '試' : '練'}</span><span className="hidden md:inline">{e.kind === 'match' ? '試合' : '練習'}</span>
            </span>)}
            {joins.length > 0 && <span className="truncate rounded-badge bg-emerald-400/15 px-1 text-2xs text-emerald-400"><span className="md:hidden">合</span><span className="hidden md:inline">合流 {joins.length}</span></span>}
          </Link>
        })}
      </div>
    </div>
    <div>
      {sel
        ? <DayBlock date={sel} today={board.today} events={board.events.filter((e) => e.date === sel)} joins={board.joins.filter((j) => j.date === sel)} playerHref={playerHref} />
        : <p className="text-sm text-navy-400">日付を選ぶと、その日の予定と参加できる選手が出ます。</p>}
    </div>
  </div>
}
