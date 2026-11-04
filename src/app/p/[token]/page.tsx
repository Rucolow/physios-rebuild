import { notFound } from 'next/navigation'
import { playerByToken } from '@/lib/auth'
import { loadPlayerDay } from '@/lib/playerDay'
import { PlayerHome } from '@/components/player/PlayerHome'

export const dynamic = 'force-dynamic'

export default async function PlayerPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ d?: string }> }) {
  const { token } = await params
  const { d } = await searchParams
  const player = await playerByToken(token)
  if (!player) notFound()
  const day = await loadPlayerDay(player, d ?? null)
  return <PlayerHome token={token} givenName={player.given_name} day={day} />
}
