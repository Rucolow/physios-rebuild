import { SIGNAL, type Signal } from '@/lib/design/signal'
import { cn } from '@/lib/cn'

/** 行末の状態語（色だけに意味を載せない: 語そのものが状態を言う） */
export function StateWord({ tone, children, className }: { tone: Signal; children: string; className?: string }) {
  return <span className={cn('shrink-0 text-2xs font-bold', SIGNAL[tone].text, className)}>{children}</span>
}
