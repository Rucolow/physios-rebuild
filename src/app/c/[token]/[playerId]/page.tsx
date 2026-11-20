import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { loadBoard, PART } from '@/lib/coach'
import { jaDate } from '@/lib/date'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'

export const dynamic = 'force-dynamic'

export default async function BoardPlayer({ params }: { params: Promise<{ token: string; playerId: string }> }) {
  const { token, playerId } = await params
  const b = await loadBoard(token)
  const r = b?.rows.find((x) => x.id === playerId)
  if (!b || !r) notFound()
  const WD = ['日', '月', '火', '水', '木', '金', '土']
  return <div lang="ja" className="min-h-screen shell-bg text-navy-100">
    <main className="mx-auto max-w-read px-5 pb-16 pt-safe">
      <Link href={`/c/${token}`} className="mt-6 inline-flex items-center gap-1 text-sm text-navy-300 hover:text-white"><ChevronLeft size={16} aria-hidden="true" />一覧へ戻る</Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="text-4xl font-bold text-white">{r.name}</h1>
        <span className={cn('mt-3 shrink-0 text-sm font-bold', r.status ? PART[r.status].tone : 'text-navy-400')}>{r.status ? PART[r.status].word : '未設定'}</span>
      </div>
      <section className="glass mt-6 rounded-card border border-layer-10 p-5">
        <h2 className="text-lg font-bold text-white">合流の見通し</h2>
        <p className="mt-4 text-2xs font-bold text-navy-400">参加区分</p>
        <p className={cn('mt-1 text-sm font-bold', r.status ? PART[r.status].tone : 'text-navy-300')}>{r.status ? PART[r.status].word : '未設定'}</p>
        {r.restriction && <><p className="mt-4 text-2xs font-bold text-navy-400">制限</p><p className="mt-1 text-sm text-white">{r.restriction}</p></>}
        {r.status !== 'full' && <div className="mt-4 border-t border-layer-5 pt-4">
          <p className="text-2xs font-bold text-navy-400">復帰の見込み</p>
          <p className="mt-1 text-sm text-white">{r.expectedReturn ? <Num>{jaDate(r.expectedReturn).md}</Num> : 'まだ決まっていません'}</p>
        </div>}
      </section>
      {r.expectedReturn && b.events.length > 0 && <section className="mt-6">
        <h2 className="mb-2 text-sm font-bold text-white">これからの予定</h2>
        <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
          {b.events.map((e) => {
            const ok = e.date >= r.expectedReturn!
            return <div key={e.id} className="flex items-center gap-3 px-4 py-3">
              <Num mono className="w-16 shrink-0 text-2xs text-navy-300">{Number(e.date.slice(5, 7))}/{Number(e.date.slice(8))} {WD[new Date(`${e.date}T00:00:00Z`).getUTCDay()]}</Num>
              <span className="min-w-0 flex-1 text-sm text-white">{e.kind === 'match' ? `vs ${e.opponent ?? '相手未定'}` : 'チーム練習'}</span>
              <span className={cn('shrink-0 text-2xs font-bold', ok ? 'text-emerald-400' : 'text-navy-400')}>{ok ? '見込みの日以降' : '見込みの日より前'}</span>
            </div>
          })}
        </div>
      </section>}
      <p className="mt-4 text-2xs text-navy-400">見込みは現時点の判断です。状態により前後します。詳しい状態はトレーナーまで。</p>
    </main>
  </div>
}
