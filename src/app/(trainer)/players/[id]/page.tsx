import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { personName } from '@/lib/format/name'
import { jaDate, localDate, weekSince } from '@/lib/date'
import { Num } from '@/components/ui/Num'
import { CopyLink } from '@/components/trainer/CopyLink'

export default async function PlayerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const trainer = await requireTrainer()
  const db = adminDb()
  const { data: p } = await db
    .from('player')
    .select('id, family_name, given_name, team, share_token, is_fictional')
    .eq('id', id)
    .eq('trainer_id', trainer.id)
    .maybeSingle()
  if (!p) notFound()
  const today = localDate(trainer.time_zone)
  const [{ data: eps }, { data: kartes }] = await Promise.all([
    db.from('injury_episode').select('id, label, injured_on, status').eq('player_id', p.id).order('created_at', { ascending: false }),
    db
      .from('karte_entry')
      .select('id, written_on, summary, subjective, objective, assessment, treatment, plan')
      .eq('player_id', p.id)
      .order('written_on', { ascending: false })
      .order('confirmed_at', { ascending: false })
      .limit(30),
  ])
  const h = await headers()
  const origin = `${h.get('x-forwarded-proto') ?? 'https'}://${h.get('host')}`
  const active = (eps ?? []).find((e) => e.status === 'active')

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-read space-y-section">
        <section>
          <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">
            {[p.team, p.is_fictional ? '架空の選手' : null].filter(Boolean).join('・') || '選手'}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">{personName(p.family_name, p.given_name)}</h1>
          <p className="mt-2 text-sm text-navy-300">
            {active ? (
              <>
                {active.label}・受傷から <Num>{weekSince(active.injured_on, today)}</Num> 週目
              </>
            ) : (
              '進行中の怪我なし'
            )}
          </p>
          <div className="mt-4">
            <CopyLink url={`${origin}/p/${p.share_token}`} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">カルテ</h2>
          <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
            {(kartes ?? []).length === 0 && <p className="px-5 py-4 text-sm text-navy-400">まだ記録はありません。</p>}
            {(kartes ?? []).map((k) => {
              const d = jaDate(k.written_on)
              const parts: [string, string | null][] = [
                ['訴え', k.subjective],
                ['所見', k.objective],
                ['評価', k.assessment],
                ['治療', k.treatment],
                ['次の予定', k.plan],
              ]
              return (
                <article key={k.id} className="px-5 py-4">
                  <p className="text-2xs text-navy-400">
                    <Num>{d.md}</Num>
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">{k.summary}</p>
                  <dl className="mt-2 space-y-1">
                    {parts
                      .filter(([, v]) => v)
                      .map(([label, v]) => (
                        <div key={label} className="flex gap-3 text-sm">
                          <dt className="w-16 shrink-0 text-2xs text-navy-400 pt-0.5">{label}</dt>
                          <dd className="min-w-0 flex-1 text-navy-200">{v}</dd>
                        </div>
                      ))}
                  </dl>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
