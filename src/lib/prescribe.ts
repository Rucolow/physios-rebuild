import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { pickForDay, resolveAbDay, type CategoryType, type DayGroup } from '@/lib/generation/fill'

/**
 * 怪我ひとつの、ある日のメニューを組んで保存する。
 * 入力は「トレーナーが確定した今の時期（表1の行）」と日付だけ。行が無ければ組まない。
 * 同じ時期・同じ日なら作り直さない（実施の印を消さないため）。
 */
export async function prescribe(episodeId: string, targetOn: string) {
  const db = adminDb()
  const { data: ep } = await db
    .from('injury_episode')
    .select('id, player_id, protocol_id, status, protocol:protocol_id(daily_volume_target)')
    .eq('id', episodeId)
    .single()
  if (!ep || ep.status !== 'active' || !ep.protocol_id) return null

  const { data: pos } = await db
    .from('menu_position')
    .select('id, menu_row_id, anchor_on')
    .eq('injury_episode_id', episodeId)
    .lte('anchor_on', targetOn)
    .order('set_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!pos) return null

  const { data: existing } = await db
    .from('prescription')
    .select('id, menu_position_id')
    .eq('injury_episode_id', episodeId)
    .eq('target_on', targetOn)
    .maybeSingle()
  if (existing && existing.menu_position_id === pos.id) return existing.id
  if (existing) await db.from('prescription').delete().eq('id', existing.id)

  const ab = resolveAbDay(pos.anchor_on, targetOn)
  const budget = (ep.protocol as unknown as { daily_volume_target: number | null } | null)?.daily_volume_target ?? null

  const base = {
    player_id: ep.player_id,
    injury_episode_id: ep.id,
    target_on: targetOn,
    menu_row_id: pos.menu_row_id,
    menu_position_id: pos.id,
  }
  if (ab.isRestDay) {
    const { data } = await db.from('prescription').insert({ ...base, is_rest_day: true, generation_log: { rest: true } }).select('id').single()
    return data?.id ?? null
  }

  const { data: cells, error } = await db
    .from('protocol_menu_cell')
    .select('id, column_key, column_label, column_order, category_key, category_label, category_order, items:protocol_menu_item(exercise_id, sort_order)')
    .eq('menu_row_id', pos.menu_row_id)
    .order('column_order')
    .order('category_order')
  if (error) throw error
  const { data: rules } = await db
    .from('protocol_menu_category_rule')
    .select('column_key, category_key, category_type, daily_pick_limit, day_group')
    .eq('protocol_id', ep.protocol_id)

  const shelf = (cells ?? []).map((c) => {
    const r = (rules ?? []).find((x) => x.column_key === c.column_key && x.category_key === c.category_key)
    const items = [...(c.items as { exercise_id: string; sort_order: number }[])].sort((a, b) => a.sort_order - b.sort_order)
    return {
      cell: c,
      items,
      rule: r
        ? { categoryType: r.category_type as CategoryType, dailyPickLimit: r.daily_pick_limit, dayGroup: r.day_group as DayGroup }
        : null,
    }
  })
  const picked = pickForDay(shelf, { dayGroup: ab.dayGroup, workdayIndex: ab.workdayIndex }, budget)

  const { data: rx, error: e2 } = await db
    .from('prescription')
    .insert({
      ...base,
      day_group: ab.dayGroup,
      generation_log: { budget, workdayIndex: ab.workdayIndex, takes: picked.map((p) => p.length) },
    })
    .select('id')
    .single()
  if (e2) throw e2
  let order = 0
  const items = shelf.flatMap((s, i) =>
    picked[i].map((it) => ({
      prescription_id: rx.id,
      exercise_id: it.exercise_id,
      column_label: s.cell.column_label,
      category_label: s.cell.category_label,
      sort_order: order++,
    })),
  )
  if (items.length) {
    const { error: e3 } = await db.from('prescription_item').insert(items)
    if (e3) throw e3
  }
  return rx.id
}
