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

interface EventInput {
  teamId: string
  eventOn: string
  kind: string
  startTime: string
  opponent: string
  venue: string
  homeAway: string
  note: string
}

function eventRow(input: EventInput, tz: string): { message: string } | { row: Record<string, unknown> } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.eventOn)) return { message: '日付を入れてください。' }
  if (!['match', 'training', 'off'].includes(input.kind)) return { message: '種別を選んでください。' }
  if (input.startTime && !/^\d{2}:\d{2}$/.test(input.startTime)) return { message: '時刻の形が読めません。' }
  return {
    row: {
      kind: input.kind,
      starts_at: zonedIso(input.eventOn, input.kind === 'off' ? '' : input.startTime, tz),
      opponent: input.kind === 'match' ? input.opponent.trim() || null : null,
      venue: input.kind === 'off' ? null : input.venue.trim() || null,
      home_away: input.kind === 'match' && ['home', 'away'].includes(input.homeAway) ? input.homeAway : null,
      note: input.note.trim() || null,
    },
  }
}

export async function addTeamEvent(input: EventInput): Promise<Result> {
  const trainer = await requireTrainer()
  if (!(await ownTeam(trainer.id, input.teamId))) return { ok: false, message: 'チームを選んでください。' }
  const r = eventRow(input, trainer.time_zone)
  if ('message' in r) return { ok: false, message: r.message }
  const { error } = await adminDb().from('team_event').insert({ ...r.row, team_id: input.teamId, source: 'manual' })
  if (error) return { ok: false, message: '追加できませんでした。' }
  revalidatePath('/team')
  revalidatePath('/dashboard')
  return { ok: true, date: input.eventOn }
}

async function ownEvent(trainerId: string, eventId: string) {
  const { data: ev } = await adminDb().from('team_event').select('id, team_id, kind').eq('id', eventId).maybeSingle()
  return ev && (await ownTeam(trainerId, ev.team_id)) ? ev : null
}

/** 予定を直す。試合でなくしたときは点も消す */
export async function updateTeamEvent(eventId: string, input: EventInput): Promise<Result> {
  const trainer = await requireTrainer()
  if (!(await ownEvent(trainer.id, eventId))) return { ok: false, message: '予定が見つかりません。' }
  const r = eventRow(input, trainer.time_zone)
  if ('message' in r) return { ok: false, message: r.message }
  const patch = input.kind === 'match' ? r.row : { ...r.row, score_for: null, score_against: null }
  const { error } = await adminDb().from('team_event').update(patch).eq('id', eventId)
  if (error) return { ok: false, message: '保存できませんでした。' }
  revalidatePath('/team')
  revalidatePath('/dashboard')
  return { ok: true, date: input.eventOn }
}

/** 予定を消す。日程の変更で置き換えた元の行（表に出ていない）も一緒に消す */
export async function deleteTeamEvent(eventId: string): Promise<Result> {
  const trainer = await requireTrainer()
  if (!(await ownEvent(trainer.id, eventId))) return { ok: false, message: '予定が見つかりません。' }
  const db = adminDb()
  let ids = [eventId]
  const all: string[] = []
  for (let i = 0; i < 20 && ids.length; i++) {
    all.push(...ids)
    const { data } = await db.from('team_event').select('id').in('replaced_by', ids)
    ids = (data ?? []).map((x) => x.id)
  }
  // 指している側から順に消す（replaced_by の参照が残らないように）
  for (const id of all.reverse()) {
    const { error } = await db.from('team_event').delete().eq('id', id)
    if (error) return { ok: false, message: '消せませんでした。' }
  }
  revalidatePath('/team')
  revalidatePath('/dashboard')
  return { ok: true }
}

/** チームの名前を直す。選手の所属の表示も合わせる */
export async function renameTeam(teamId: string, name: string): Promise<Result> {
  const trainer = await requireTrainer()
  if (!(await ownTeam(trainer.id, teamId))) return { ok: false, message: 'チームが見つかりません。' }
  const n = name.trim()
  if (!n) return { ok: false, message: 'チームの名前を入れてください。' }
  const db = adminDb()
  const { error } = await db.from('team').update({ name: n }).eq('id', teamId)
  if (error) return { ok: false, message: error.code === '23505' ? '同じ名前のチームがあります。' : '保存できませんでした。' }
  await db.from('player').update({ team: n }).eq('team_id', teamId)
  revalidatePath('/team')
  revalidatePath('/players')
  return { ok: true }
}

/** チームを消す。選手が残っているチームは消せない（予定と成績も一緒に消えるため） */
export async function deleteTeam(teamId: string): Promise<Result> {
  const trainer = await requireTrainer()
  if (!(await ownTeam(trainer.id, teamId))) return { ok: false, message: 'チームが見つかりません。' }
  const db = adminDb()
  const { count } = await db.from('player').select('id', { count: 'exact', head: true }).eq('team_id', teamId).eq('is_active', true)
  if (count) return { ok: false, message: `このチームには選手が ${count} 人います。先に選手の画面の「直す」でチームを変えてください。` }
  await db.from('player').update({ team: null, team_id: null }).eq('team_id', teamId)
  // 予定は replaced_by で互いを指すので、先に参照を外してからチームごと消す
  await db.from('team_event').update({ replaced_by: null }).eq('team_id', teamId)
  const { error } = await db.from('team').delete().eq('id', teamId)
  if (error) return { ok: false, message: '消せませんでした。' }
  revalidatePath('/team')
  revalidatePath('/players')
  return { ok: true }
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
