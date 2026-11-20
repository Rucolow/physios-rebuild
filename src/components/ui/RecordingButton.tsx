import type { ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Mic, Square } from 'lucide-react'
import { SIGNAL } from '@/lib/design/signal'
import { cn } from '@/lib/utils'
import { Num } from './Num'

const recordingButton = cva('relative inline-flex h-14 w-14 items-center justify-center rounded-pill transition-colors duration-base ease-out', { variants: { state: {
  idle: 'bg-gold-500 text-navy-900 shadow-glow hover:bg-gold-400',
  recording: 'bg-red-500 text-navy-900 animate-glow-pulse-danger',
  processing: 'bg-layer-10 text-navy-300 cursor-not-allowed',
} }, defaultVariants: { state: 'idle' } })
export type RecordingButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & VariantProps<typeof recordingButton> & { elapsed?: string; level?: 0 | 1 | 2 | 3 | 4 | 5 }
export function RecordingButton({ state = 'idle', elapsed = '00:00', level = 0, className, disabled, ...props }: RecordingButtonProps) {
  const label = state === 'idle' ? '録音' : state === 'recording' ? '録音停止' : '文字起こし中'
  return <div className="inline-flex flex-col items-center gap-2" aria-live="polite">
    <button type="button" aria-label={label} aria-busy={state === 'processing'} disabled={disabled || state === 'processing'} className={cn(recordingButton({ state }), className)} {...props}>
      {state === 'idle' && <Mic size={24} strokeWidth={1.75} aria-hidden="true" />}
      {state === 'recording' && <Square size={20} strokeWidth={2} aria-hidden="true" />}
      {state === 'processing' && <span aria-hidden="true" className="inline-block h-5 w-5 animate-spin rounded-pill border-2 border-layer-10 border-t-gold-500" />}
    </button>
    {state === 'recording' ? <><Num mono className="text-2xs text-navy-200">{elapsed}</Num><span className="flex h-2 items-end gap-1 rounded-pill bg-navy-900 px-1" aria-label={`入力レベル ${level}/5`}>{[1, 2, 3, 4, 5].map((bar) => <span key={bar} className={cn('h-1 w-1 rounded-pill', bar <= level ? SIGNAL.act.dot : 'bg-layer-10')} />)}</span></> : <span className="text-2xs font-medium text-navy-300">{label}</span>}
  </div>
}
