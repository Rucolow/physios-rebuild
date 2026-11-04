// 清水のプロトコル・種目・メニューを、作業用の DB（build-source-db.sh で作る）から Supabase に写す。
// import-shimizu.sh と同じ選び方・同じ列で、書き込みだけを HTTPS（PostgREST・service role）で行う。
// Postgres の 5432 に直接つなげない環境（クラウドのセッション）のため。
//
//   SOURCE_DB_URL=postgres://... node scripts/import-shimizu-rest.mjs
//
// 値は一つも作らない・変えない。何度流しても同じ結果になる（id で上書き、棚の中身は入れ替え）。
// 一つのトランザクションにはならない。途中で失敗したら、もう一度流せば揃う。
import { execFileSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'

const src = process.env.SOURCE_DB_URL
if (!src) throw new Error('SOURCE_DB_URL が要ります')
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const P = "(select id from protocol where provenance = 'trainer' and title not like '【架空】%')"
const dump = (sql) =>
  JSON.parse(
    execFileSync('psql', [src, '-v', 'ON_ERROR_STOP=1', '-qAt', '-c', `select coalesce(jsonb_agg(to_jsonb(t)), '[]') from (${sql}) t`], {
      maxBuffer: 1 << 28,
    }).toString(),
  )

const data = {
  exercise: dump(`select id, name, start_position, movement, focus_points, default_sets_raw, default_reps_raw, default_rest_raw, default_load_raw, video_url, contraindication from exercise where id in (select exercise_id from protocol_menu_item where protocol_id in ${P})`),
  protocol: dump(`select id, title, injury_key, grade, severity_label, surgery, healing_weeks_min, healing_weeks_max, daily_volume_target from protocol where id in ${P}`),
  protocol_menu_row: dump(`select id, protocol_id, row_index, week_hint, period_raw from protocol_menu_row where protocol_id in ${P}`),
  protocol_menu_cell: dump(`select c.id, c.menu_row_id, c.column_key, c.column_label, c.column_order, c.category_key, c.category_label, c.category_order from protocol_menu_cell c join protocol_menu_row r on r.id = c.menu_row_id where r.protocol_id in ${P}`),
  protocol_menu_item: dump(`select id, menu_cell_id, exercise_id, sort_order from protocol_menu_item where protocol_id in ${P}`),
  protocol_menu_category_rule: dump(`select id, protocol_id, column_key, category_key, category_type, daily_pick_limit, day_group from protocol_menu_category_rule where protocol_id in ${P}`),
}

async function upsert(table, rows) {
  for (let i = 0; i < rows.length; i += 1000) {
    const { error } = await db.from(table).upsert(rows.slice(i, i + 1000), { onConflict: 'id' })
    if (error) throw new Error(`${table}: ${error.message}`)
  }
}
async function clear(table) {
  const { error } = await db.from(table).delete().not('id', 'is', null)
  if (error) throw new Error(`${table}: ${error.message}`)
}

await upsert('exercise', data.exercise)
await upsert('protocol', data.protocol)
await upsert('protocol_menu_row', data.protocol_menu_row)
// 棚の中身は丸ごと入れ替える（元で消えた種目を残さない）
await clear('protocol_menu_item')
await clear('protocol_menu_cell')
await clear('protocol_menu_category_rule')
await upsert('protocol_menu_cell', data.protocol_menu_cell)
await upsert('protocol_menu_item', data.protocol_menu_item)
await upsert('protocol_menu_category_rule', data.protocol_menu_category_rule)

for (const t of Object.keys(data)) {
  const { count, error } = await db.from(t).select('*', { count: 'exact', head: true })
  if (error) throw new Error(`${t}: ${error.message}`)
  console.log(`${t}\t写し元 ${data[t].length}\t写し先 ${count}`)
}
