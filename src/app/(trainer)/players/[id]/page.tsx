import Link from 'next/link'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { CalendarDays, ChevronLeft, Smartphone } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { daysBetween, jaDate } from '@/lib/date'
import { loadKarte, loadPlayerHead, loadPlayerTeamEvents, loadReport, loadTeamSteps, loadWeek, type PlayerHead } from '@/lib/playerDetail'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { CopyLink } from '@/components/trainer/CopyLink'
import { WeekMenu } from '@/components/player-detail/WeekMenu'
import { KarteButton, ParticipationButton, WatchButton } from '@/components/player-detail/PlayerTools'

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

export default async function PlayerDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const [{ id }, { tab: tabParam }] = await Promise.all([params, searchParams])
  const tab: Tab = TABS.find((t) => t.id === tabParam)?.id ?? 'training'
  const trainer = await requireTrainer()
  const head = await loadPlayerHead(trainer, id)
  if (!head) notFound()
  const h = await headers()
  const origin = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`
  const part = head.participation ? PART[head.participation] : { word: '未設定', tone: 'oa-part--unset' }
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
                      {remaining !== null && <p className="oa-lstatusnote">{remaining < 0 ? <>復帰見込みを<Num>{-remaining}</Num>日超過</> : <>復帰まで <Num>{remaining}</Num> 日</>}</p>}
                    </div>
                  </div>
                </div>
                <p className="oa-lmeta">{meta.length ? meta.join(' · ') : '進行中の怪我なし'}</p>
                {head.restriction && <p className="oa-lmeta">制限: {head.restriction}</p>}
              </div>
              <div className="oa-lgap" />
              {head.expectedReturn && <ReturnCard head={head} />}
              <div className="flex flex-wrap gap-2 px-5 pb-5">
                <ParticipationButton playerId={head.id} status={head.participation} restriction={head.restriction} expectedReturn={head.expectedReturn} />
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
              {tab === 'chart' && <Chart head={head} />}
              {tab === 'team' && <Team head={head} tz={trainer.time_zone} />}
              {tab === 'report' && <Report head={head} />}
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
          <div><p className="oa-retlabel">復帰見込み</p><p className="oa-retdate"><Num>{slashDate(target)}</Num></p></div>
        </div>
        <span className="oa-retpill">{over ? <><Num>{-remaining}</Num> 日超過</> : <>あと <Num>{remaining}</Num> 日</>}</span>
      </div>
      <div className="oa-bar"><div className="oa-barfill" style={{ width: `${Math.round(ratio * 1000) / 10}%` }} /></div>
    </div>
  </div>
}

function PanelTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return <div className="mb-4 flex items-center gap-3">
    <span className="h-6 w-1 rounded-pill bg-gold-500" aria-hidden="true" />
    <h2 className="flex-1 text-[20px] font-bold text-white">{children}</h2>
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

async function Chart({ head }: { head: PlayerHead }) {
  const kartes = await loadKarte(head.id)
  return <>
    <PanelTitle action={<KarteButton playerId={head.id} today={head.today} />}>カルテ</PanelTitle>
    {kartes.length === 0 && <p className="text-sm text-navy-400">まだ記録はありません。音声メモで話すか、ここから書けます。</p>}
    <div className="space-y-3">
      {kartes.map((k) => <article key={k.id} className="rounded-card border border-layer-10 bg-layer-5 px-4 py-4">
        <p className="text-2xs text-navy-400"><Num>{jaDate(k.writtenOn).md}</Num></p>
        <p className="mt-1 text-sm font-bold text-white">{k.summary}</p>
        {k.parts.length > 0 && <dl className="mt-2 space-y-1">
          {k.parts.map(([l, v]) => <div key={l} className="flex gap-3 text-sm">
            <dt className="w-16 shrink-0 pt-0.5 text-2xs text-navy-400">{l}</dt>
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

async function Team({ head, tz }: { head: PlayerHead; tz: string }) {
  const [events, plans] = await Promise.all([loadPlayerTeamEvents(head, tz), loadTeamSteps(head)])
  const WD = ['日', '月', '火', '水', '木', '金', '土']
  return <>
    <PanelTitle>チーム合流</PanelTitle>
    <div className="mb-5 rounded-card border border-layer-10 bg-layer-5 px-4 py-3 text-sm text-navy-200">
      {head.participation === null
        ? '参加区分がまだ決まっていません。左の「参加区分」から決めると、指導者にも伝わります。'
        : <>今は<span className="font-bold text-white">{PART[head.participation].word}</span>{head.restriction ? `（${head.restriction}）` : ''}{head.expectedReturn ? `。復帰見込みは ${jaDate(head.expectedReturn).md}` : ''}。</>}
    </div>
    {plans.filter((p) => p.steps.length > 0).map((p) => <section key={p.label} className="mb-6">
      <h3 className="mb-1 text-sm font-bold text-white">チーム練習の段階</h3>
      <p className="mb-2 text-2xs text-navy-400">{p.label} ・ 今 <Num>{p.week}</Num> 週目 ・ 週はプロトコルの目安</p>
      <div className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
        {p.steps.map((s) => {
          const reached = s.week !== null && p.week >= s.week
          return <div key={s.name} className="flex items-center gap-3 px-4 py-3">
            <span className={cn('h-2 w-2 shrink-0 rounded-pill', reached ? 'bg-emerald-400' : 'bg-layer-20')} aria-hidden="true" />
            <span className={cn('min-w-0 flex-1 text-sm', reached ? 'text-white' : 'text-navy-300')}>{s.name}{s.condition && <span className="block text-2xs text-navy-400">{s.condition}</span>}</span>
            <Num mono className={cn('shrink-0 text-2xs', reached ? 'text-emerald-400' : 'text-navy-400')}>{s.week === null ? '目安なし' : `${s.week}週目〜`}</Num>
          </div>
        })}
      </div>
    </section>)}
    <h3 className="mb-2 text-sm font-bold text-white">{head.team ?? 'チーム'}のこれからの予定</h3>
    {!head.teamId
      ? <p className="text-sm text-navy-400">この選手はチームに入っていません。</p>
      : events.length === 0
        ? <p className="text-sm text-navy-400">6 週間先までの予定はありません。チームの画面から足せます。</p>
        : <div className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
            {events.map((e) => {
              const ok = head.expectedReturn ? e.date >= head.expectedReturn : head.participation === 'full'
              return <div key={e.id} className="flex items-center gap-3 px-4 py-3">
                <Num mono className="w-16 shrink-0 text-2xs text-navy-300">{Number(e.date.slice(5, 7))}/{Number(e.date.slice(8))} {WD[new Date(`${e.date}T00:00:00Z`).getUTCDay()]}</Num>
                <span className="min-w-0 flex-1 text-sm text-white">{e.kind === 'match' ? `vs ${e.opponent ?? '相手未定'}` : e.kind === 'training' ? 'チーム練習' : 'オフ'}</span>
                <span className={cn('shrink-0 text-2xs font-bold', ok ? 'text-emerald-400' : 'text-navy-400')}>{e.kind === 'off' ? '' : ok ? '合流見込み' : head.participation === 'limited' ? '制限付き' : '不参加'}</span>
              </div>
            })}
          </div>}
  </>
}

async function Report({ head }: { head: PlayerHead }) {
  const r = await loadReport(head)
  const shown = r.days.filter((d) => d.total > 0 || d.pain !== null || d.fatigue !== null)
  return <>
    <PanelTitle>レポート（直近 4 週）</PanelTitle>
    <div className="mb-5 flex gap-6">
      <div><p className="text-2xs text-navy-400">メニューの実施</p><p className="text-2xl font-bold text-white">{r.rate === null ? '—' : <><Num>{r.rate}</Num><span className="text-sm text-navy-300"> %</span></>}</p></div>
      <div><p className="text-2xs text-navy-400">調子の記録</p><p className="text-2xl font-bold text-white"><Num>{r.days.filter((d) => d.pain !== null || d.fatigue !== null).length}</Num><span className="text-sm text-navy-300"> 日</span></p></div>
    </div>
    {shown.length === 0
      ? <p className="text-sm text-navy-400">この 4 週の記録はありません。</p>
      : <div className="overflow-hidden rounded-card border border-layer-10">
          <div className="grid grid-cols-[4rem_1fr_3rem_3rem] gap-2 border-b border-layer-10 bg-layer-5 px-4 py-2 text-2xs text-navy-400"><span>日付</span><span>実施</span><span>痛み</span><span>疲労</span></div>
          {shown.slice().reverse().map((d) => <div key={d.date} className="grid grid-cols-[4rem_1fr_3rem_3rem] items-center gap-2 border-b border-layer-5 px-4 py-2 text-sm last:border-b-0">
            <Num mono className="text-2xs text-navy-300">{jaDate(d.date).md}</Num>
            <span className="flex items-center gap-2">
              {d.total > 0 ? <>
                <span className="h-1.5 w-16 overflow-hidden rounded-pill bg-layer-10"><span className="block h-full bg-emerald-400" style={{ width: `${(d.done / d.total) * 100}%` }} /></span>
                <Num className="text-2xs text-navy-300">{d.done}/{d.total}</Num>
              </> : <span className="text-2xs text-navy-500">—</span>}
            </span>
            <Num className="text-navy-100">{d.pain ?? '—'}</Num>
            <Num className="text-navy-100">{d.fatigue ?? '—'}</Num>
          </div>)}
        </div>}
    {r.comments.length > 0 && <div className="mt-5 space-y-2">
      <h3 className="text-sm font-bold text-white">選手のひとこと</h3>
      {r.comments.slice().reverse().map((c) => <p key={c.date} className="text-sm text-navy-200"><Num className="mr-2 text-2xs text-navy-400">{jaDate(c.date).md}</Num>{c.comment}</p>)}
    </div>}
  </>
}
