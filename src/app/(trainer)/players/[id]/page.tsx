import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { CalendarDays, ChevronLeft, Smartphone } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { daysBetween, jaDate } from '@/lib/date'
import { loadKarte, loadKarteFields, loadPlayerHead, loadPlayerTeamEvents, loadReport, loadWeek, type PlayerHead, type ReportScale } from '@/lib/playerDetail'
import { loadRejoin } from '@/lib/rejoin'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { CopyLink } from '@/components/trainer/CopyLink'
import { WeekMenu } from '@/components/player-detail/WeekMenu'
import { KarteButton, KarteFieldsButton, WatchButton } from '@/components/player-detail/PlayerTools'
import { KarteDateNav } from '@/components/player-detail/KarteDateNav'

export const dynamic = 'force-dynamic'

const TABS = [
  { id: 'training', label: 'トレーニング' },
  { id: 'chart', label: 'カルテ' },
  { id: 'team', label: 'チーム合流' },
  { id: 'report', label: 'レポート' },
] as const
type Tab = (typeof TABS)[number]['id']

const PART = {
  full: { word: '完全参加', tone: 'oa-part--full' },
  limited: { word: '制限付き', tone: 'oa-part--limited' },
  out: { word: '離脱', tone: 'oa-part--out' },
} as const

function slashDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${Number(m)}/${Number(d)}/${y}`
}

export default async function PlayerDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string; d?: string; scale?: string }> }) {
  const [{ id }, { tab: tabParam, d, scale }] = await Promise.all([params, searchParams])
  const tab: Tab = TABS.find((t) => t.id === tabParam)?.id ?? 'training'
  const trainer = await requireTrainer()
  const head = await loadPlayerHead(trainer, id)
  if (!head) notFound()
  const h = await headers()
  const origin = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`
  const part = head.participation ? PART[head.participation] : { word: '合流の目安なし', tone: 'oa-part--unset' }
  const remaining = head.expectedReturn ? daysBetween(head.today, head.expectedReturn) : null
  const meta = [head.team, ...head.active.map((e) => `${e.label} ・ ${e.week}週目`), head.fictional ? '架空の選手' : null].filter(Boolean)

  return <main className="oa-root">
    <div className="oa-page">
      <div className="oa-pwrap">
        <div className="oa-pgrid">
          <div className="oa-lcol">
            <div className="oa-lcard">
              <div className="oa-lhead">
                <div className="oa-lnamerow">
                  <Link href="/players" className="oa-back" aria-label="選手一覧へ戻る"><ChevronLeft size={16} strokeWidth={2} aria-hidden="true" /></Link>
                  <h1 className="oa-lname">{head.name}</h1>
                  <div className={cn('oa-lstatus', part.tone)}>
                    <div className="oa-ping" aria-hidden="true"><div className="oa-ping-dot">{head.participation === 'out' && <div className="oa-ping-ring" />}</div></div>
                    <div>
                      <p className="oa-lstatusword">{part.word}</p>
                      {remaining !== null && <p className="oa-lstatusnote">{remaining < 0 ? <>合流見込みを<Num>{-remaining}</Num>日超過</> : <>全合流まで <Num>{remaining}</Num> 日</>}</p>}
                    </div>
                  </div>
                </div>
                <p className="oa-lmeta">{meta.length ? meta.join(' · ') : '進行中の怪我なし'}</p>
                {head.restriction && <p className="oa-lmeta">参加できる: {head.restriction}</p>}
              </div>
              <div className="oa-lgap" />
              {head.expectedReturn && <ReturnCard head={head} />}
              <div className="flex flex-wrap gap-2 px-5 pb-5">
                <WatchButton playerId={head.id} watching={head.watching} />
              </div>
            </div>

            <div className="oa-lcard p-5">
              <h2 className="flex items-center gap-2 text-[18px] font-bold text-white"><Smartphone size={20} strokeWidth={2} aria-hidden="true" />選手用アプリ</h2>
              <p className="mt-3 text-[14px] leading-[22px] text-navy-300">このリンクを{head.name}さんと共有してください。選手はこのリンクからメニューを見て、実施と調子を記録できます。</p>
              <div className="mt-4"><CopyLink url={`${origin}/p/${head.token}`} /></div>
            </div>
          </div>

          <div className="oa-rcol">
            <div className="oa-tabs">
              {TABS.map((t) => <div key={t.id} className="oa-tabwrap">
                <Link href={`/players/${head.id}?tab=${t.id}`} className="oa-tab" data-active={t.id === tab} aria-current={t.id === tab ? 'page' : undefined}>{t.label}</Link>
              </div>)}
            </div>
            <div className="oa-panel">
              {tab === 'training' && <Training head={head} />}
              {tab === 'chart' && <Chart head={head} date={d} />}
              {tab === 'team' && <Team head={head} tz={trainer.time_zone} />}
              {tab === 'report' && <Report head={head} scale={scale === 'month' || scale === 'year' ? scale : 'week'} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
}

