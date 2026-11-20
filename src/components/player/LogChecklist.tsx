'use client'
import { useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import type { PlayerDayItem } from '@/lib/playerDay'

export function LogChecklist({ token, items: initial }: { token: string; items: PlayerDayItem[] }) {
  const [items, setItems] = useState(initial)
  async function toggle(it: PlayerDayItem) {
    const next = !it.done
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: next } : x)))
    const res = await fetch(`/api/p/${token}/done`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: it.id, done: next }) }).catch(() => null)
    if (!res?.ok) setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: it.done } : x)))
  }
  const done = items.filter((i) => i.done).length
  return <>
    <p className="text-sm text-navy-300">今日 <Num mono className="font-bold text-white">{done} / {items.length}</Num> 完了</p>
    <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
      {items.map((it) => <button key={it.id} type="button" role="checkbox" aria-checked={it.done} onClick={() => toggle(it)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-layer-5">
        <span className={cn('inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border', it.done ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400' : 'border-layer-10 bg-layer-5 text-transparent')}><Check size={16} aria-hidden="true" /></span>
        <span className={cn('min-w-0 flex-1 text-sm', it.done ? 'text-navy-400' : 'font-bold text-white')}>{it.name}</span>
      </button>)}
    </div>
  </>
}
