import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { healingText, loadProtocol, protocolSheet } from '@/lib/knowledge'
import { ProtocolView } from '@/components/knowledge/ProtocolView'

export const dynamic = 'force-dynamic'

export default async function ProtocolPage({ params }: { params: Promise<{ id: string }> }) {
  const trainer = await requireTrainer()
  const { id } = await params
  const protocol = await loadProtocol(id)
  if (!protocol) notFound()
  const [rows, { data: articles }] = await Promise.all([
    protocolSheet(id),
    // 解説記事: 題か札にこの怪我の語を含む、自分の記事と BRÜCKE の記事
    adminDb()
      .from('knowledge_article')
      .select('id, title')
      .or(`owner_trainer_id.eq.${trainer.id},source.eq.brucke`)
      .contains('tags', [protocol.title]),
  ])
  const sub = [
    protocol.grade !== null ? `Grade ${protocol.grade}` : null,
    protocol.severity_label,
    healingText(protocol) ? `治癒期間: ${healingText(protocol)}` : null,
  ].filter(Boolean)
  const total = rows.reduce((s, r) => s + r.itemCount, 0)

  return <main className="p-4">
    <div className="mx-auto w-full max-w-[1184px] text-white">
      <Link href="/knowledge?c=protocol" className="mb-6 inline-flex items-center gap-1 text-[14px] leading-[20px] text-white/50 hover:text-white/80">
        <ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
        ナレッジ
      </Link>
      <div className="space-y-6">
        <section className="rounded-[var(--oa-radius-lg)] border border-[color:var(--oa-border)] bg-white/[0.03] p-5">
          <h1 className="text-[20px] font-bold leading-[28px] text-white">{protocol.title}</h1>
          {sub.length > 0 && <p className="mt-1 text-[14px] leading-[20px] text-white/50">{sub.join(' ｜ ')}</p>}
          <p className="mt-3 border-t border-white/10 pt-3 text-[12px] leading-[16px] text-white/40 tabular-nums">
            時期 {rows.length} ・ 種目 {total}
          </p>
        </section>
        {rows.length === 0
          ? <p className="text-[14px] text-white/50">このプロトコルのメニューは未登録です。</p>
          : <ProtocolView rows={rows} articles={articles ?? []} />}
      </div>
    </div>
  </main>
}
