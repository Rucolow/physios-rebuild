import { notFound } from 'next/navigation'
import { teamByCoachToken } from '@/lib/coach'
import { addDays, localDate } from '@/lib/date'
import { loadTeamBoard, mdw } from '@/lib/teamBoard'
import { Num } from '@/components/ui/Num'
import { TeamBoardView, type BoardView } from '@/components/team/TeamBoardView'

export const dynamic = 'force-dynamic'

/** 指導者の画面。トレーナーのチーム画面の「予定と合流」と同じものを、ログインなしで見せる */
export default async function Board({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ view?: string; ym?: string; day?: string }> }) {
  const [{ token }, q] = await Promise.all([params, searchParams])
  const team = await teamByCoachToken(token)
  if (!team) notFound()
  const today = localDate(team.tz)
  const view: BoardView = q.view === 'calendar' ? 'calendar' : 'timeline'
  const ym = /^\d{4}-\d{2}$/.test(q.ym ?? '') ? q.ym! : today.slice(0, 7)
  const day = /^\d{4}-\d{2}-\d{2}$/.test(q.day ?? '') ? q.day! : null
  const range = view === 'calendar' ? { from: addDays(`${ym}-01`, -7), to: addDays(`${ym}-01`, 42) } : { from: today, to: addDays(today, 56) }
  const board = await loadTeamBoard(team.id, team.tz, range)
  if (!board) notFound()
  const href = (p: { view?: BoardView; ym?: string; day?: string }) => {
    const s = new URLSearchParams()
    if (p.view === 'calendar') s.set('view', 'calendar')
    if (p.ym) s.set('ym', p.ym)
    if (p.day) s.set('day', p.day)
    const qs = s.toString()
    return qs ? `/c/${token}?${qs}` : `/c/${token}`
  }
  return <div lang="ja" className="min-h-screen shell-bg text-navy-100">
    <main className="mx-auto max-w-detail space-y-6 px-4 pb-16 pt-safe md:px-6">
      <header className="pt-6">
        <h1 className="text-3xl font-bold text-white">{board.team.name}</h1>
        {board.nextMatch && <p className="mt-2 text-sm text-navy-300">次の試合 <Num className="font-bold text-white">{mdw(board.nextMatch.date)}</Num> {board.nextMatch.title} ・ あと <Num className="font-bold text-white">{board.nextMatch.daysUntil}</Num> 日</p>}
      </header>
      <TeamBoardView board={board} view={view} ym={ym} day={day} href={href} />
    </main>
  </div>
}
