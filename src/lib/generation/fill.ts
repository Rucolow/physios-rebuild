/**
 * 1日分のメニューを、表1の行（その時期に使ってよい種目の棚）から採る純関数。
 *
 * 既存の physios の src/lib/generation/dailyPick.ts と abDay.ts の規則をそのまま写した。
 * エンジンは臨床の数を持たない。本数と A/B 日はプロトコルの採用規則（DB）から来る。
 * ここにある 1 と 2 は、DB が本数を書いていないときの種別ごとの既定（既存の版と同じ）。
 *
 * 段は三つ。
 * 1. 確保: 本数が決まっている見出し（cardio 1・high_intensity 2・明示の本数）を棚の順に取る。
 * 2. 周回: 本数の決まっていない見出しを棚の順に1本ずつ回り、1日の量（16）に達したら止める。
 * 3. 補わない: 量が余っても足さない。
 *
 * 見出しの中で何番目から採るかは、その行で何日目か（休みの日を除く）から決まる。
 * 実施記録は見ない（サボった日で順番がずれないように）。
 */

export type CategoryType = 'general' | 'cardio' | 'high_intensity'
export type DayGroup = 'A' | 'B' | 'both'

export const DEFAULT_PICK_LIMIT: Record<CategoryType, number | null> = {
  cardio: 1,
  high_intensity: 2,
  general: null,
}

/** 既存の版の既定。日曜（ISO 7）を休みにする */
export const DEFAULT_REST_DAYS = [7]

export interface FillRule {
  categoryType: CategoryType
  dailyPickLimit: number | null
  dayGroup: DayGroup
}

export interface FillCell {
  poolSize: number
  /** null = 規則が未登録（上限なし・毎日） */
  rule: FillRule | null
}

const UNREGISTERED: FillRule = { categoryType: 'general', dailyPickLimit: null, dayGroup: 'both' }

export function pickLimitOf(rule: FillRule): number | null {
  return rule.dailyPickLimit ?? DEFAULT_PICK_LIMIT[rule.categoryType]
}

export function matchesDayGroup(g: DayGroup, today: 'A' | 'B'): boolean {
  return g === 'both' || g === today
}

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

export function rotate<T>(pool: readonly T[], count: number, offset: number): T[] {
  if (pool.length === 0) return []
  if (count >= pool.length) return [...pool]
  const start = ((offset % pool.length) + pool.length) % pool.length
  const picked: T[] = []
  for (let i = 0; i < count; i += 1) picked.push(pool[(start + i) % pool.length])
  return picked
}

export function offsetOf(poolSize: number, takeA: number, takeB: number, workdayIndex: number): number {
  if (poolSize <= 0) return 0
  const taken = Math.ceil(workdayIndex / 2) * takeA + Math.floor(workdayIndex / 2) * takeB
  return ((taken % poolSize) + poolSize) % poolSize
}

function takesFor(cells: readonly FillCell[], rules: FillRule[], limits: (number | null)[], day: 'A' | 'B', budget: number | null) {
  const takes = new Array<number>(cells.length).fill(0)
  let reserved = 0
  for (let i = 0; i < cells.length; i += 1) {
    if (!matchesDayGroup(rules[i].dayGroup, day) || limits[i] === null) continue
    takes[i] = Math.min(limits[i] as number, cells[i].poolSize)
    reserved += takes[i]
  }
  const pool = cells
    .map((c, i) => i)
    .filter((i) => matchesDayGroup(rules[i].dayGroup, day) && limits[i] === null && cells[i].poolSize > 0)
  if (budget === null) {
    for (const i of pool) takes[i] = cells[i].poolSize
    return takes
  }
  let remaining = budget - reserved
  while (remaining > 0) {
    let gave = 0
    for (const i of pool) {
      if (remaining <= 0) break
      if (takes[i] >= cells[i].poolSize) continue
      takes[i] += 1
      remaining -= 1
      gave += 1
    }
    if (gave === 0) break
  }
  return takes
}

export interface CellPlan {
  take: number
  /** null = 全件（巡回しない） */
  offset: number | null
}

export function fillDay(
  cells: readonly FillCell[],
  ab: { dayGroup: 'A' | 'B'; workdayIndex: number },
  budget: number | null,
): CellPlan[] {
  const rules = cells.map((c) => c.rule ?? UNREGISTERED)
  const limits = rules.map(pickLimitOf)
  const forA = takesFor(cells, rules, limits, 'A', budget)
  const forB = takesFor(cells, rules, limits, 'B', budget)
  const today = ab.dayGroup === 'A' ? forA : forB
  return cells.map((c, i) => {
    const offDay = !matchesDayGroup(rules[i].dayGroup, ab.dayGroup)
    const whole = !offDay && today[i] >= c.poolSize
    return {
      take: today[i],
      offset: offDay || whole ? null : offsetOf(c.poolSize, forA[i], forB[i], ab.workdayIndex),
    }
  })
}

/** 棚と規則から、その日に採る種目を棚の順で返す */
export function pickForDay<T>(
  shelf: readonly { items: readonly T[]; rule: FillRule | null }[],
  ab: { dayGroup: 'A' | 'B'; workdayIndex: number },
  budget: number | null,
): T[][] {
  const plans = fillDay(
    shelf.map((s) => ({ poolSize: s.items.length, rule: s.rule })),
    ab,
    budget,
  )
  return shelf.map((s, i) => {
    const p = plans[i]
    if (p.take === 0) return []
    if (p.offset === null) return s.items.slice(0, p.take)
    return rotate(s.items, p.take, p.offset)
  })
}
