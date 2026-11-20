import type { HTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * 割込み帯（DESIGN_SYSTEM §4-17）。画面の冒頭に割り込む 1 枚の帯。
 *
 * - **状態色の面をまとえる唯一のコンポーネント**（§6-1 45）。トーンは SIGNAL の
 *   `soft` + `edge` に対応する α 面（/10 面・/30 境界）で描く
 * - ゴールド帯（`now`）は「次の一歩の割込み」（未確定の繰り越し等）専用（§1-5 (c)）
 * - **1 画面 1 枚まで**。ヘッダ帯の直下（本文の冒頭）に置く。置く枚数は呼び出し側の責任
 * - ゴールド 10% の α 面は暗面のままなので白見出しは P3 に触れない（§0 P3 の追記）
 */
export const interruptBand = cva(
  'flex w-full items-center gap-3 rounded-field border px-4 py-3',
  {
    variants: {
      tone: {
        now: 'bg-gold-500/10 border-gold-500/30',
        good: 'bg-emerald-500/10 border-emerald-500/30',
        watch: 'bg-amber-500/10 border-amber-500/30',
        act: 'bg-red-500/10 border-red-500/30',
        info: 'bg-blue-500/10 border-blue-500/30',
      },
    },
    defaultVariants: { tone: 'now' },
  },
)

export type InterruptBandProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof interruptBand> & {
    /** 見出し（`text-sm font-bold text-white`） */
    title: ReactNode
    /** 本文（`text-2xs text-navy-300`） */
    body?: ReactNode
    /** 右端のアクション（一次なら `primary`） */
    action?: ReactNode
  }

export function InterruptBand({ tone, title, body, action, className, ...props }: InterruptBandProps) {
  return (
    <div className={cn(interruptBand({ tone }), className)} {...props}>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white">{title}</p>
        {body && <p className="mt-0.5 text-2xs text-navy-300">{body}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
