import { notFound } from 'next/navigation'
import { playerByToken } from '@/lib/auth'

export default async function PlayerLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) notFound()
  return <div lang="ja" className="min-h-screen shell-bg text-navy-100">
    <main className="mx-auto max-w-form px-4 pb-16 pt-safe">{children}</main>
  </div>
}
