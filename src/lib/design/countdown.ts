import { SIGNAL } from './signal'

export type CountdownTone = 'act' | 'now' | 'watch' | 'near' | 'far' | 'none'

export function countdownTone(days: number | null): CountdownTone {
  if (days === null) return 'none'
  if (days < 0) return 'act'
  if (days === 0) return 'now'
  if (days <= 7) return 'watch'
  if (days <= 30) return 'near'
  return 'far'
}

/** DESIGN_SYSTEM.md §1-7 の「表示」列。数値部分は <Num> で包んで使う。 */
export function countdownLabel(days: number | null): string {
  if (days === null) return '未定'
  if (days < 0) return `${Math.abs(days)} 日超過`
  if (days === 0) return '本日復帰'
  return `あと ${days} 日`
}

/** 暗面上に直接テキストとして出す場合の色（§1-7）。面・境界は SIGNAL を使う。 */
export const COUNTDOWN_TEXT: Record<CountdownTone, string> = {
  act: SIGNAL.act.text,
  now: 'text-gold-400',
  watch: SIGNAL.watch.text,
  near: 'text-navy-200',
  far: 'text-navy-400',
  none: SIGNAL.none.text,
}

/** バッジで出す場合の tone（§4-3）。near / far / none は色を持たない。 */
export const COUNTDOWN_BADGE_TONE = {
  act: 'act',
  now: 'now',
  watch: 'watch',
  near: 'neutral',
  far: 'neutral',
  none: 'neutral',
} as const
