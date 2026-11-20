import type { ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/** スピナー（§4-8・1 種類のみ） */
export function Spinner({ className }: { className?: string }) {
  return <span role="status" aria-label="読み込み中" className={cn('inline-block h-5 w-5 animate-spin rounded-pill border-2 border-layer-10 border-t-gold-500', className)} />
}

/** スケルトン（§4-8） */
const skeleton = cva('animate-pulse bg-layer-5', { variants: { shape: { line: 'rounded-field', card: 'rounded-card' } }, defaultVariants: { shape: 'line' } })
export type SkeletonProps = VariantProps<typeof skeleton> & { className?: string }
export function Skeleton({ shape, className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn(skeleton({ shape }), className)} />
}

/** 空状態・エラー状態（§4-12）。アイコン枠は h-12 w-12 固定。 */
export function EmptyState({ icon, title, description, action, tone = 'none', className }: { icon: ReactNode; title: string; description?: ReactNode; action?: ReactNode; tone?: 'none' | 'act'; className?: string }) {
  return <div className={cn('glass rounded-card border border-layer-10 p-6 text-center', className)}>
    <div className={cn('mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-card bg-layer-5', tone === 'act' ? 'text-red-400' : 'text-navy-400')}>{icon}</div>
    <p className="text-base font-bold text-white">{title}</p>
    {description && <p className="mt-1 text-sm text-navy-400">{description}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
}
