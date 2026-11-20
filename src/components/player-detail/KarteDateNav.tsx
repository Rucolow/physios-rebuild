'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Num } from '@/components/ui/Num'
import { cn } from '@/lib/cn'

const WD = ['日', '月', '火', '水', '木', '金', '土']
const label = (iso: string) => `${Number(iso.slice(0, 4))}年${Number(iso.slice(5, 7))}月${Number(iso.slice(8))}日（${WD[new Date(`${iso}T00:00:00Z`).getUTCDay()]}）`
function addDays(iso: string, n: number) { const d = new Date(`${iso}T00:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10) }

/**
 * カルテの日付。矢印で記録のある前後の日へ、日付を押すとカレンダーから好きな日へ移る。
 * 記録のある日には点を付ける。
 */
export function KarteDateNav({ base, date, marked, today }: { base: string; date: string; marked: string[]; today: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(date.slice(0, 7))
  const has = new Set(marked)
  const sorted = [...has].sort()
  const prev = sorted.filter((d) => d < date).at(-1) ?? null
  const next = sorted.find((d) => d > date) ?? null
  const href = (d: string) => `${base}&d=${d}`
  const first = `${month}-01`
  const start = addDays(first, -new Date(`${first}T00:00:00Z`).getUTCDay())
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i))
  const shiftMonth = (n: number) => { const d = new Date(`${first}T00:00:00Z`); d.setUTCMonth(d.getUTCMonth() + n); setMonth(d.toISOString().slice(0, 7)) }
  const arrow = 'inline-flex h-10 w-10 items-center justify-center rounded-field text-navy-300 hover:bg-layer-10 hover:text-white'
  return <div className="flex items-center justify-between gap-2 rounded-card border border-layer-10 bg-layer-5 px-2 py-1.5">
    {prev ? <Link href={href(prev)} aria-label="前の記録" className={arrow}><ChevronLeft size={20} aria-hidden="true" /></Link> : <span className={cn(arrow, 'opacity-30')} aria-hidden="true"><ChevronLeft size={20} /></span>}
    <Modal open={open} onOpenChange={(v) => { setOpen(v); if (v) setMonth(date.slice(0, 7)) }} title="日付を選ぶ"
      trigger={<button type="button" className="min-h-10 flex-1 rounded-field px-2 text-sm font-bold text-white hover:bg-layer-10"><Num>{label(date)}</Num></button>}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button type="button" aria-label="前の月" onClick={() => shiftMonth(-1)} className={arrow}><ChevronLeft size={18} aria-hidden="true" /></button>
          <Num className="text-sm font-bold text-white">{Number(month.slice(0, 4))}年{Number(month.slice(5))}月</Num>
          <button type="button" aria-label="次の月" onClick={() => shiftMonth(1)} className={arrow}><ChevronRight size={18} aria-hidden="true" /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-2xs text-navy-400">{WD.map((w) => <span key={w} className="py-1">{w}</span>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d) => <button key={d} type="button"
            onClick={() => { setOpen(false); router.push(href(d)) }}
            className={cn('flex h-11 flex-col items-center justify-center gap-1 rounded-field text-sm hover:bg-layer-10',
              d.slice(0, 7) === month ? 'text-navy-100' : 'text-navy-500',
              d === date && 'bg-gold-500 text-navy-900 hover:bg-gold-400',
              d === today && d !== date && 'border border-gold-500')}>
            <Num>{Number(d.slice(8))}</Num>
            <span className={cn('h-1 w-1 rounded-pill', has.has(d) ? (d === date ? 'bg-navy-900' : 'bg-emerald-400') : 'bg-transparent')} aria-hidden="true" />
          </button>)}
        </div>
      </div>
    </Modal>
    {next ? <Link href={href(next)} aria-label="次の記録" className={arrow}><ChevronRight size={20} aria-hidden="true" /></Link> : <span className={cn(arrow, 'opacity-30')} aria-hidden="true"><ChevronRight size={20} /></span>}
  </div>
}
