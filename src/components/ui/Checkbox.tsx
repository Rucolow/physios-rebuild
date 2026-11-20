'use client'

import type { ReactNode } from 'react'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * チェックボックス（DESIGN_SYSTEM §4-9）。
 *
 * **ネイティブ要素の CSS 上書きを禁止**しているので Radix で実装する。チェック状態の面は
 * `bg-gold-500`、チェックマークは `text-navy-900`（§6 の「ゴールド面上の白テキスト禁止」）。
 *
 * **プリミティブは文の形を持ち、語を持たない**（§2-9・J85）——ラベルは呼び出し側が渡す。
 * ゴールドは §1-5 の「選択された状態」の面であって、行の注意度ではない。
 */
export function Checkbox({ id, checked, onCheckedChange, disabled, children }: {
  id: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  children: ReactNode
}) {
  return <div className="flex items-start gap-3">
    <RadixCheckbox.Root
      id={id}
      checked={checked}
      disabled={disabled}
      onCheckedChange={(next) => onCheckedChange(next === true)}
      className={cn(
        'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-badge border border-layer-10 bg-layer-5',
        'transition-colors duration-fast ease-out',
        'focus-visible:border-gold-500 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:bg-layer-3',
        'data-[state=checked]:border-gold-500 data-[state=checked]:bg-gold-500',
      )}
    >
      <RadixCheckbox.Indicator className="text-navy-900">
        <Check size={16} strokeWidth={2} aria-hidden="true" />
      </RadixCheckbox.Indicator>
    </RadixCheckbox.Root>
    <label htmlFor={id} className="min-w-0 text-sm text-navy-100">{children}</label>
  </div>
}
