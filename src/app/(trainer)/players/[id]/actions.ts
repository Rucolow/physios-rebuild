'use server'
import { revalidatePath } from 'next/cache'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { localDate } from '@/lib/date'
import { KARTE_COLUMN, loadKarteFields } from '@/lib/playerDetail'
import { closeEpisode, reopenEpisode } from '@/lib/episode'

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

type Result = { ok: true } | { ok: false; message: string }

async function ownEpisode(trainerId: string, playerId: string, episodeId: string) {
  await ownPlayer(trainerId, playerId)
  const { data } = await adminDb().from('injury_episode').select('id, label').eq('id', episodeId).eq('player_id', playerId).maybeSingle()
  if (!data) throw new Error('怪我が見つかりません')
  return data
}

function refreshPlayer(playerId: string) {
  for (const p of [`/players/${playerId}`, '/players', '/dashboard', '/team']) revalidatePath(p)
}

/** 怪我を復帰にする。故障者リストから外れる。記録は残り、カルテにも復帰の一行を残す */
export async function returnFromInjury(playerId: string, episodeId: string): Promise<Result> {
  const trainer = await requireTrainer()
  try {
    const ep = await ownEpisode(trainer.id, playerId, episodeId)
    const db = adminDb()
    const today = localDate(trainer.time_zone)
    await closeEpisode(db, episodeId, today)
    await db.from('karte_entry').insert({ player_id: playerId, injury_episode_id: episodeId, written_on: today, summary: `復帰（${ep.label}）`, confirmed_by: trainer.id })
  } catch {
    return { ok: false, message: '復帰にできませんでした。もう一度お試しください。' }
  }
  refreshPlayer(playerId)
  return { ok: true }
}

/** 復帰を取り消して、進行中の怪我に戻す */
export async function undoReturn(playerId: string, episodeId: string): Promise<Result> {
  const trainer = await requireTrainer()
  try {
    const ep = await ownEpisode(trainer.id, playerId, episodeId)
    const db = adminDb()
    await reopenEpisode(db, episodeId)
    // 「復帰にする」で足したカルテの一行も消す（音声メモから記録したカルテは消さない）
    await db.from('karte_entry').delete().eq('injury_episode_id', episodeId).eq('summary', `復帰（${ep.label}）`).is('source_draft_id', null)
  } catch {
    return { ok: false, message: '戻せませんでした。もう一度お試しください。' }
  }
  refreshPlayer(playerId)
  return { ok: true }
}

/** 選手の名前・呼び方・チームを直す */
export async function updatePlayer(playerId: string, input: { family: string; given: string; aliases: string; team: string }): Promise<Result> {
  const trainer = await requireTrainer()
  await ownPlayer(trainer.id, playerId)
  const family = input.family.trim()
  const given = input.given.trim()
  const team = input.team.trim()
  if (!family || !given) return { ok: false, message: '姓と名を入れてください。' }
  const aliases = input.aliases.split(/[、,，\s]+/).map((a) => a.trim()).filter(Boolean)
  const db = adminDb()
  let teamId: string | null = null
  if (team) {
    const { data: t } = await db.from('team').upsert({ trainer_id: trainer.id, name: team }, { onConflict: 'trainer_id,name' }).select('id').single()
    teamId = t?.id ?? null
  }
  const { error } = await db.from('player').update({ family_name: family, given_name: given, aliases, team: team || null, team_id: teamId }).eq('id', playerId)
  if (error) return { ok: false, message: '保存できませんでした。もう一度お試しください。' }
  refreshPlayer(playerId)
  return { ok: true }
}

/** 選手を名簿から外す。記録は消さない（一覧・チーム・音声メモの同定に出なくなり、選手の画面のリンクも開かなくなる） */
export async function removePlayer(playerId: string): Promise<Result> {
  const trainer = await requireTrainer()
  await ownPlayer(trainer.id, playerId)
  const { error } = await adminDb().from('player').update({ is_active: false }).eq('id', playerId)
  if (error) return { ok: false, message: '外せませんでした。もう一度お試しください。' }
  refreshPlayer(playerId)
  return { ok: true }
}
