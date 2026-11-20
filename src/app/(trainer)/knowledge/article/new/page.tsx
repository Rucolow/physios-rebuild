import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { ArticleForm } from '@/components/knowledge/ArticleForm'

export default async function NewArticlePage() {
  await requireTrainer()
  return <main className="mx-auto w-full max-w-[896px] px-4 py-6 text-white">
    <Link href="/knowledge" className="mb-4 inline-flex items-center gap-1 text-[14px] text-navy-300 hover:text-white"><ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />ナレッジ</Link>
    <h1 className="mb-6 text-[24px] font-bold">記事を書く</h1>
    <ArticleForm draft={{ title: '', summary: '', category: 'protocol_guide', body_region: '', evidence_grade: '', tags: '', body_md: '' }} />
  </main>
}
