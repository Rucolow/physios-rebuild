'use server'
import { revalidatePath } from 'next/cache'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { localDate } from '@/lib/date'

async function ownPlayer(trainerId: string, playerId: string) {
  const { data } = await adminDb().from('player').select('id').eq('id', playerId).eq('trainer_id', trainerId).maybeSingle()
  if (!data) throw new Error('選手が見つかりません')
}

export type FormState = { ok: boolean; message: string | null }

/** 参加区分・制限・復帰見込みを決める。前の区分は閉じて履歴に残す */
export async function setParticipation(_prev: FormState, form: FormData): Promise<FormState> {
  const trainer = await requireTrainer()
  const playerId = String(form.get('player_id') ?? '')
  await ownPlayer(trainer.id, playerId)
  const status = String(form.get('status') ?? '')
  if (!['full', 'limited', 'out'].includes(status)) return { ok: false, message: '参加区分を選んでください。' }
  const ret = String(form.get('expected_return') ?? '').trim()
  const restriction = String(form.get('restriction') ?? '').trim()
  const db = adminDb()
  const now = new Date().toISOString()
  await db.from('availability_status').update({ valid_to: now }).eq('player_id', playerId).is('valid_to', null)
  const { error } = await db.from('availability_status').insert({
    player_id: playerId,
    status,
    restriction: status === 'limited' ? restriction || null : null,
    expected_return: status === 'full' ? null : /^\d{4}-\d{2}-\d{2}$/.test(ret) ? ret : null,
    declared_by: trainer.id,
  })
  if (error) {
    console.error(error)
    return { ok: false, message: '保存できませんでした。もう一度お試しください。' }
  }
  revalidatePath(`/players/${playerId}`)
  return { ok: true, message: null }
}

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
  const { data: k, error } = await db
    .from('karte_entry')
    .insert({
      player_id: playerId,
      injury_episode_id: ep?.id ?? null,
      written_on: s('written_on') ?? localDate(trainer.time_zone),
      summary,
      subjective: s('subjective'),
      objective: s('objective'),
      assessment: s('assessment'),
      treatment: s('treatment'),
      plan: s('plan'),
      confirmed_by: trainer.id,
    })
    .select('id')
    .single()
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
