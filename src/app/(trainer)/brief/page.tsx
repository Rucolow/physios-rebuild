import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { loadBrief } from '@/lib/brief'
import { jaDate } from '@/lib/date'
import { Num } from '@/components/ui/Num'
import { StateWord } from '@/components/ui/StateWord'
import { button } from '@/components/ui/Button'
import { BriefNote } from '@/components/trainer/BriefNote'

export default async function BriefPage() {
  const trainer = await requireTrainer()
  const b = await loadBrief(trainer)
  const d = jaDate(b.today)
  const behind = b.players.filter((p) => p.yesterday && p.yesterday.done < p.yesterday.total)

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-read space-y-section">
        <section className="space-y-4">
          <div>
            <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">
              <Num>{d.full}</Num> {d.wd}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">おはようございます</h1>
          </div>
          <div className="flex items-end gap-3">
            <div>
              <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">次の試合まで</p>
              {b.nextMatch ? (
                <p className="mt-1 text-white">
                  <Num className="text-4xl font-bold">{b.nextMatch.days}</Num>
                  <span className="ml-1 text-2xs text-navy-400">日</span>
                </p>
              ) : (
                <p className="mt-1 text-4xl font-bold text-navy-500">—</p>
              )}
            </div>
            {b.nextMatch && (
              <p className="pb-1 text-2xs text-navy-400">
                {[b.nextMatch.opponent, b.nextMatch.note].filter(Boolean).join('・')}
              </p>
            )}
          </div>
        </section>

        {b.unconfirmed > 0 && (
          <div className="flex w-full items-center gap-3 rounded-field border border-gold-500/30 bg-gold-500/10 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">未確定の記録が繰り越されています</p>
              <p className="text-2xs text-navy-300">
                未確定 <Num>{b.unconfirmed}</Num> 件
              </p>
            </div>
            <Link href="/digest" className={button({ variant: 'primary', size: 'sm' })}>ダイジェストを開く</Link>
          </div>
        )}

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">近況</h2>
          <BriefNote />
          <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
            {behind.length === 0 ? (
              <p className="px-5 py-4 text-sm text-navy-400">要対応なし</p>
            ) : (
              behind.map((p) => (
                <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                  <p className="min-w-0 flex-1 text-sm font-bold text-white">{p.name}</p>
                  <StateWord tone="watch">{p.yesterday!.done === 0 ? '昨日は未実施' : '昨日は一部実施'}</StateWord>
                  <Num className="text-2xs text-navy-400">
                    {p.yesterday!.done}/{p.yesterday!.total}
                  </Num>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">今日のメニュー</h2>
          <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
            {b.players.map((p) => (
              <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors duration-fast hover:bg-layer-5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white">{p.name}</p>
                  <p className="mt-1 text-2xs text-navy-400">
                    {p.episode ? (
                      <>
                        {p.episode.label}・<Num>{p.episode.week}</Num> 週目・{p.episode.period ?? '時期は未指定'}
                      </>
                    ) : (
                      '進行中の怪我なし'
                    )}
                  </p>
                </div>
                {p.today ? (
                  p.today.rest ? (
                    <StateWord tone="none">休み</StateWord>
                  ) : (
                    <span className="text-2xs text-navy-400">
                      <Num className="text-base font-bold text-white">{p.today.count}</Num> 種目
                    </span>
                  )
                ) : (
                  <span className="text-2xs text-navy-500">—</span>
                )}
                <ChevronRight size={16} className="text-navy-500" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
