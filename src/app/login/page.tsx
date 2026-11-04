import { redirect } from 'next/navigation'
import { authClient } from '@/lib/supabase/server'
import { currentTrainer } from '@/lib/auth'
import { Button } from '@/components/ui/Button'

async function signIn(formData: FormData) {
  'use server'
  const sb = await authClient()
  const { error } = await sb.auth.signInWithPassword({
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  })
  if (error) redirect('/login?e=1')
  redirect('/digest')
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await currentTrainer()) redirect('/digest')
  const { e } = await searchParams
  return (
    <div className="min-h-screen shell-bg px-4 py-16">
      <form action={signIn} className="mx-auto max-w-form space-y-6">
        <div>
          <p className="text-2xs font-bold uppercase tracking-wider text-navy-200">Trainer</p>
          <h1 className="mt-1 text-3xl font-bold text-white">PHYSIOS</h1>
        </div>
        <label className="block space-y-2">
          <span className="text-2xs font-medium text-navy-300">メールアドレス</span>
          <input name="email" type="email" required autoComplete="email" className="h-12 w-full rounded-field border border-layer-10 bg-layer-5 px-4 text-sm text-white focus:border-gold-500 focus:outline-none" />
        </label>
        <label className="block space-y-2">
          <span className="text-2xs font-medium text-navy-300">パスワード</span>
          <input name="password" type="password" required autoComplete="current-password" className="h-12 w-full rounded-field border border-layer-10 bg-layer-5 px-4 text-sm text-white focus:border-gold-500 focus:outline-none" />
        </label>
        {e && <p className="text-2xs font-medium text-red-400">メールアドレスかパスワードが違います。</p>}
        <Button variant="primary" size="lg" block type="submit">ログイン</Button>
      </form>
    </div>
  )
}
