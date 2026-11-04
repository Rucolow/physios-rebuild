import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { personName } from '@/lib/format/name'
import type { RosterPlayer, ProtocolRef } from '@/lib/llm/interpret'

export interface EpisodeState {
  id: string
  player_id: string
  label: string
  injured_on: string
  protocol_id: string | null
  protocol_title: string | null
  position: null | { id: string; menu_row_id: string; anchor_on: string; row_index: number; period_raw: string }
}

/** トレーナーの選手それぞれの、進行中の怪我と今の時期 */
export async function activeEpisodes(trainerId: string): Promise<EpisodeState[]> {
  const db = adminDb()
  const { data: eps, error } = await db
    .from('injury_episode')
    .select('id, player_id, label, injured_on, protocol_id, protocol:protocol_id(title), player!inner(trainer_id)')
    .eq('status', 'active')
    .eq('player.trainer_id', trainerId)
    .order('created_at')
  if (error) throw error
  const ids = (eps ?? []).map((e) => e.id)
  const { data: pos } = ids.length
    ? await db
        .from('menu_position')
        .select('id, injury_episode_id, menu_row_id, anchor_on, set_at, row:menu_row_id(row_index, period_raw)')
        .in('injury_episode_id', ids)
        .order('set_at', { ascending: false })
    : { data: [] }
  return (eps ?? []).map((e) => {
    const p = (pos ?? []).find((x) => x.injury_episode_id === e.id)
    const row = p?.row as unknown as { row_index: number; period_raw: string } | null
    const protocol = e.protocol as unknown as { title: string } | null
    return {
      id: e.id,
      player_id: e.player_id,
      label: e.label,
      injured_on: e.injured_on,
      protocol_id: e.protocol_id,
      protocol_title: protocol?.title ?? null,
      position: p && row ? { id: p.id, menu_row_id: p.menu_row_id, anchor_on: p.anchor_on, row_index: row.row_index, period_raw: row.period_raw } : null,
    }
  })
}

export async function rowsOf(protocolId: string) {
  const { data, error } = await adminDb()
    .from('protocol_menu_row')
    .select('id, row_index, week_hint, period_raw')
    .eq('protocol_id', protocolId)
    .order('row_index')
  if (error) throw error
  return data ?? []
}

export async function buildRoster(trainerId: string): Promise<{ roster: RosterPlayer[]; protocols: ProtocolRef[] }> {
  const db = adminDb()
  const { data: players, error } = await db
    .from('player')
    .select('id, family_name, given_name, aliases, team')
    .eq('trainer_id', trainerId)
    .eq('is_active', true)
  if (error) throw error
  const eps = await activeEpisodes(trainerId)
  const rowsByProtocol = new Map<string, { row_index: number; period_raw: string }[]>()
  for (const e of eps) {
    if (e.protocol_id && !rowsByProtocol.has(e.protocol_id)) {
      rowsByProtocol.set(e.protocol_id, (await rowsOf(e.protocol_id)).map((r) => ({ row_index: r.row_index, period_raw: r.period_raw })))
    }
  }
  const roster: RosterPlayer[] = (players ?? []).map((p) => {
    const e = eps.find((x) => x.player_id === p.id)
    return {
      id: p.id,
      name: personName(p.family_name, p.given_name),
      aliases: p.aliases ?? [],
      team: p.team,
      episode: e
        ? {
            label: e.label,
            protocol_title: e.protocol_title,
            injured_on: e.injured_on,
            current_row: e.position ? `${e.position.row_index}: ${e.position.period_raw}` : null,
            rows: e.protocol_id ? rowsByProtocol.get(e.protocol_id) ?? [] : [],
          }
        : null,
    }
  })
  const { data: protocols } = await db.from('protocol').select('id, title').order('title')
  return { roster, protocols: protocols ?? [] }
}
