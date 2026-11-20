/**
 * チャットの時刻表示（§5-10）。
 *
 * 表示はすべて**サーバのローカル時刻**で組む。会話は「トレーナーがいつ読んだか」の
 * 文脈で並ぶため、選手のタイムゾーンに揃えない（値の変換であって解釈ではない）。
 * 未知・不正な日時は `—` を返す——値を推定して埋めない（§5-3）。
 */

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'] as const

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/** 「HH:MM」 */
export function chatTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** スレッドの日付区切り「M/D (曜)」 */
export function chatDateLabel(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]})`
}

/** 同じローカル日か（スレッドの日付区切りの単位） */
export function sameChatDay(a: string, b: string): boolean {
  const da = new Date(a)
  const db = new Date(b)
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return false
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate()
}

/** 一覧の行末: 本日なら「HH:MM」、それ以外は「M/D」 */
export function chatListLabel(iso: string, now: Date = new Date()): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const isToday = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
  return isToday ? chatTime(iso) : `${d.getMonth() + 1}/${d.getDate()}`
}
