import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { SIGNAL, type Signal } from '@/lib/design/signal'
import { cn } from '@/lib/utils'

const toast = cva('flex items-start gap-3 rounded-card border p-4 shadow-e2 animate-fade-in-up glass')
const toastEdges: Record<Signal, string> = { good: SIGNAL.good.edge, watch: SIGNAL.watch.edge, act: SIGNAL.act.edge, info: 'border-layer-10', none: SIGNAL.none.edge }
export function ToastViewport({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn('fixed inset-x-4 bottom-4 z-toast flex flex-col gap-2 pb-safe md:inset-x-auto md:right-6 md:bottom-6 md:w-80', className)} {...props} /> }
export type ToastProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof toast> & { tone?: Signal; icon?: ReactNode; onClose?: () => void }
export function Toast({ tone = 'info', icon, children, onClose, className, ...props }: ToastProps) {
  const urgent = tone === 'act'
  return <div role={urgent ? 'alert' : 'status'} aria-live={urgent ? 'assertive' : 'polite'} className={cn(toast(), toastEdges[tone], className)} {...props}>
    {icon && <span className={cn('mt-0.5 shrink-0', SIGNAL[tone].text)}>{icon}</span>}<div className="flex-1 text-sm text-navy-100">{children}</div>{onClose && <button type="button" onClick={onClose} className="shrink-0 text-navy-400 transition-colors duration-fast hover:text-white" aria-label="通知を閉じる"><X size={16} strokeWidth={2} /></button>}
  </div>
}
