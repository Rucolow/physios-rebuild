import 'server-only'
import { adminDb } from '@/lib/supabase/server'

type Db = ReturnType<typeof adminDb>

/**
 * 怪我を復帰にする。故障者リストから外れ、メニューの配信が止まる。
 * 怪我・カルテ・済ませたメニューの記録は消さない。復帰の日より後に組んであったメニューだけを消す。
 */
export async function closeEpisode(db: Db, episodeId: string, on: string) {
  // 0007 の適用前は closed_on の列が無いので、状態だけを変える
  const withDate = await db.from('injury_episode').update({ status: 'closed', closed_on: on }).eq('id', episodeId)
  if (withDate.error) {
    const { error } = await db.from('injury_episode').update({ status: 'closed' }).eq('id', episodeId)
    if (error) throw error
  }
  await db.from('prescription').delete().eq('injury_episode_id', episodeId).gt('target_on', on)
}

/** 復帰を取り消して、進行中の怪我に戻す（押し間違いのため） */
export async function reopenEpisode(db: Db, episodeId: string) {
  const withDate = await db.from('injury_episode').update({ status: 'active', closed_on: null }).eq('id', episodeId)
  if (withDate.error) {
    const { error } = await db.from('injury_episode').update({ status: 'active' }).eq('id', episodeId)
    if (error) throw error
  }
}

export interface PastEpisode {
  id: string
  label: string
  injuredOn: string
  closedOn: string | null
}

/** 復帰した怪我（新しい順） */
export async function pastEpisodes(db: Db, playerId: string): Promise<PastEpisode[]> {
  const q = (cols: string) => db.from('injury_episode').select(cols).eq('player_id', playerId).eq('status', 'closed').order('injured_on', { ascending: false })
  let res = await q('id, label, injured_on, closed_on')
  if (res.error) res = await q('id, label, injured_on')
  const rows = (res.data ?? []) as unknown as { id: string; label: string; injured_on: string; closed_on?: string | null }[]
  return rows.map((r) => ({ id: r.id, label: r.label, injuredOn: r.injured_on, closedOn: r.closed_on ?? null }))
}
