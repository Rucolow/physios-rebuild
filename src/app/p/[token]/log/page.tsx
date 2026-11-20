import { notFound } from 'next/navigation'
import { playerByToken } from '@/lib/auth'
import { loadPlayerDay } from '@/lib/playerDay'
import { LogChecklist } from '@/components/player/LogChecklist'

export const dynamic = 'force-dynamic'

/** 記録: 今日の種目を一覧で付ける（詳細を開かずに済ませたいとき） */
export default async function LogPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) notFound()
  const day = await loadPlayerDay(player, null)
  return <div className="space-y-4 pt-6">
    <h1 className="text-3xl font-bold text-white">記録</h1>
    {day.rest
      ? <p className="text-sm text-navy-300">今日は休みの日です。</p>
      : day.items === null
        ? <p className="text-sm text-navy-400">今日のメニューはまだありません。</p>
        : <LogChecklist token={token} items={day.items} />}
  </div>
}
