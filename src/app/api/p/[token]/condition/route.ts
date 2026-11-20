import { NextResponse } from 'next/server'
import { playerByToken } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { localDate } from '@/lib/date'

const score = (v: unknown) => (Number.isInteger(v) && (v as number) >= 0 && (v as number) <= 6 ? (v as number) : null)

/** 選手が今日の報告（痛み・疲労 0〜6 とひとこと）を送る。日付はサーバがトレーナーの時間帯で決める */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const body = (await req.json().catch(() => ({}))) as { pain?: unknown; fatigue?: unknown; comment?: unknown }
  const pain = score(body.pain)
  const fatigue = score(body.fatigue)
  const comment = typeof body.comment === 'string' ? body.comment.trim().slice(0, 1000) || null : null
  if (pain === null || fatigue === null) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const db = adminDb()
  const { data: t } = await db.from('trainer').select('time_zone').eq('id', player.trainer_id).single()
  const today = localDate(t?.time_zone ?? 'Europe/Berlin')
  const { error } = await db
    .from('condition_report')
    .upsert({ player_id: player.id, reported_on: today, pain_score: pain, fatigue, comment, updated_at: new Date().toISOString() }, { onConflict: 'player_id,reported_on' })
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
