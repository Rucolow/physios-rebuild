import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { personName } from '@/lib/format/name'

export default async function PlayersPage() {
  const trainer = await requireTrainer()
  const { data: players } = await adminDb()
    .from('player')
    .select('id, family_name, given_name, team, is_fictional')
    .eq('trainer_id', trainer.id)
    .eq('is_active', true)
    .order('family_name')
  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-read space-y-6">
        <h1 className="text-3xl font-bold text-white">選手</h1>
        <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
          {(players ?? []).map((p) => (
            <Link key={p.id} href={`/players/${p.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors duration-fast hover:bg-layer-5">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">{personName(p.family_name, p.given_name)}</p>
                <p className="mt-1 text-2xs text-navy-400">{[p.team, p.is_fictional ? '架空の選手' : null].filter(Boolean).join('・')}</p>
              </div>
              <ChevronRight size={16} className="text-navy-500" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
