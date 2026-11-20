import type { Signal } from './signal'

/** 参加区分（設計書 4.3）。指導者ボードの唯一の情報源。 */
export type Participation = 'full' | 'limited' | 'out'

export const PARTICIPATION_LABEL: Record<Participation, string> = {
  full: '完全参加',
  limited: '制限付き',
  out: '離脱中',
}

/**
 * 参加区分の宣言がまだ届いていない状態の語（裁定 J61）。
 * **`Participation` に 4 値目を作らない**——DB に無い値を発明しない（§2-9 6）。
 * 現在行が無い状態は `null` で表し、この語で示す。
 */
export const PARTICIPATION_UNSET_LABEL = '未設定'

/**
 * トレーナーアプリ内での区分バッジの tone。
 * 指導者ボードは行末の状態語様式（DESIGN_SYSTEM.md §5-4——ベタ塗りチップは
 * 2026-08-30 の J19-4 で廃止済み）で出す。
 */
export const PARTICIPATION_TONE: Record<Participation, Extract<Signal, 'good' | 'watch' | 'act'>> = {
  full: 'good',
  limited: 'watch',
  out: 'act',
}
