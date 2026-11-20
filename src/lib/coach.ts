import 'server-only'
import { adminDb } from '@/lib/supabase/server'

/** 指導者のリンクの鍵から、チームと時間帯を引く */
export async function teamByCoachToken(token: string) {
  if (!/^[0-9a-f]{32}$/.test(token)) return null
  const { data: team } = await adminDb().from('team').select('id, name, trainer:trainer_id(time_zone)').eq('coach_token', token).maybeSingle()
  if (!team) return null
  return { id: team.id, name: team.name, tz: (team.trainer as unknown as { time_zone: string } | null)?.time_zone ?? 'Europe/Berlin' }
}
