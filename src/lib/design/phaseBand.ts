/**
 * 月間カレンダーのフェーズ帯（DESIGN_SYSTEM.md §5-7）。
 *
 * **帯の色は進行段階であり、状態ではない。** `SIGNAL` とゴールドを帯に使うことを禁止する。
 * 初期フェーズに amber / red を当てない——リハビリ初期は異常ではない（P5）。
 * 達成（emerald・§5-5）に近づくほど濃くなるので、意味が §5-5 と連続する。
 */
export const PHASE_BAND = {
  first: 'bg-emerald-500/10',
  middle: 'bg-emerald-500/20',
  last: 'bg-emerald-400',
} as const

export type PhaseBandLevel = keyof typeof PHASE_BAND

/**
 * フェーズの位置（0 始まり）を3段の濃度に写す。
 * 総数が1なら `last`（唯一のフェーズは最終段階でもある）。
 */
export function phaseBandLevel(index: number, total: number): PhaseBandLevel {
  if (total <= 1 || index >= total - 1) return 'last'
  if (index <= 0) return 'first'
  return 'middle'
}
