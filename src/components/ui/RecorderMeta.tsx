/**
 * 記録者メタ（DESIGN_SYSTEM.md §4-15）。「誰の記録か」をメタ行に併置する。
 *
 * **バッジにもアバターにもしない。** 記録者は状態ではなく記録の属性であり、
 * 全行に第2のバッジが並ぶと「注意を引いてよいのは needs_review だけ」（§5-2）の
 * 序列が壊れる。CJK のイニシャルでは「清水」「清田」が同じ「清」になり識別子として
 * 機能しない。**トレーナーごとの色分けは禁止**（採用色相は4つ・§6-1）。
 *
 * **値が無ければ何も描かない。** 表示するかどうかの判定はデータ層が済ませており
 * （有効な在籍トレーナーが2人以上のクラブでのみ埋まる）、ここに条件を書かない——
 * 「取得して UI で隠す」分岐を作らない。
 */
export function RecorderMeta({ name, separator = true }: { name?: string | null; separator?: boolean }) {
  if (!name) return null
  return <span className="text-2xs text-navy-400">{separator ? '・ ' : ''}{name}</span>
}
