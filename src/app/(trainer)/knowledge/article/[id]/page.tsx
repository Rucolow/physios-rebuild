import type { ReactNode } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, ChevronLeft, ExternalLink, Pencil, User } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { ARTICLE_CATEGORIES, BODY_REGIONS, loadArticle, type ArticleCategory } from '@/lib/knowledge'
import { ArticleBody } from '@/components/knowledge/ArticleBody'
import { BookmarkButton } from '@/components/knowledge/BookmarkButton'

export const dynamic = 'force-dynamic'

function Pill({ className, children }: { className: string; children: ReactNode }) {
  return <span className={`rounded-pill px-3 py-1 text-[14px] leading-[20px] ${className}`}>{children}</span>
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer()
  const { id } = await params
  const a = await loadArticle(trainer, id)
  if (!a) notFound()
  const brucke = a.source === 'brucke'

  return <main className="mx-auto w-full max-w-[1184px]">
    <div className="min-h-screen bg-navy-700 pb-24 text-white">
      <div className="border-b border-layer-10 bg-gradient-to-b from-navy-800 to-navy-700">
        <div className="mx-auto max-w-[896px] px-6 py-8">
          <div className="mb-6 flex items-center justify-between gap-2">
            <Link href="/knowledge" className="flex items-center gap-2 text-[16px] leading-[24px] text-navy-300 hover:text-white">
              <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
              戻る
            </Link>
            <div className="flex items-center gap-2">
              <BookmarkButton articleId={a.id} bookmarked={a.bookmarked} title={a.title} />
              {a.mine && <Link href={`/knowledge/article/${a.id}/edit`} className="oa-button">
                <Pencil size={16} strokeWidth={2} aria-hidden="true" />
                編集する
              </Link>}
            </div>
          </div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Pill className="bg-gold-500/20 font-medium text-gold-300">{brucke ? 'BRÜCKE' : ARTICLE_CATEGORIES[a.category as ArticleCategory] ?? a.category}</Pill>
            {brucke && a.category && <Pill className="bg-layer-10 text-navy-200">{a.category}</Pill>}
            {a.body_region && <Pill className="bg-[rgba(59,130,246,0.2)] text-[#93C5FD]">{BODY_REGIONS[a.body_region as keyof typeof BODY_REGIONS] ?? a.body_region}</Pill>}
            {a.evidence_grade && <Pill className="bg-[rgba(34,197,94,0.2)] text-[#86EFAC]">エビデンス: {a.evidence_grade}</Pill>}
          </div>
          <h1 className="mb-4 text-[30px] font-black leading-[36px] text-white">{a.title}</h1>
          {a.summary && <p className="mb-6 text-[18px] leading-[28px] text-navy-200">{a.summary}</p>}
          <div className="flex flex-wrap items-center gap-6 text-[14px] leading-[20px] tabular-nums text-navy-400">
            {a.author_name && <div className="flex items-center gap-2"><User size={16} strokeWidth={2} aria-hidden="true" />{a.author_name}</div>}
            {a.published_on && <div className="flex items-center gap-2"><Calendar size={16} strokeWidth={2} aria-hidden="true" />公開: {a.published_on}</div>}
            {brucke && a.source_url && /^https:\/\//.test(a.source_url) && <a href={a.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold-400 hover:text-gold-300">
              BRÜCKE で読む<ExternalLink size={14} strokeWidth={2} aria-hidden="true" />
            </a>}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[896px] px-6 py-8">
        <ArticleBody markdown={a.body_md} />
        {(a.tags ?? []).length > 0 && <div className="mt-8 border-t border-layer-10 pt-6">
          <h3 className="mb-4 text-[18px] font-[600] leading-[28px] text-white">タグ</h3>
          <div className="flex flex-wrap gap-2">
            {(a.tags as string[]).map((t) => <span key={t} className="rounded-pill border border-layer-10 bg-layer-5 px-3 py-1 text-[14px] leading-[20px] text-navy-300">#{t}</span>)}
          </div>
        </div>}
      </div>
    </div>
  </main>
}
