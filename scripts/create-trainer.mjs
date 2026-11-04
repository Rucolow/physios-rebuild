// トレーナーのアカウントと、試用のための架空の選手一人を作る。
//
//   node scripts/create-trainer.mjs --email a@b.c --name '清水 遼'
//
// パスワードはチャットやコマンドに書かない。先に本人（か Rucolow）が Supabase の Dashboard の
// Authentication → Users → Add user でメールとパスワードを決めて作り、このスクリプトはそのメールで
// ユーザーを探してトレーナーに結びつける。--password を渡したときだけ、ここでユーザーを作る。
//
// 架空の選手の状態（怪我・時期・次の試合）は試用の出発点として置く見本であり、臨床の判断ではない。
// 選手の名前・日程は架空。プロトコルは取り込み済みの清水のものから題名で選ぶ。
import { createClient } from '@supabase/supabase-js'

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, v, i, a) => (v.startsWith('--') ? [...acc, [v.slice(2), a[i + 1]]] : acc), []),
)
for (const k of ['email', 'name']) if (!args[k]) throw new Error(`--${k} が要ります`)

const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})
const tz = args.tz ?? 'Europe/Berlin'
const today = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date())
const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

async function findUser(email) {
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase())
    if (u) return u
    if (data.users.length < 200) return null
  }
}
let user = await findUser(args.email)
if (!user) {
  if (!args.password) throw new Error(`${args.email} のユーザーがありません（Dashboard の Authentication → Users → Add user で先に作る）`)
  const { data: created, error: e1 } = await db.auth.admin.createUser({ email: args.email, password: args.password, email_confirm: true })
  if (e1) throw e1
  user = created.user
}
const created = { user }
const { data: trainer, error: e2 } = await db
  .from('trainer')
  .insert({ auth_user_id: created.user.id, name: args.name, time_zone: tz })
  .select('id')
  .single()
if (e2) throw e2

const PROTOCOL_TITLE = args.protocol ?? 'ハムストリングス肉離れ・中程度・なし'
const { data: protocol } = await db.from('protocol').select('id, title').eq('title', PROTOCOL_TITLE).single()
if (!protocol) throw new Error(`プロトコル「${PROTOCOL_TITLE}」がありません（先に import-shimizu.sh を流す）`)
const { data: row } = await db.from('protocol_menu_row').select('id').eq('protocol_id', protocol.id).eq('row_index', 2).single()

const { data: player, error: e3 } = await db
  .from('player')
  .insert({
    trainer_id: trainer.id,
    family_name: '森',
    given_name: '大和',
    aliases: ['ヤマト', 'もり'],
    team: 'U-19（架空）',
    is_fictional: true,
  })
  .select('id, share_token')
  .single()
if (e3) throw e3
const { data: ep } = await db
  .from('injury_episode')
  .insert({ player_id: player.id, protocol_id: protocol.id, injured_on: addDays(today, -13), label: protocol.title })
  .select('id')
  .single()
await db.from('menu_position').insert({ injury_episode_id: ep.id, menu_row_id: row.id, anchor_on: today, set_by: trainer.id })

// 次の土曜 15:00（トレーナーの時間帯）。架空の試合
const dow = new Date(`${today}T00:00:00Z`).getUTCDay()
const sat = addDays(today, ((6 - dow + 7) % 7) || 7)
const offset = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
  .formatToParts(new Date(`${sat}T12:00:00Z`))
  .find((p) => p.type === 'timeZoneName').value.replace('GMT', '') || '+00:00'
await db.from('match_schedule').insert({ trainer_id: trainer.id, team: 'U-19（架空）', kickoff_at: `${sat}T15:00:00${offset}`, opponent: '練習試合（架空）' })

console.log(JSON.stringify({ trainer: trainer.id, player: player.id, player_url_path: `/p/${player.share_token}` }, null, 2))
