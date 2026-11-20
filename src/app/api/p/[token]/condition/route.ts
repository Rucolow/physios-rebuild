import { NextResponse } from 'next/server'
import { playerByToken } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { localDate } from '@/lib/date'

/** 選手が今日の痛み・疲労（0〜6）を付ける。日付はサーバがトレーナーの時間帯で決める */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const body = (await req.json()) as { kind?: string; score?: number }
  const score = Number(body.score)
  if (!['pain', 'fatigue'].includes(body.kind ?? '') || !Number.isInteger(score) || score < 0 || score > 6)
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const db = adminDb()
  const { data: t } = await db.from('trainer').select('time_zone').eq('id', player.trainer_id).single()
  const today = localDate(t?.time_zone ?? 'Europe/Berlin')
  const col = body.kind === 'pain' ? 'pain_score' : 'fatigue'
  const { error } = await db
    .from('condition_report')
    .upsert({ player_id: player.id, reported_on: today, [col]: score, updated_at: new Date().toISOString() }, { onConflict: 'player_id,reported_on' })
  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
