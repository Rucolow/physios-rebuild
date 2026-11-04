import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** 数値は全て等幅数字（P4） */
export function Num({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('nums', className)}>{children}</span>
}
