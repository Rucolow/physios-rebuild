import { notFound } from 'next/navigation'
import { playerByToken } from '@/lib/auth'
import { loadPlayerDay } from '@/lib/playerDay'
import { loadPlayerStage } from '@/lib/playerApp'
import { PlayerHome } from '@/components/player/PlayerHome'

export const dynamic = 'force-dynamic'

export default async function PlayerPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ d?: string }> }) {
  const { token } = await params
  const { d } = await searchParams
  const player = await playerByToken(token)
  if (!player) notFound()
  const [day, stage] = await Promise.all([loadPlayerDay(player, d ?? null), loadPlayerStage(player)])
  return <PlayerHome key={day.date} token={token} day={day} stage={stage} />
}
