import { SIGNAL } from '@/lib/design/signal'
import { cn } from '@/lib/utils'

/**
 * 「訳なし（原文）」の状態語（DESIGN_SYSTEM §2-9 訳なしの表示・裁定 J30-5 / J96）。
 *
 * **訳なしは行の状態ではなく、そこにある文字列の属性である。** よって §4-4 の
 * 「行の状態は行末の状態語 1 箇所のみが言う」の対象ではなく、**当該テキストの直後**に
 * インラインで置く（種目行では 2 段目の用量行の末尾・指導者一覧では副行の末尾・
 * 詳細では当該 `dd` の末尾）。行末列の「済」「山括弧」「参加区分」を押し出さない。
 *
 * **`Badge` を使わない**（J96）。面（背景）を持つ要素は行の中で強く、訳の欠落が
 * 悪化や要返答と同じ重みで読める。§1-6 のとおり色は注意の必要度を表し、
 * ここは `watch` の**文字色**で足りる。
 *
 * **語を持たない**（J85）。呼び出し側が辞書 `shared.untranslated` から渡す。
 * 選手・指導者の 3 箇所で同じ `<span>` を書き写すと、片方だけが直る状態を作る。
 *
 * **可視テキストのまま置く**（J96）。`aria-label` に写さず `sr-only` にもしない——
 * 読み上げが「（種目名）（用量）訳なし（原文）」と読むのが、その行の事実である。
 *
 * `w-col-state`（§4-7）に置く語ではないので、J86 の「欧文 13 字」の制約は掛からない。
 */
export function UntranslatedMark({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn('ml-2 shrink-0 text-2xs font-bold', SIGNAL.watch.text, className)}>{label}</span>
  )
}
