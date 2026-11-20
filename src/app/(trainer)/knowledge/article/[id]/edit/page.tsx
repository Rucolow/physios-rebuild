import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { loadArticle } from '@/lib/knowledge'
import { ArticleForm } from '@/components/knowledge/ArticleForm'

export const dynamic = 'force-dynamic'

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer()
  const { id } = await params
  const a = await loadArticle(trainer, id)
  if (!a || !a.mine) notFound()
  return <main className="mx-auto w-full max-w-[896px] px-4 py-6 text-white">
    <Link href={`/knowledge/article/${id}`} className="mb-4 inline-flex items-center gap-1 text-[14px] text-navy-300 hover:text-white"><ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />記事</Link>
    <h1 className="mb-6 text-[24px] font-bold">記事を直す</h1>
    <ArticleForm draft={{ id, title: a.title, summary: a.summary ?? '', category: a.category, body_region: a.body_region ?? '', evidence_grade: a.evidence_grade ?? '', tags: (a.tags ?? []).join('、'), body_md: a.body_md }} />
  </main>
}
