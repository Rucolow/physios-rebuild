'use client'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'

/** 今日の痛み・疲労（0〜6）。押した時点で記録する */
export function ConditionScale({ token, kind, value, title, none, severe }: { token: string; kind: 'pain' | 'fatigue'; value: number | null; title: string; none: string; severe: string }) {
  const [selected, setSelected] = useState<number | null>(value)
  const [error, setError] = useState(false)
  async function pick(score: number) {
    const prev = selected
    setSelected(score)
    setError(false)
    const res = await fetch(`/api/p/${token}/condition`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, score }) }).catch(() => null)
    if (!res?.ok) { setSelected(prev); setError(true) }
  }
  return <div>
    <p className="mb-2 text-2xs font-bold uppercase tracking-wider text-navy-400">{title}</p>
    <div className="flex items-center justify-between gap-1" role="radiogroup" aria-label={title}>
      {[0, 1, 2, 3, 4, 5, 6].map((s) => <button key={s} type="button" role="radio" aria-checked={selected === s} onClick={() => pick(s)}
        className={cn('h-11 w-11 rounded-pill text-2xs font-bold transition-colors duration-fast', selected === s ? 'border border-layer-10 bg-layer-20 text-white' : 'border border-transparent bg-layer-5 text-navy-400 hover:bg-layer-10 hover:text-white')}>
        <Num>{s}</Num>
      </button>)}
    </div>
    <div className="mt-1.5 flex justify-between"><span className="text-2xs text-navy-500">{none}</span><span className="text-2xs text-navy-500">{severe}</span></div>
    <p className={cn('mt-2 text-2xs', error ? 'text-red-400' : selected === null ? 'text-navy-500' : 'text-navy-300')}>
      {error ? '記録できませんでした。もう一度押してください。' : selected === null ? 'まだ記録していません' : <Num>今日の{kind === 'pain' ? '痛み' : '疲労'}を {selected} と記録しました</Num>}
    </p>
  </div>
}