function ReturnCard({ head }: { head: PlayerHead }) {
  const target = head.expectedReturn!
  const remaining = daysBetween(head.today, target)
  const over = remaining < 0
  const start = head.active.map((e) => e.injuredOn).sort()[0]
  const ratio = start ? Math.min(1, Math.max(0, daysBetween(start, head.today) / Math.max(1, daysBetween(start, target)))) : 1
  return <div className="oa-lret">
    <div className={cn('oa-retcard', over && 'oa-retcard--over')}>
      <div className="oa-retrow">
        <div className="oa-retleft">
          <div className="oa-reticon"><CalendarDays size={16} strokeWidth={2} aria-hidden="true" /></div>
          <div><p className="oa-retlabel">全て合流できる見込み</p><p className="oa-retdate"><Num>{slashDate(target)}</Num></p></div>
        </div>
        <span className="oa-retpill">{over ? <><Num>{-remaining}</Num> 日超過</> : <>あと <Num>{remaining}</Num> 日</>}</span>
      </div>
      <div className="oa-bar"><div className="oa-barfill" style={{ width: `${Math.round(ratio * 1000) / 10}%` }} /></div>
    </div>
  </div>
}

function PanelTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="mb-4 flex flex-wrap items-center gap-3">
    <span className="h-6 w-1 rounded-pill bg-gold-500" aria-hidden="true" />
    <h2 className="flex-1 whitespace-nowrap text-[20px] font-bold text-white">{children}</h2>
    {action}
  </div>
}

async function Training({ head }: { head: PlayerHead }) {
  if (head.active.length === 0) return <><PanelTitle>週間メニュー</PanelTitle><p className="text-sm text-navy-400">進行中の怪我がないので、メニューはありません。</p></>
  const week = await loadWeek(head)
  return <>
    <PanelTitle>週間メニュー</PanelTitle>
    {week.days.length === 0
      ? <p className="text-sm text-navy-400">今週のメニューはまだありません。今の時期が決まると組まれます。</p>
      : <WeekMenu days={week.days} today={head.today} many={head.active.length > 1} />}
  </>
}

