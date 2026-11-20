import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 絞り込み・並び替えのトグル（DESIGN_SYSTEM.md §4-3。1 種類のみ）。
 *
 * **active にゴールドを使わない**（2026-07-30 裁定 P1 で改訂）。絞り込みの選択状態は
 * 「現在地」でも「一次アクション」でもなく**表示条件**であり、§1-5 の予約3用途に無い。
 * active な条件が N 個あればゴールドが N 箇所出る構造は、予約の希少性そのものを壊す。
 *
 * **選択状態を面の明度差だけで表さない（P6）。** `Check` は呼び出し側の記述に頼らず
 * ここで描く——忘れられる余地を作らない。
 */
export const pill = cva(['inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-2xs font-bold whitespace-nowrap', 'transition-colors duration-fast ease-out'], { variants: { active: {
  true: 'bg-layer-20 text-white border border-layer-10',
  false: 'bg-layer-5 text-navy-300 border border-layer-10 hover:bg-layer-10 hover:text-white',
} }, defaultVariants: { active: false } })

export type PillProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof pill>
export function Pill({ className, active, type = 'button', children, ...props }: PillProps) {
  return <button type={type} aria-pressed={active ?? false} className={cn(pill({ active }), className)} {...props}>
    {active && <Check size={16} strokeWidth={2} aria-hidden="true" />}
    {children}
  </button>
}
