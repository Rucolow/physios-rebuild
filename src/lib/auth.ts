import 'server-only'
import { redirect } from 'next/navigation'
import { adminDb, authClient } from '@/lib/supabase/server'

export interface Trainer {
  id: string
  name: string
  time_zone: string
}

/** ログイン中のトレーナー。いなければ null */
export async function currentTrainer(): Promise<Trainer | null> {
  const sb = await authClient()
  const { data } = await sb.auth.getUser()
  if (!data.user) return null
  const { data: t } = await adminDb()
    .from('trainer')
    .select('id, name, time_zone')
    .eq('auth_user_id', data.user.id)
    .maybeSingle()
  return t
}

export async function requireTrainer(): Promise<Trainer> {
  const t = await currentTrainer()
  if (!t) redirect('/login')
  return t
}

/** 選手がこのトレーナーの担当かを確かめる。違えば例外 */
export async function assertOwnPlayer(trainerId: string, playerId: string) {
  const { data } = await adminDb()
    .from('player')
    .select('id')
    .eq('id', playerId)
    .eq('trainer_id', trainerId)
    .maybeSingle()
  if (!data) throw new Error('担当外の選手です')
}

/** 選手の画面: URL のトークンから本人だけを引く */
export async function playerByToken(token: string) {
  const { data } = await adminDb()
    .from('player')
    .select('id, trainer_id, family_name, given_name, team, is_active')
    .eq('share_token', token)
    .eq('is_active', true)
    .maybeSingle()
  return data
}
