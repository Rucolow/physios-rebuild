import { SIGNAL, type Signal } from '@/lib/design/signal'
import { cn } from '@/lib/utils'

/** シグナルドット（§4-4）。ドット単体で状態を表さない（P6）。必ずテキストラベルを併記する。 */
export function Dot({ tone, className }: { tone: Signal; className?: string }) {
  if (tone === 'act') {
    return <span aria-hidden="true" className={cn('relative flex h-2 w-2 shrink-0', className)}>
      <span className="absolute inline-flex h-full w-full rounded-pill bg-red-400 opacity-40 animate-bar-pulse" />
      <span className="relative inline-flex h-2 w-2 rounded-pill bg-red-400" />
    </span>
  }
  return <span aria-hidden="true" className={cn('h-2 w-2 shrink-0 rounded-pill', SIGNAL[tone].dot, className)} />
}
