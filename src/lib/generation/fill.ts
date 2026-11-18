/**
 * 1日分のメニューを、表1の行（その時期＝一週間に使う種目の棚）から採る純関数。
 *
 * 清水の規則（旧アプリ ryo-app の docs/shimizu-daily-menu-rules.md。清水の Discord のメモ。
 * knowledge fsnz/PHYSIOS/facts.md「1日のメニューの組み方」）:
 * - 稼働日に A と B を交互に置く。A は準備・下半身・持久系、B は準備・上半身・持久系（どの見出しがどちらかは規則表の day_group）
 * - 自転車とジョギング（category_type = cardio）は排他。同じ日に両方やらず、日替わりで 1 種目
 * - 高強度（high_intensity）は 2 種目をローテーション
 * - 休みは週に 1 日（既定は日曜）
 *
 * 表の読み方（2026-11-18 Claude の読み。Rucolow の依頼で表から推し量ったもので、清水の明文ではない）:
 * - 見出しの中の種目は同じ動きの変化形か段階。1 日に見出しから 1 種目を出し、次にその見出しが出る日は次の種目に進む
 * - 1 日の量（protocol.daily_volume_target、清水のプロトコルは 16）に足りない分は、
 *   day_group が A の見出し（下半身）から 1 本ずつ足す。準備（both）と上半身（B）には足さない
 * - 量を超える日は作らない（超えそうなら足す前で止まる。1 見出し 1 種目で超えることは今のデータでは無い）
 *
 * どの種目を出すかは、行が決まった日（anchor）から対象日まで一日ずつ進めて決める。実施記録は見ない。
 */

export type CategoryType = 'general' | 'cardio' | 'high_intensity'
export type DayGroup = 'A' | 'B' | 'both'

/** 既存の版の既定。日曜（ISO 7）を休みにする */
export const DEFAULT_REST_DAYS = [7]

/** 規則表に本数が無いときの、種別ごとの 1 日の本数（清水の規則） */
const DEFAULT_TAKE: Record<CategoryType, number> = { general: 1, cardio: 1, high_intensity: 2 }

export interface FillRule {
  categoryType: CategoryType
  dailyPickLimit: number | null
  dayGroup: DayGroup
}

export interface ShelfCell<T> {
  items: readonly T[]
  /** null = 規則が未登録（一般・毎日として扱う） */
  rule: FillRule | null
}

const UNREGISTERED: FillRule = { categoryType: 'general', dailyPickLimit: null, dayGroup: 'both' }

function toUtc(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

export function isoWeekday(iso: string): number {
  const d = toUtc(iso).getUTCDay()
  return d === 0 ? 7 : d
}

export type AbDay =
  | { isRestDay: true; dayGroup: null; workdayIndex: null }
  | { isRestDay: false; dayGroup: 'A' | 'B'; workdayIndex: number }

/** 数え始めの日（行が決まった日）から、対象日が A 日か B 日か */
export function resolveAbDay(anchorOn: string, targetOn: string, restDays = DEFAULT_REST_DAYS): AbDay {
  if (targetOn < anchorOn) throw new Error('対象日が数え始めより前です')
  if (restDays.includes(isoWeekday(targetOn))) return { isRestDay: true, dayGroup: null, workdayIndex: null }
  let index = 0
  const cursor = toUtc(anchorOn)
  const end = toUtc(targetOn)
  while (cursor < end) {
    const iso = cursor.toISOString().slice(0, 10)
    if (!restDays.includes(isoWeekday(iso))) index += 1
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return { isRestDay: false, dayGroup: index % 2 === 0 ? 'A' : 'B', workdayIndex: index }
}

function onDay(g: DayGroup, day: 'A' | 'B'): boolean {
  return g === 'both' || g === day
}

/** 稼働日の並び（0 番目から n 番目まで）で、各日に各見出しから何本採るか */
export function takesForDay(
  shelf: readonly { size: number; rule: FillRule | null }[],
  workdayIndex: number,
  budget: number | null,
): number[] {
  const day: 'A' | 'B' = workdayIndex % 2 === 0 ? 'A' : 'B'
  const rules = shelf.map((s) => s.rule ?? UNREGISTERED)
  const takes = shelf.map(() => 0)

  // 持久系（cardio）は排他: その日に出せる cardio の見出しのうち、稼働日の番号で一つを選ぶ
  const cardio = shelf.map((s, i) => i).filter((i) => rules[i].categoryType === 'cardio' && shelf[i].size > 0 && onDay(rules[i].dayGroup, day))
  if (cardio.length) {
    const i = cardio[workdayIndex % cardio.length]
    takes[i] = Math.min(rules[i].dailyPickLimit ?? DEFAULT_TAKE.cardio, shelf[i].size)
  }
  for (let i = 0; i < shelf.length; i += 1) {
    const r = rules[i]
    if (r.categoryType === 'cardio' || shelf[i].size === 0 || !onDay(r.dayGroup, day)) continue
    takes[i] = Math.min(r.dailyPickLimit ?? DEFAULT_TAKE[r.categoryType], shelf[i].size)
  }
  if (budget === null) return takes

  // 足りない分は下半身（day_group A の一般の見出し）に 1 本ずつ足す
  let total = takes.reduce((a, b) => a + b, 0)
  const extra = shelf.map((s, i) => i).filter((i) => rules[i].categoryType === 'general' && rules[i].dayGroup === 'A' && day === 'A')
  let gave = true
  while (total < budget && gave) {
    gave = false
    for (const i of extra) {
      if (total >= budget) break
      if (takes[i] >= shelf[i].size) continue
      takes[i] += 1
      total += 1
      gave = true
    }
  }
  return takes
}

/**
 * 行が決まってから workdayIndex 番目の稼働日に、各見出しから採る種目を棚の順で返す。
 * 見出しごとに、前にその見出しが出た日の続きから採る（見出しの中を一巡したら先頭に戻る）。
 */
export function pickForDay<T>(
  shelf: readonly ShelfCell<T>[],
  ab: { dayGroup: 'A' | 'B'; workdayIndex: number },
  budget: number | null,
): T[][] {
  const sizes = shelf.map((s) => ({ size: s.items.length, rule: s.rule }))
  const used = shelf.map(() => 0)
  for (let d = 0; d < ab.workdayIndex; d += 1) {
    takesForDay(sizes, d, budget).forEach((t, i) => (used[i] += t))
  }
  const today = takesForDay(sizes, ab.workdayIndex, budget)
  return shelf.map((s, i) => {
    const out: T[] = []
    for (let k = 0; k < today[i]; k += 1) out.push(s.items[(used[i] + k) % s.items.length])
    return out
  })
}
