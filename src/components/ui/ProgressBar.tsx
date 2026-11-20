import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Num } from './Num'

const track = cva('w-full overflow-hidden rounded-pill bg-layer-10', { variants: { size: { standard: 'h-1.5', prominent: 'h-2' } }, defaultVariants: { size: 'standard' } })
/**
 * 進捗バー（DESIGN_SYSTEM §4-8）。
 * `value` は `percentOf()`（`src/lib/format/percent.ts`）由来の**整数**を受け取る契約で、
 * **ここでは丸めない**（§2-9 規則 17・J191。生成点が 2 つあると片方だけが直る）。
 * 0-100 のクランプは幅描画の防御であって、丸めではない。
 */
export function ProgressBar({ label, value, size = 'standard', className }: { label: string; value: number; size?: 'standard' | 'prominent'; className?: string }) {
  const clamped = Math.min(100, Math.max(0, value))
  return <div className={cn('space-y-1.5', className)}>
    <div className="flex items-center justify-between gap-3"><span className="text-2xs font-bold uppercase tracking-wider text-navy-400">{label}</span><Num mono className="text-sm font-bold text-emerald-400">{value}%</Num></div>
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label} className={cn(track({ size }))}><div className="h-full rounded-pill bg-emerald-400" style={{ width: `${clamped}%` }} /></div>
  </div>
}
