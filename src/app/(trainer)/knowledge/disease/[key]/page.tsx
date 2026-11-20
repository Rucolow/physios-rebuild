import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { DISEASE_GUIDES } from '@/content/diseases'
import { ArticleBody } from '@/components/knowledge/ArticleBody'
import { healingText, loadDisease, protocolSheet, protocolTeamSteps } from '@/lib/knowledge'
import { ProtocolView } from '@/components/knowledge/ProtocolView'
import { Num } from '@/components/ui/Num'
import { cn } from '@/lib/cn'

export const dynamic = 'force-dynamic'

/** 疾患のページ。程度・術式ごとのプロトコルを、開いたものだけ中身を出す */
export default async function DiseasePage({ params, searchParams }: { params: Promise<{ key: string }>; searchParams: Promise<{ v?: string; s?: string }> }) {
  const trainer = await requireTrainer()
  const [{ key }, { v, s }] = await Promise.all([params, searchParams])
  const disease = await loadDisease(key)
  if (!disease) notFound()
  const open = disease.variants.find((x) => x.id === v) ?? null
  const section = s === 'team' ? 'team' : 'menu'
  const [rows, steps] = open ? await Promise.all([protocolSheet(open.id), protocolTeamSteps(open.id)]) : [[], []]
  const base = `/knowledge/disease/${key}`
  const guide = DISEASE_GUIDES[key] ?? null
  const related = guide ? await relatedArticles(trainer.id, guide.keywords) : []

  return <main className="px-4 py-6 md:px-6 md:py-8">
    <div className="mx-auto max-w-detail">
      <Link href="/knowledge" className="mb-4 inline-flex items-center gap-1 text-sm text-navy-400 hover:text-white">
        <ChevronLeft size={16} aria-hidden="true" />ナレッジ
      </Link>
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-3xl font-bold text-white">{disease.name}</h1>
        {guide?.status === 'draft' && <span className="text-2xs font-bold text-amber-400">監修前</span>}
      </div>
      {guide && <p className="mt-3 text-base leading-relaxed text-navy-200">{guide.lead}</p>}

      {guide && <div className="mt-8 space-y-3">
        {guide.sections.map((sec, i) => <details key={sec.id} open={i === 0} className="group overflow-hidden rounded-card border border-layer-10">
          <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 hover:bg-layer-5">
            <span className="min-w-0 flex-1 text-lg font-bold text-white">{sec.title}</span>
            <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-navy-400 transition-transform duration-fast group-open:rotate-180" />
          </summary>
          <div className="border-t border-layer-5 px-4 pb-4"><ArticleBody markdown={sec.body} /></div>
        </details>)}
      </div>}

      <h2 className="mb-3 mt-10 text-xl font-bold text-white">プロトコル</h2>
      <div className="space-y-3">
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

      {guide && <>
        <h2 className="mb-3 mt-10 text-xl font-bold text-white">関連記事</h2>
        {related.length === 0
          ? <p className="text-sm text-navy-400">この疾患を扱った記事は、BRÜCKE にまだありません。</p>
          : <div className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
              {related.map((a) => <Link key={a.id} href={`/knowledge/article/${a.id}`} className="block px-4 py-3 hover:bg-layer-5">
                <span className="block text-sm font-bold text-white">{a.title}</span>
                {a.summary && <span className="mt-0.5 block text-2xs text-navy-400">{a.summary}</span>}
              </Link>)}
            </div>}

        <h2 className="mb-3 mt-10 text-xl font-bold text-white">出典</h2>
        <ol className="space-y-2">
          {[...guide.sources].sort((x, y) => x.n - y.n).map((src) => <li key={src.n} id={`src-${src.n}`} className="flex gap-2 text-2xs leading-relaxed text-navy-300">
            <span className="w-6 shrink-0 text-navy-500">[{src.n}]</span>
            <a href={src.url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 hover:text-white">{src.text}</a>
          </li>)}
        </ol>
        <p className="mt-4 text-2xs text-navy-500">更新 {guide.updatedOn}{guide.quelle?.length ? `・Quelle ${guide.quelle.join('・')} を材料に含む` : ''}{guide.status === 'draft' ? '・清水さんの監修前' : ''}</p>
      </>}
    </div>
  </main>
}

/** 疾患の語を題・要約・札に含む記事（BRÜCKE と自分の記事） */
async function relatedArticles(trainerId: string, keywords: string[]) {
  const { data } = await adminDb()
    .from('knowledge_article')
    .select('id, title, summary, tags')
    .or(`owner_trainer_id.eq.${trainerId},source.eq.brucke`)
  return (data ?? []).filter((a) => keywords.some((k) => [a.title, a.summary ?? '', ...(a.tags ?? [])].join(' ').toLowerCase().includes(k.toLowerCase())))
}
