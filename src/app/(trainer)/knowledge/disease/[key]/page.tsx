import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { healingText, loadDisease, protocolSheet, protocolTeamSteps } from '@/lib/knowledge'
import { ProtocolView } from '@/components/knowledge/ProtocolView'
import { Num } from '@/components/ui/Num'
import { cn } from '@/lib/cn'

export const dynamic = 'force-dynamic'

/** 疾患のページ。程度・術式ごとのプロトコルを、開いたものだけ中身を出す */
export default async function DiseasePage({ params, searchParams }: { params: Promise<{ key: string }>; searchParams: Promise<{ v?: string; s?: string }> }) {
  await requireTrainer()
  const [{ key }, { v, s }] = await Promise.all([params, searchParams])
  const disease = await loadDisease(key)
  if (!disease) notFound()
  const open = disease.variants.find((x) => x.id === v) ?? null
  const section = s === 'team' ? 'team' : 'menu'
  const [rows, steps] = open ? await Promise.all([protocolSheet(open.id), protocolTeamSteps(open.id)]) : [[], []]
  const base = `/knowledge/disease/${key}`

  return <main className="px-4 py-6 md:px-6 md:py-8">
    <div className="mx-auto max-w-detail">
      <Link href="/knowledge" className="mb-4 inline-flex items-center gap-1 text-sm text-navy-400 hover:text-white">
        <ChevronLeft size={16} aria-hidden="true" />ナレッジ
      </Link>
      <h1 className="text-3xl font-bold text-white">{disease.name}</h1>
      <div className="mt-6 space-y-3">
        {disease.variants.map((p) => {
          const isOpen = open?.id === p.id
          const heal = healingText(p)
          return <section key={p.id} id={p.id} className={cn('overflow-hidden rounded-card border', isOpen ? 'border-gold-500/40' : 'border-layer-10')}>
            <Link href={isOpen ? base : `${base}?v=${p.id}#${p.id}`} scroll={false} aria-expanded={isOpen} className="flex items-center gap-3 px-4 py-4 hover:bg-layer-5">
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-white">{p.name}</span>
                {heal && <span className="block text-2xs text-navy-400">治癒期間 {heal}</span>}
              </span>
              <ChevronDown size={18} aria-hidden="true" className={cn('shrink-0 text-navy-400 transition-transform duration-fast', isOpen && 'rotate-180')} />
            </Link>
            {isOpen && <div className="space-y-4 border-t border-layer-5 px-4 py-4">
              <div className="flex rounded-pill border border-layer-10 p-0.5 w-fit">
                <Link href={`${base}?v=${p.id}#${p.id}`} scroll={false} aria-current={section === 'menu' ? 'page' : undefined} className={cn('rounded-pill px-4 py-1.5 text-sm', section === 'menu' ? 'bg-layer-10 font-bold text-white' : 'text-navy-400 hover:text-white')}>メニュー</Link>
                <Link href={`${base}?v=${p.id}&s=team#${p.id}`} scroll={false} aria-current={section === 'team' ? 'page' : undefined} className={cn('rounded-pill px-4 py-1.5 text-sm', section === 'team' ? 'bg-layer-10 font-bold text-white' : 'text-navy-400 hover:text-white')}>チーム合流</Link>
              </div>
              {section === 'menu'
                ? rows.length === 0 ? <p className="text-sm text-navy-400">このプロトコルのメニューは未登録です。</p> : <ProtocolView rows={rows} articles={[]} />
                : steps.length === 0
                  ? <p className="text-sm text-navy-400">チーム練習の段階はまだ入っていません。</p>
                  : <div className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
                      {steps.map((st) => <div key={st.name} className="flex items-center gap-3 px-4 py-3">
                        <span className="min-w-0 flex-1 text-sm text-white">{st.name}{st.condition && <span className="block text-2xs text-navy-400">{st.condition}</span>}</span>
                        <Num mono className="shrink-0 text-sm text-navy-300">{st.week === null ? '目安なし' : `${st.week} 週目〜`}</Num>
                      </div>)}
                    </div>}
            </div>}
          </section>
        })}
      </div>
    </div>
  </main>
}
