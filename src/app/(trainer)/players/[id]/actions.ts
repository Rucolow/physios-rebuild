'use server'
import { revalidatePath } from 'next/cache'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { localDate } from '@/lib/date'
import { KARTE_COLUMN, loadKarteFields } from '@/lib/playerDetail'

async function ownPlayer(trainerId: string, playerId: string) {
  const { data } = await adminDb().from('player').select('id').eq('id', playerId).eq('trainer_id', trainerId).maybeSingle()
  if (!data) throw new Error('選手が見つかりません')
}

export type FormState = { ok: boolean; message: string | null }

/** 要観察の付け外し */
export async function setWatching(playerId: string, on: boolean) {
  const trainer = await requireTrainer()
  await ownPlayer(trainer.id, playerId)
  const db = adminDb()
  if (on) {
    const { data } = await db.from('watch_period').select('id').eq('player_id', playerId).is('released_at', null).maybeSingle()
    if (!data) await db.from('watch_period').insert({ player_id: playerId, added_by: trainer.id })
  } else {
    await db.from('watch_period').update({ released_at: new Date().toISOString() }).eq('player_id', playerId).is('released_at', null)
  }
  revalidatePath(`/players/${playerId}`)
}

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])

/** カルテを手で書く（音声メモを通さない記録）。画像は非公開の置き場に入れる */
export async function addKarte(_prev: FormState, form: FormData): Promise<FormState> {
  const trainer = await requireTrainer()
  const playerId = String(form.get('player_id') ?? '')
  await ownPlayer(trainer.id, playerId)
  const s = (k: string) => String(form.get(k) ?? '').trim() || null
  const summary = s('summary')
  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0)
  if (!summary) return { ok: false, message: '要点を入れてください。' }
  if (files.some((f) => !IMAGE_TYPES.has(f.type))) return { ok: false, message: '画像は JPEG・PNG・WebP・HEIC にしてください。' }
  if (files.reduce((n, f) => n + f.size, 0) > 7 * 1024 * 1024) return { ok: false, message: '画像は合わせて 7MB までです。' }
  const db = adminDb()
  const { data: ep } = await db.from('injury_episode').select('id').eq('player_id', playerId).eq('status', 'active').order('created_at', { ascending: false }).limit(1).maybeSingle()
  // 既定の五項目は列に、それ以外の項目は fields に入れる
  const row: Record<string, unknown> = {
    player_id: playerId,
    injury_episode_id: ep?.id ?? null,
    written_on: s('written_on') ?? localDate(trainer.time_zone),
    summary,
    confirmed_by: trainer.id,
  }
  const extra: Record<string, string> = {}
  for (const label of await loadKarteFields(playerId)) {
    const v = s(`f:${label}`)
    if (!v) continue
    const col = KARTE_COLUMN.get(label)
    if (col) row[col] = v
    else extra[label] = v
  }
  if (Object.keys(extra).length) row.fields = extra
  const { data: k, error } = await db.from('karte_entry').insert(row).select('id').single()
  if (error || !k) {
    console.error(error)
    return { ok: false, message: '保存できませんでした。もう一度お試しください。' }
  }
  for (const f of files) {
    const ext = f.type.split('/')[1].replace('jpeg', 'jpg')
    const path = `${playerId}/${k.id}/${crypto.randomUUID()}.${ext}`
    const up = await db.storage.from('karte').upload(path, f, { contentType: f.type })
    if (up.error) {
      console.error(up.error)
      revalidatePath(`/players/${playerId}`)
      return { ok: false, message: 'カルテは保存しましたが、画像の一部を保存できませんでした。' }
    }
    await db.from('karte_attachment').insert({ karte_entry_id: k.id, storage_path: path, content_type: f.type, byte_size: f.size, uploaded_by: trainer.id })
  }
  revalidatePath(`/players/${playerId}`)
  return { ok: true, message: null }
}

/** この選手のカルテの記入項目を決める（空なら既定の五項目に戻す） */
export async function setKarteFields(playerId: string, labels: string[]): Promise<FormState> {
  const trainer = await requireTrainer()
  await ownPlayer(trainer.id, playerId)
  const clean = [...new Set(labels.map((l) => l.trim()).filter(Boolean))].slice(0, 20)
  const { error } = await adminDb().from('player').update({ karte_fields: clean }).eq('id', playerId)
  if (error) {
    console.error(error)
    return { ok: false, message: error.message.includes('karte_fields') ? '項目を保存するには、データベースの更新（0006）が必要です。' : '保存できませんでした。もう一度お試しください。' }
  }
  revalidatePath(`/players/${playerId}`)
  return { ok: true, message: null }
}
