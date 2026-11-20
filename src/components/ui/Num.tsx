import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const num = cva('tabular-nums', { variants: { mono: { true: 'font-mono', false: '' } }, defaultVariants: { mono: false } })
export type NumProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof num>
export function Num({ mono, className, ...props }: NumProps) {
  return <span className={cn(num({ mono }), className)} {...props} />
}
