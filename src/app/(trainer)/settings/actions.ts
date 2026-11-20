'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireTrainer } from '@/lib/auth'
import { adminDb, authClient } from '@/lib/supabase/server'

export type SettingsState = { ok: boolean; message: string | null }

export async function saveSettings(_prev: SettingsState, form: FormData): Promise<SettingsState> {
  const trainer = await requireTrainer()
  const name = String(form.get('name') ?? '').trim()
  const tz = String(form.get('time_zone') ?? '').trim()
  if (!name) return { ok: false, message: '表示名を入れてください。' }
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz })
  } catch {
    return { ok: false, message: '時間帯を選んでください。' }
  }
  const { error } = await adminDb().from('trainer').update({ name, time_zone: tz }).eq('id', trainer.id)
  if (error) return { ok: false, message: '保存できませんでした。もう一度お試しください。' }
  revalidatePath('/', 'layout')
  return { ok: true, message: '保存しました。' }
}

export async function signOut() {
  const sb = await authClient()
  await sb.auth.signOut()
  redirect('/login')
}
