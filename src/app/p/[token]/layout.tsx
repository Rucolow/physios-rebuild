import { notFound } from 'next/navigation'
import { playerByToken } from '@/lib/auth'
import { PlayerNav } from '@/components/player/PlayerNav'

export default async function PlayerLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) notFound()
  return <div lang="ja" className="min-h-screen shell-bg text-navy-100">
    <header className="sticky top-0 z-nav border-b border-layer-5 glass pt-safe">
      <div className="mx-auto flex h-14 max-w-form items-center px-4"><p className="text-sm font-bold text-white">こんにちは、{player.given_name}</p></div>
    </header>
    <main className="mx-auto max-w-form px-4 pb-32">{children}</main>
    <PlayerNav token={token} />
  </div>
}
