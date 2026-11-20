'use client'

import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * モーダル（DESIGN_SYSTEM.md §4-10）。
 *
 * **高さは `max-h-sheet` で止め、スクロールは本文だけに許す。** 一次ボタンを含む
 * フッターは常に可視でなければならない——本体ごとスクロールさせると、一次ボタンが
 * 「到達可能」なだけで「見えない」状態になる。
 *
 * `animate-scale-in` は `transform` ではなく独立プロパティ `scale` で定義してある（§3-8）。
 * `transform` で書くと `fill-mode: both` の終了値が `-translate-x-1/2 -translate-y-1/2` を
 * 上書きし、中央寄せが壊れる。
 *
 * **保存中（`busy`）は閉鎖を1箇所で抑止する**（§4-10 保存中の様式・裁定 J55）:
 * 暗幕クリック・Esc・× を無効化し、本文に `aria-busy`、末尾に `aria-live` の進行文を出す。
 * 保存中に閉じると結果が見えない。フッターの「やめる」は呼び出し側が `disabled={busy}` にする
 * （フッターの中身はここでは知らない）。スピナーは作らない——文言で足りる。
 */
const content = cva('glass flex max-h-sheet flex-col overflow-hidden border border-layer-10 shadow-e3', { variants: {
  placement: {
    center: 'fixed left-1/2 top-1/2 z-modal w-modal -translate-x-1/2 -translate-y-1/2 rounded-sheet data-[state=open]:animate-scale-in',
    sheet: 'fixed inset-x-0 bottom-0 z-modal rounded-t-sheet border-t pb-safe data-[state=open]:animate-slide-up',
  }, width: { form: 'max-w-form', detail: 'max-w-detail' },
}, defaultVariants: { placement: 'center', width: 'form' } })
export function Modal({ open, onOpenChange, trigger, title, children, footer, placement = 'center', width = 'form', busy = false, busyLabel = '保存しています…', closeLabel = '閉じる' }: {
  open?: boolean; onOpenChange?: (open: boolean) => void; trigger?: ReactNode; title: ReactNode; children: ReactNode; footer?: ReactNode; placement?: 'center' | 'sheet'; width?: 'form' | 'detail'
  /** 書き込み中。閉鎖を抑止し、進行文を出す（§4-10・J55） */
  busy?: boolean
  /** 進行文。一次ボタンの進行形と同じ文言にする（「追加しています…」等） */
  busyLabel?: string
  /**
   * × の読み上げ名。**選手・指導者の面から呼ぶときは辞書の語を渡す**（裁定 J30-4）——
   * 既定値の日本語は、辞書を持たないトレーナー画面のための既定にすぎない。
   * 独語の選手の画面に「閉じる」が 1 語だけ混ざる経路をここで塞ぐ
   */
  closeLabel?: string
}) {
  return <Dialog.Root open={open} onOpenChange={(next) => { if (busy && !next) return; onOpenChange?.(next) }}>
    {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
    <Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-overlay bg-scrim-70 backdrop-blur-sm data-[state=open]:animate-fade-in" />
      <Dialog.Content
        className={cn(content({ placement, width }))}
        onPointerDownOutside={(e) => { if (busy) e.preventDefault() }}
        onInteractOutside={(e) => { if (busy) e.preventDefault() }}
        onEscapeKeyDown={(e) => { if (busy) e.preventDefault() }}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 p-5 pb-3"><Dialog.Title className="text-base font-bold text-white">{title}</Dialog.Title><Dialog.Close disabled={busy} className="shrink-0 text-navy-400 transition-colors duration-fast hover:text-white disabled:pointer-events-none disabled:opacity-50" aria-label={closeLabel}><X size={20} strokeWidth={2} /></Dialog.Close></div>
        <div className="min-h-0 overflow-y-auto px-5 pb-5" aria-busy={busy || undefined}>
          {children}
          {/* 進行文は本文末尾に 1 行。ボタン文言の変化だけでは読み上げに乗らない（J55） */}
          <p aria-live="polite" className={cn('text-2xs text-navy-400', busy ? 'mt-4' : 'sr-only')}>{busy ? busyLabel : ''}</p>
        </div>
        {footer && <div className="flex shrink-0 items-center justify-end gap-2 border-t border-layer-5 p-5">{footer}</div>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
}
