import Link from 'next/link'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { personName } from '@/lib/format/name'
import { daysBetween, localDate, weekSince } from '@/lib/date'
import { playerStates } from '@/lib/team'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { SIGNAL } from '@/lib/design/signal'
import { AddPlayer } from '@/components/trainer/AddPlayer'
import { PlayerList, type PlayerRow } from '@/components/trainer/PlayerList'

export const dynamic = 'force-dynamic'

type Row = PlayerRow

export default async function PlayersPage({ searchParams }: { searchParams: Promise<{ q?: string; team?: string }> }) {
  const trainer = await requireTrainer()
  const { q = '', team = '' } = await searchParams
  const db = adminDb()
  const today = localDate(trainer.time_zone)
  const [{ data: players }, { data: teams }, { data: eps }] = await Promise.all([
    db.from('player').select('id, family_name, given_name, aliases, team, team_id, is_fictional').eq('trainer_id', trainer.id).eq('is_active', true).order('family_name'),
    db.from('team').select('id, name').eq('trainer_id', trainer.id).order('sort_order').order('created_at'),
    db.from('injury_episode').select('player_id, label, injured_on, player!inner(trainer_id)').eq('status', 'active').eq('player.trainer_id', trainer.id),
  ])
  const st = await playerStates((players ?? []).map((p) => p.id))
  const rows: (Row & { teamId: string | null })[] = (players ?? []).map((p) => {
    const s = st.status.get(p.id)
    const mine = (eps ?? []).filter((e) => e.player_id === p.id)
    const ret = s?.expected_return ? daysBetween(today, s.expected_return) : null
    return {
      id: p.id,
      teamId: p.team_id,
      name: personName(p.family_name, p.given_name),
      meta: [p.team, ...mine.map((e) => `${e.label} ・ ${weekSince(e.injured_on, today)}週目`), s?.restriction, p.is_fictional ? '架空' : null].filter(Boolean).join(' ・ ') || '進行中の怪我なし',
      status: (s?.status as Row['status']) ?? null,
      watching: st.watching.has(p.id),
      right: ret === null ? null : ret > 0 ? `あと ${ret} 日` : ret === 0 ? '本日' : `${-ret} 日超過`,
      urgent: ret !== null && ret <= 7,
      text: [p.family_name, p.given_name, `${p.family_name}${p.given_name}`, ...(p.aliases ?? []), p.team ?? '', ...mine.map((e) => e.label)].join(' '),
    }
  })
  const count = (f: (r: Row) => boolean) => rows.filter(f).length
  const metrics = [
    { label: '離脱中', value: count((r) => r.status === 'out'), tone: SIGNAL.act.text },
    { label: '制限付き', value: count((r) => r.status === 'limited'), tone: SIGNAL.watch.text },
    { label: '要観察', value: count((r) => r.watching), tone: SIGNAL.watch.text },
    { label: '完全参加', value: count((r) => r.status === 'full'), tone: 'text-white' },
  ]
  const href = (t: string) => {
    const p = new URLSearchParams()
    if (t) p.set('team', t)
    if (q) p.set('q', q)
    return `/players${p.size ? `?${p}` : ''}`
  }

  return <main className="px-4 py-6">
    <div className="mx-auto max-w-read space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white">選手</h1>
        <div className="mt-3 flex items-stretch">
          {metrics.map((m, i) => <div key={m.label} className={cn('px-4', i === 0 ? 'pl-0' : 'border-l border-layer-5')}>
            <p className="text-2xs text-navy-400">{m.label}</p>
            <p className={cn('text-xl font-bold', m.value > 0 ? m.tone : 'text-white')}><Num mono>{m.value}</Num><span className="text-2xs font-normal text-navy-400"> 名</span></p>
          </div>)}
        </div>
      </div>
      <div className="flex justify-end"><AddPlayer defaultTeam={(players ?? []).find((p) => !p.is_fictional && p.team)?.team ?? ''} /></div>
      {(teams ?? []).length > 1 && <div className="flex flex-wrap gap-2">
        {[{ id: '', name: '全チーム' }, ...(teams ?? [])].map((t) => <Link key={t.id} href={href(t.id)} aria-current={team === t.id ? 'page' : undefined}
          className={cn('rounded-pill border px-3 py-1.5 text-2xs font-bold', team === t.id ? 'border-gold-500 bg-gold-500/15 text-gold-300' : 'border-layer-10 text-navy-300 hover:text-white')}>{t.name}</Link>)}
      </div>}
      <PlayerList key={team} rows={rows.filter((r) => !team || r.teamId === team)} initialQuery={q} empty="まだ選手がいません。「選手を追加」から足してください。" />
    </div>
  </main>
}
