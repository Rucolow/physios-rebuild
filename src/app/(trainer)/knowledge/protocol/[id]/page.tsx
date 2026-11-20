import { notFound, redirect } from 'next/navigation'
import { requireTrainer } from '@/lib/auth'
import { loadProtocol } from '@/lib/knowledge'

export const dynamic = 'force-dynamic'

/** 旧い URL。疾患のページの該当するプロトコルを開く */
export default async function ProtocolPage({ params }: { params: Promise<{ id: string }> }) {
  await requireTrainer()
  const { id } = await params
  const p = await loadProtocol(id)
  if (!p) notFound()
  redirect(`/knowledge/disease/${p.injury_key}?v=${p.id}#${p.id}`)
}
