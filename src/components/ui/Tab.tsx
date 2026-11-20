'use client'

import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const tab = cva('shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors duration-fast', { variants: { active: {
  true: 'border-gold-500 text-gold-400',
  false: 'border-transparent text-navy-400 hover:text-navy-200',
} } })
export interface TabItem { id: string; label: ReactNode; panel: ReactNode }
export function Tabs({ items, activeId, onChange, className }: { items: TabItem[]; activeId: string; onChange: (id: string) => void; className?: string }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const offset = event.key === 'ArrowRight' ? 1 : -1
    const next = (index + offset + items.length) % items.length
    onChange(items[next].id)
    refs.current[next]?.focus()
  }
  const active = items.find((item) => item.id === activeId) ?? items[0]
  return <div className={className}>
    <div role="tablist" className="flex gap-1 overflow-x-auto scrollbar-hide border-b border-layer-10">
      {items.map((item, index) => <button key={item.id} ref={(node) => { refs.current[index] = node }} type="button" role="tab" id={`${item.id}-tab`} aria-selected={item.id === active.id} aria-controls={`${item.id}-panel`} tabIndex={item.id === active.id ? 0 : -1} className={cn(tab({ active: item.id === active.id }))} onClick={() => onChange(item.id)} onKeyDown={(event) => handleKeyDown(event, index)}>{item.label}</button>)}
    </div>
    <div role="tabpanel" id={`${active.id}-panel`} aria-labelledby={`${active.id}-tab`} className="pt-5">{active.panel}</div>
  </div>
}
