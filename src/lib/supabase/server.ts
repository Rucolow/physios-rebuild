import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

/** service role。RLS を通らないので、呼ぶ前に必ず担当関係を確かめる（src/lib/auth.ts） */
export function adminDb() {
  return createClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/** ログインの状態だけを扱う（データは読まない） */
export async function authClient() {
  const store = await cookies()
  return createServerClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options)
        } catch {
          // Server Component からは書けない。middleware が更新する
        }
      },
    },
  })
}