async function Chart({ head, date }: { head: PlayerHead; date?: string }) {
  const [kartes, fields] = await Promise.all([loadKarte(head.id), loadKarteFields(head.id)])
  const dates = [...new Set(kartes.map((k) => k.writtenOn))]
  const sel = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : dates[0] ?? head.today
  const shown = kartes.filter((k) => k.writtenOn === sel)
  return <>
    <PanelTitle action={<div className="flex gap-2"><KarteFieldsButton playerId={head.id} fields={fields} /><KarteButton playerId={head.id} today={sel} fields={fields} /></div>}>カルテ</PanelTitle>
    <KarteDateNav base={`/players/${head.id}?tab=chart`} date={sel} marked={dates} today={head.today} />
    <div className="mt-4 space-y-3">
      {shown.length === 0 && <p className="px-1 text-sm text-navy-400">この日の記録はありません。</p>}
      {shown.map((k) => <article key={k.id} className="rounded-card border border-layer-10 bg-layer-5 px-4 py-4">
        <p className="text-base font-bold text-white">{k.summary}</p>
        {k.parts.length > 0 && <dl className="mt-3 space-y-2">
          {k.parts.map(([l, v]) => <div key={l} className="flex gap-3 text-sm">
            <dt className="w-20 shrink-0 pt-0.5 text-2xs text-navy-400">{l}</dt>
            <dd className="min-w-0 flex-1 whitespace-pre-line text-navy-200">{v}</dd>
          </div>)}
        </dl>}
        {k.images.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">
          {k.images.map((im) => <a key={im.id} href={im.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-field border border-layer-10">
            {/* eslint-disable-next-line @next/next/no-img-element -- 期限つきの URL で、寸法が分からない */}
            <img src={im.url} alt="カルテの画像" className="aspect-square w-full object-cover" />
          </a>)}
        </div>}
      </article>)}
    </div>
  </>
}

const WDS = ['日', '月', '火', '水', '木', '金', '土']
const mdw = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8))}（${WDS[new Date(`${iso}T00:00:00Z`).getUTCDay()]}）`

async function Team({ head, tz }: { head: PlayerHead; tz: string }) {
  const [events, rejoin] = await Promise.all([loadPlayerTeamEvents(head, tz), loadRejoin([head.id], head.today)])
  const r = rejoin.get(head.id)
  const joinable = (date: string) => (r ? r.steps.filter((s) => s.date !== null && s.date <= date).map((s) => s.name) : null)
  return <>
    <PanelTitle>チーム合流</PanelTitle>
    {!r
      ? <p className="mb-6 text-sm text-navy-300">進行中の怪我はありません。チームの練習に全て参加できます。</p>
      : r.steps.length === 0
        ? <p className="mb-6 text-sm text-navy-400">{r.label} のプロトコルには、チーム練習の段階がありません。</p>
        : <section className="mb-8">
            <p className="mb-3 text-sm text-navy-300">{r.label} ・ 今 <Num>{r.week}</Num> 週目{r.fullOn ? <> ・ 全て合流できる見込み <span className="font-bold text-white"><Num>{mdw(r.fullOn)}</Num></span></> : ''}</p>
            <ol className="relative space-y-0 border-l border-layer-10 pl-5">
              {r.steps.map((s) => <li key={s.name} className="relative pb-4 last:pb-0">
                <span className={cn('absolute -left-[1.6rem] top-1 h-3 w-3 rounded-pill border-2', s.reached ? 'border-emerald-400 bg-emerald-400' : 'border-navy-500 bg-navy-900')} aria-hidden="true" />
                <div className="flex items-baseline justify-between gap-3">
                  <span className={cn('text-sm', s.reached ? 'text-white' : 'text-navy-300')}>{s.name}</span>
                  <Num mono className={cn('shrink-0 text-2xs', s.reached ? 'text-emerald-400' : 'text-navy-400')}>{s.reached ? '合流済み' : s.date ? `${mdw(s.date)}〜` : '目安なし'}</Num>
                </div>
                {s.condition && <p className="text-2xs text-navy-400">{s.condition}</p>}
              </li>)}
            </ol>
          </section>}
    <h3 className="mb-2 text-sm font-bold text-white">{head.team ?? 'チーム'}の予定</h3>
    {!head.teamId
      ? <p className="text-sm text-navy-400">この選手はチームに入っていません。</p>
      : events.length === 0
        ? <p className="text-sm text-navy-400">6 週間先までの予定はありません。</p>
        : <div className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
            {events.filter((e) => e.kind !== 'off').map((e) => {
              const j = joinable(e.date)
              const all = !r || (r.steps.length > 0 && j!.length === r.steps.length)
              return <div key={e.id} className="flex items-start gap-3 px-4 py-3">
                <Num mono className="w-20 shrink-0 pt-0.5 text-2xs text-navy-300">{mdw(e.date)}</Num>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-white">{e.kind === 'match' ? `vs ${e.opponent ?? '相手未定'}` : 'チーム練習'}</span>
                  {r && r.steps.length > 0 && !all && <span className="block text-2xs text-navy-400">{j!.length ? `参加できる: ${j!.join('・')}` : '参加できる練習はまだありません'}</span>}
                </span>
                {r && r.steps.length > 0 && <span className={cn('shrink-0 text-2xs font-bold', all ? 'text-emerald-400' : j!.length ? 'text-amber-400' : 'text-navy-500')}>{all ? '全て参加' : j!.length ? '一部参加' : '不参加'}</span>}
              </div>
            })}
          </div>}
  </>
}

const SCALES: { id: ReportScale; label: string }[] = [{ id: 'week', label: '週' }, { id: 'month', label: '月' }, { id: 'year', label: '年' }]

async function Report({ head, scale }: { head: PlayerHead; scale: ReportScale }) {
  const r = await loadReport(head, scale)
  const thin = r.buckets.length > 12
  const Bars = ({ title, value, max, tone }: { title: string; value: (b: (typeof r.buckets)[number]) => number | null; max: number; tone: string }) => <div>
    <p className="mb-2 text-2xs text-navy-400">{title}</p>
    <div className={cn('flex h-24 items-end', thin ? 'gap-px' : 'gap-1.5')}>
      {r.buckets.map((b) => { const v = value(b); return <div key={b.key} className="flex h-full flex-1 flex-col justify-end" title={`${b.label} ${v ?? '—'}`}>
        {v === null ? <span className="h-px w-full bg-layer-10" /> : <span className={cn('w-full rounded-t-badge', tone)} style={{ height: `${Math.max(4, (v / max) * 100)}%` }} />}
      </div> })}
    </div>
  </div>
  return <>
    <PanelTitle action={<div className="flex rounded-pill border border-layer-10 p-0.5">
      {SCALES.map((s) => <Link key={s.id} href={`/players/${head.id}?tab=report&scale=${s.id}`} aria-current={s.id === scale ? 'page' : undefined}
        className={cn('rounded-pill px-4 py-1.5 text-sm', s.id === scale ? 'bg-layer-10 font-bold text-white' : 'text-navy-400 hover:text-white')}>{s.label}</Link>)}
    </div>}>レポート</PanelTitle>
    <div className="mb-6 flex gap-8">
      <div><p className="text-2xs text-navy-400">メニューの実施</p><p className="text-2xl font-bold text-white">{r.rate === null ? '—' : <><Num>{r.rate}</Num><span className="text-sm text-navy-300"> %</span></>}</p></div>
      <div><p className="text-2xs text-navy-400">調子の記録</p><p className="text-2xl font-bold text-white"><Num>{r.reported}</Num><span className="text-sm text-navy-300"> 日</span></p></div>
    </div>
    <div className="space-y-5 rounded-card border border-layer-10 bg-layer-5 p-4">
      <Bars title="実施（%）" value={(b) => (b.total ? Math.round((b.done / b.total) * 100) : null)} max={100} tone="bg-emerald-400" />
      <Bars title="痛み（0〜6）" value={(b) => b.pain} max={6} tone="bg-red-400" />
      <Bars title="疲労（0〜6）" value={(b) => b.fatigue} max={6} tone="bg-amber-400" />
      <div className={cn('flex', thin ? 'gap-px' : 'gap-1.5')}>
        {r.buckets.map((b, i) => <Num key={b.key} mono className="flex-1 text-center text-2xs text-navy-500">{!thin || i % 5 === 0 || i === r.buckets.length - 1 ? b.label : ''}</Num>)}
      </div>
    </div>
    {r.comments.length > 0 && <div className="mt-5 space-y-2">
      <h3 className="text-sm font-bold text-white">選手のひとこと</h3>
      {r.comments.slice().reverse().map((c) => <p key={c.date} className="text-sm text-navy-200"><Num className="mr-2 text-2xs text-navy-400">{jaDate(c.date).md}</Num>{c.comment}</p>)}
    </div>}
  </>
}
