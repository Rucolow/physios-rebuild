'use server'
import { revalidatePath } from 'next/cache'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { zonedIso } from '@/lib/team'

type Result = { ok: true; id?: string; date?: string } | { ok: false; message: string }

async function ownTeam(trainerId: string, teamId: string) {
  const { data } = await adminDb().from('team').select('id').eq('id', teamId).eq('trainer_id', trainerId).maybeSingle()
  return !!data
}

export async function addTeam(name: string): Promise<Result> {
  const trainer = await requireTrainer()
  const n = name.trim()
  if (!n) return { ok: false, message: 'チームの名前を入れてください。' }
  const { data, error } = await adminDb().from('team').insert({ trainer_id: trainer.id, name: n }).select('id').single()
  if (error) return { ok: false, message: error.code === '23505' ? '同じ名前のチームがあります。' : '作れませんでした。' }
  revalidatePath('/team')
  return { ok: true, id: data.id }
}

export async function addTeamEvent(input: {
  teamId: string
  eventOn: string
  kind: string
  startTime: string
  opponent: string
  venue: string
  homeAway: string
  note: string
}): Promise<Result> {
  const trainer = await requireTrainer()
  if (!(await ownTeam(trainer.id, input.teamId))) return { ok: false, message: 'チームを選んでください。' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.eventOn)) return { ok: false, message: '日付を入れてください。' }
  if (!['match', 'training', 'off'].includes(input.kind)) return { ok: false, message: '種別を選んでください。' }
  if (input.startTime && !/^\d{2}:\d{2}$/.test(input.startTime)) return { ok: false, message: '時刻の形が読めません。' }
  const { error } = await adminDb()
    .from('team_event')
    .insert({
      team_id: input.teamId,
      kind: input.kind,
      starts_at: zonedIso(input.eventOn, input.kind === 'off' ? '' : input.startTime, trainer.time_zone),
      opponent: input.kind === 'match' ? input.opponent.trim() || null : null,
      venue: input.kind === 'off' ? null : input.venue.trim() || null,
      home_away: input.kind === 'match' && ['home', 'away'].includes(input.homeAway) ? input.homeAway : null,
      note: input.note.trim() || null,
      source: 'manual',
    })
  if (error) return { ok: false, message: '追加できませんでした。' }
  revalidatePath('/team')
  revalidatePath('/dashboard')
  return { ok: true, date: input.eventOn }
}

export async function setMatchScore(eventId: string, scoreFor: number | null, scoreAgainst: number | null): Promise<Result> {
  const trainer = await requireTrainer()
  const db = adminDb()
  const { data: ev } = await db.from('team_event').select('id, team_id, kind').eq('id', eventId).maybeSingle()
  if (!ev || ev.kind !== 'match' || !(await ownTeam(trainer.id, ev.team_id))) return { ok: false, message: '試合が見つかりません。' }
  const ok = (v: number | null) => v === null || (Number.isInteger(v) && v >= 0 && v < 100)
  if (!ok(scoreFor) || !ok(scoreAgainst) || (scoreFor === null) !== (scoreAgainst === null)) return { ok: false, message: '両チームの点を入れてください。' }
  const { error } = await db.from('team_event').update({ score_for: scoreFor, score_against: scoreAgainst }).eq('id', eventId)
  if (error) return { ok: false, message: '保存できませんでした。' }
  revalidatePath('/team')
  return { ok: true }
}
