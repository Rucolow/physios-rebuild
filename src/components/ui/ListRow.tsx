import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const listRow = cva('flex items-center gap-3 transition-colors duration-fast', { variants: { variant: {
  standard: 'px-4 py-3 hover:bg-layer-5',
  interactive: 'px-4 py-3 hover:bg-layer-10 focus-visible:bg-layer-10',
  completed: 'bg-layer-3 px-4 py-2.5 opacity-60 transition-opacity duration-fast hover:opacity-100',
  current: 'relative rounded-field border border-gold-500 bg-layer-5 px-4 py-4 shadow-glow-strong',
  future: 'bg-layer-5 px-4 py-3 opacity-80',
} }, defaultVariants: { variant: 'standard' } })
/**
 * リスト容器の様式（§4-7）。`<ul>` で組む一覧（`List` が使えない場面）はこの定数を使う——
 * 容器のクラス文字列を書き写すと正規版が 2 つになる。
 */
export const listContainer = 'glass rounded-card border border-layer-10 divide-y divide-layer-5 overflow-hidden'
export function List({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn(listContainer, className)} {...props} /> }
export type ListRowProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof listRow>
export function ListRow({ variant, className, ...props }: ListRowProps) { return <div className={cn(listRow({ variant }), className)} {...props} /> }
