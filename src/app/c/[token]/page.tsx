import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadBoard, PART } from '@/lib/coach'
import { localTime } from '@/lib/date'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { SIGNAL } from '@/lib/design/signal'

export const dynamic = 'force-dynamic'


export default async function Board({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const b = await loadBoard(token)
  if (!b) notFound()
  const count = (s: string | null) => b.rows.filter((r) => r.status === s).length
  const metrics = [
    { label: '未設定', value: count(null), tone: 'text-white' },
    { label: '離脱中', value: count('out'), tone: SIGNAL.act.text },
    { label: '制限付き', value: count('limited'), tone: SIGNAL.watch.text },
    { label: '完全参加', value: count('full'), tone: 'text-white' },
  ]
  return <div lang="ja" className="min-h-screen shell-bg text-navy-100">
    <main className="mx-auto max-w-read px-5 pb-16 pt-safe">
      <div className="flex items-start justify-between gap-4 pt-6">
        <div>
          <h1 className="text-3xl font-bold text-white">本日の参加状況</h1>
          <p className="mt-1 text-sm text-navy-300">{b.team.name}</p>
        </div>
        <Num mono className="mt-2 shrink-0 text-2xs text-navy-400">{localTime(b.tz, new Date())} 更新</Num>
      </div>
      <div className="mt-6 flex items-stretch">
        {metrics.map((m, i) => <div key={m.label} className={cn('px-4', i === 0 ? 'pl-0' : 'border-l border-layer-5')}>
          <p className="text-2xs text-navy-400">{m.label}</p>
          <p className={cn('text-xl font-bold', m.value > 0 ? m.tone : 'text-white')}><Num mono>{m.value}</Num><span className="text-2xs font-normal text-navy-400"> 名</span></p>
        </div>)}
      </div>
      {b.rows.length === 0
        ? <p className="mt-8 text-sm text-navy-400">このチームの選手はまだ登録されていません。</p>
        : <div className="glass mt-8 overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
            {b.rows.map((r) => <Link key={r.id} href={`/c/${token}/${r.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-layer-5">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-white">{r.name}</span>
                {r.restriction && <span className="block text-2xs text-navy-400">{r.restriction}</span>}
              </span>
              <span className={cn('shrink-0 text-2xs font-bold', r.status ? PART[r.status].tone : 'text-navy-400')}>{r.status ? PART[r.status].word : '未設定'}</span>
            </Link>)}
          </div>}
      <p className="mt-4 text-2xs text-navy-400">選手名を選ぶと合流の見通しが開きます。詳しい状態はトレーナーまで。</p>
    </main>
  </div>
}
