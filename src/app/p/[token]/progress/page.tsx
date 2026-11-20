import { notFound } from 'next/navigation'
import { playerByToken } from '@/lib/auth'
import { loadPlayerProgress } from '@/lib/playerApp'
import { Num } from '@/components/ui/Num'
import { cn } from '@/lib/cn'

export const dynamic = 'force-dynamic'

const md = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8))}`

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="glass rounded-card border border-layer-10 p-5">
    <div className="mb-4 flex items-baseline justify-between"><h2 className="text-sm font-bold text-navy-300">{title}</h2><span className="text-2xs text-navy-400">直近 7 日</span></div>
    {children}
  </section>
}

function Bars({ values, dates }: { values: (number | null)[]; dates: string[] }) {
  return <div>
    <div className="relative flex h-32 items-end gap-3 border-b border-layer-10">
      {values.map((v, i) => <div key={i} className="flex h-full flex-1 items-end justify-center">
        {v === null ? <span className="text-2xs text-navy-500">—</span> : <div className="w-full max-w-8 rounded-t-field bg-layer-20" style={{ height: `${Math.max(4, (v / 6) * 100)}%` }} title={String(v)} />}
      </div>)}
    </div>
    <div className="mt-2 flex gap-3">{dates.map((d) => <Num mono key={d} className="flex-1 text-center text-2xs text-navy-400">{md(d)}</Num>)}</div>
  </div>
}

export default async function ProgressPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) notFound()
  const p = await loadPlayerProgress(player)
  const dates = p.days.map((d) => d.date)
  return <div className="space-y-4 pt-6">
    <h1 className="text-3xl font-bold text-white">経過</h1>
    <Card title="痛みの推移"><Bars values={p.days.map((d) => d.pain)} dates={dates} /></Card>
    <Card title="疲労の推移"><Bars values={p.days.map((d) => d.fatigue)} dates={dates} /></Card>
    <Card title="実施の記録">
      <div className="space-y-2">
        {p.days.map((d) => <div key={d.date} className="flex items-center gap-3">
          <Num mono className="w-12 shrink-0 text-2xs text-navy-400">{md(d.date)}</Num>
          <span className="h-1.5 flex-1 overflow-hidden rounded-pill bg-layer-10">{d.total > 0 && <span className="block h-full bg-emerald-400" style={{ width: `${(d.done / d.total) * 100}%` }} />}</span>
          <Num mono className="w-12 shrink-0 text-right text-2xs text-navy-300">{d.total > 0 ? `${d.done} / ${d.total}` : '—'}</Num>
        </div>)}
      </div>
    </Card>
    {p.stages.length > 0 && <section className="glass rounded-card border border-layer-10 p-5">
      <h2 className="mb-4 text-sm font-bold text-navy-300">これまでの段階</h2>
      <div className="space-y-3">
        {p.stages.map((s, i) => {
          const now = i === p.stages.length - 1
          return <div key={`${s.from}-${i}`} className="flex items-center gap-4">
            <Num mono className="w-14 shrink-0 text-2xs text-navy-400">{md(s.from)}〜</Num>
            <span className={cn('min-w-0 flex-1 text-sm', now ? 'font-bold text-white' : 'text-navy-300')}>{s.name}</span>
            <span className={cn('shrink-0 text-2xs font-bold', now ? 'text-gold-400' : 'text-navy-400')}>{now ? 'いま' : '済'}</span>
          </div>
        })}
      </div>
    </section>}
  </div>
}
