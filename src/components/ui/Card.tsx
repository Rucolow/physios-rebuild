import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const card = cva('rounded-card border border-layer-10', { variants: {
  surface: { glass: 'glass', solid: 'bg-navy' },
  interactive: { true: 'transition-colors duration-fast hover:border-gold-500/30 hover:bg-layer-5 focus-visible:border-gold-500', false: '' },
  compact: { true: 'p-4', false: '' },
}, defaultVariants: { surface: 'glass', interactive: false, compact: false } })
export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof card>
export function Card({ surface, interactive, compact, className, ...props }: CardProps) {
  return <div className={cn(card({ surface, interactive, compact }), className)} {...props} />
}
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('p-5 pb-3', className)} {...props} /> }
export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('p-5 pt-0', className)} {...props} /> }
