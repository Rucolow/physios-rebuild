import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { SIGNAL } from '@/lib/design/signal'
import { cn } from '@/lib/utils'

/**
 * 今日のダイジェストの項目行（DESIGN_SYSTEM.md §5-2・2026-08-30 改訂 J19-4）。3 状態。
 *
 * 3 状態の区別は**状態語（§4-4）・明暗（§4-7）・位置**で運ぶ。
 * 旧規定の「amber 左バー + amber 面」は廃止——**行頭の色棒と状態色の行背景を禁止する**（§6-1）。
 * 状態のアイコン（AlertTriangle / Check）も置かない: 行の状態は行末の状態語 1 箇所のみが言う（§4-4）。
 */
const digestRow = cva('flex items-start gap-3 px-4 py-3 transition-colors duration-fast hover:bg-layer-5', { variants: { state: {
  pending: '',
  needs_review: '',
  // 過去（処理済み）は opacity ではなく文字色で沈める（§4-7・J19-4）
  approved: 'text-navy-400',
} }, defaultVariants: { state: 'pending' } })

/** 行末の状態語（§4-4）。pending は状態語を持たない——未読は異常ではない（§5-2） */
const STATE_WORD: Record<string, { label: string; className: string } | null> = {
  pending: null,
  needs_review: { label: '要確認', className: SIGNAL.watch.text },
  approved: { label: '確定済み', className: SIGNAL.none.text },
}

/** leading は時刻など、行頭に固定幅で置く補助情報（ダイジェストの時系列表示） */
export type DigestRowProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof digestRow> & { title: ReactNode; description?: ReactNode; actions?: ReactNode; leading?: ReactNode }
export function DigestRow({ state = 'pending', title, description, actions, leading, className, ...props }: DigestRowProps) {
  const word = STATE_WORD[state ?? 'pending']
  const settled = state === 'approved'
  return <div className={cn(digestRow({ state }), className)} {...props}>
    {leading && <span className="w-11 shrink-0 pt-0.5">{leading}</span>}
    <div className="min-w-0 flex-1">
      {/* 未処理は名前 text-white font-bold・本文 text-navy-200。処理済みは全体を沈め font-normal（§4-7） */}
      <p className={settled ? 'text-sm font-normal text-navy-400' : 'text-sm font-bold text-white'}>{title}</p>
      {description && <div className={cn('mt-1 text-2xs', settled ? 'text-navy-500' : 'text-navy-200')}>{description}</div>}
      {actions && state !== 'approved' && <div className="mt-3 flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
    {word && <span className={cn('shrink-0 pt-0.5 text-2xs font-bold', word.className)}>{word.label}</span>}
  </div>
}
