import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badge = cva('inline-flex items-center gap-1.5 rounded-badge px-2 py-1 text-2xs font-bold leading-none', { variants: { tone: {
  // 2026-08-30 改訂（J19-11）: tone の状態色面（bg-*-500/20）を廃止し、
  // 中立面 + 状態色の文字・境界に置換（§6-1 45 との両立。面の希少性を守る）
  neutral: 'bg-layer-5 text-navy-200 border border-layer-5',
  good: 'bg-layer-5 text-emerald-400 border border-emerald-500/30',
  watch: 'bg-layer-5 text-amber-400 border border-amber-500/30',
  act: 'bg-layer-5 text-red-400 border border-red-500/30',
  info: 'bg-layer-5 text-blue-400 border border-blue-500/30',
  now: 'bg-layer-5 text-gold-400 border border-gold-500/30',
  solid: 'bg-gold-500 text-navy-900 border border-transparent',
} }, defaultVariants: { tone: 'neutral' } })

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge> & {
  /**
   * 処理済み（過去）の文脈で使う沈み変種（§4-7 / §5-2 J19-4）。
   * 親の文字色は子の自前ユーティリティを上書きできないため、沈みは props で明示的に
   * 伝播させる——opacity での一括減光は「opacity ではなく文字色で沈める」（§4-7）に反する。
   * tone の意味（状態色）は捨てるが、テキストが意味を運ぶので P6 は保たれる。
   */
  muted?: boolean
}
export function Badge({ className, tone, muted, ...props }: BadgeProps) {
  return <span className={cn(badge({ tone }), muted && 'bg-layer-3 border-layer-5 text-navy-500', className)} {...props} />
}
