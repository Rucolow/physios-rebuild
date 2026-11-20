import 'server-only'
import { adminDb } from '@/lib/supabase/server'

/**
 * A/B 日の中身を言葉にする（「下半身メイン」など）。
 * 清水のプロトコルで、その日の組（A か B）にだけ入る見出しの名前から作る。見出しが無ければ null
 */
export async function dayFocusLabel(protocolId: string | null, dayGroup: string | null): Promise<string | null> {
  if (!protocolId || (dayGroup !== 'A' && dayGroup !== 'B')) return null
  const db = adminDb()
  const [{ data: rules }, { data: row }] = await Promise.all([
    db.from('protocol_menu_category_rule').select('column_key').eq('protocol_id', protocolId).eq('day_group', dayGroup),
    db.from('protocol_menu_row').select('id').eq('protocol_id', protocolId).order('row_index', { ascending: false }).limit(1).maybeSingle(),
  ])
  const keys = [...new Set((rules ?? []).map((r) => r.column_key))]
  if (keys.length === 0 || !row) return null
  const { data: cells } = await db.from('protocol_menu_cell').select('column_key, column_label').eq('menu_row_id', row.id).in('column_key', keys)
  const names = [...new Set((cells ?? []).map((c) => c.column_label.replace(/^\d+\s*/, '').replace(/メニュー$/, '')))]
  return names.length ? `${names.join('・')}メイン` : null
}
