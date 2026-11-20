import { notFound } from 'next/navigation'
import { playerByToken } from '@/lib/auth'
import { loadPlayerDay } from '@/lib/playerDay'
import { loadPlayerStage } from '@/lib/playerApp'
import { PlayerHome } from '@/components/player/PlayerHome'

export const dynamic = 'force-dynamic'

/** 選手の画面は一枚だけ。今の状態・今日のメニュー・今日の報告 */
export default async function PlayerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) notFound()
  const [day, stage] = await Promise.all([loadPlayerDay(player, null), loadPlayerStage(player)])
  return <PlayerHome token={token} name={player.given_name} day={day} stage={stage} />
}
