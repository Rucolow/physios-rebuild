import { requireTrainer } from '@/lib/auth'
import { trainerTerms } from '@/lib/roster'
import { authClient } from '@/lib/supabase/server'
import { SettingsForm } from './SettingsForm'
import { signOut } from './actions'

export default async function SettingsPage() {
  const trainer = await requireTrainer()
  const { data } = await (await authClient()).auth.getUser()
  const terms = await trainerTerms(trainer.id)
  return <main className="px-4 py-6">
    <div className="mx-auto max-w-form space-y-8">
      <h1 className="text-4xl font-bold text-white">設定</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">プロフィール</h2>
        <SettingsForm name={trainer.name} timeZone={trainer.time_zone} terms={terms} />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">アカウント</h2>
        <div className="rounded-card border border-layer-10 bg-layer-5 px-4 py-3">
          <p className="text-2xs text-navy-400">メール</p>
          <p className="mt-1 text-sm text-white">{data.user?.email ?? '—'}</p>
        </div>
        <form action={signOut}><button type="submit" className="h-10 rounded-field border border-layer-10 bg-layer-10 px-4 text-sm font-bold text-white hover:bg-layer-20">サインアウト</button></form>
      </section>
    </div>
  </main>
}
