import { NextResponse } from 'next/server'
import { playerByToken } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'

/** 選手が種目の実施を付け外しする。品目が本人の処方のものかをサーバで確かめる */
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const player = await playerByToken(token)
  if (!player) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const { itemId, done } = (await req.json()) as { itemId?: string; done?: boolean }
  if (!itemId) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const db = adminDb()
  const { data: item } = await db
    .from('prescription_item')
    .select('id, prescription!inner(player_id)')
    .eq('id', itemId)
    .eq('prescription.player_id', player.id)
    .maybeSingle()
  if (!item) return NextResponse.json({ error: 'not found' }, { status: 404 })
  await db.from('prescription_item').update({ done_at: done ? new Date().toISOString() : null }).eq('id', itemId)
  return NextResponse.json({ ok: true })
}
