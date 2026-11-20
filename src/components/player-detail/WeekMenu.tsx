'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { DayMenu } from '@/components/menu/DayMenu'
import type { WeekDay } from '@/lib/playerDetail'

const WD = ['日', '月', '火', '水', '木', '金', '土']
const md = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8))}`
const wd = (iso: string) => WD[new Date(`${iso}T00:00:00Z`).getUTCDay()]

/** 週間メニュー。日を開くと、選手の画面と同じメニューが出る */
export function WeekMenu({ days, today, many }: { days: WeekDay[]; today: string; many: boolean }) {
  const [open, setOpen] = useState<string | null>(days.find((d) => d.date === today) ? `${today}` : null)
  const dates = [...new Set(days.map((d) => d.date))]
  return <div className="space-y-3">
    {dates.map((date) => {
      const rows = days.filter((d) => d.date === date)
      const items = rows.flatMap((r) => r.items)
      const done = items.filter((i) => i.done).length
      const rest = rows.every((r) => r.rest)
      const isOpen = open === date
      const kind = rest ? '休息日' : rows.map((r) => (r.dayGroup ? `${r.dayGroup} の日` : null)).filter(Boolean).join('・')
      return <div key={date} className={cn('overflow-hidden rounded-card border bg-layer-5', date === today ? 'border-gold-500' : 'border-layer-10')}>
        <button type="button" onClick={() => setOpen(isOpen ? null : date)} aria-expanded={isOpen} className="flex w-full items-center gap-3 px-4 py-3 text-left">
          <Num mono className={cn('rounded-badge px-2 py-0.5 text-2xs font-bold', date === today ? 'bg-gold-500 text-navy-900' : 'bg-layer-10 text-navy-400')}>{md(date)}</Num>
          <span className="min-w-0 flex-1 text-sm text-navy-200">{wd(date)} ・ {kind || 'メニュー'}{date > today ? '（明日）' : ''}</span>
          {!rest && items.length > 0 && <span className={cn('rounded-badge border px-2 py-0.5 text-2xs font-bold', done === items.length ? 'border-emerald-500/30 text-emerald-400' : 'border-gold-500/30 text-gold-400')}>
            <Num>{done}/{items.length}</Num> 完了
          </span>}
          <ChevronDown size={16} aria-hidden="true" className={cn('shrink-0 text-navy-400 transition-transform duration-fast', isOpen && 'rotate-180')} />
        </button>
        {isOpen && <div className="space-y-4 border-t border-layer-5 px-4 py-4">
          {rows.map((r, i) => <div key={i} className="space-y-3">
            {(many || r.period) && <p className="text-2xs text-navy-400">{[many ? r.episodeLabel : null, r.period].filter(Boolean).join(' ・ ')}</p>}
            {r.rest ? <p className="text-sm text-navy-300">休みの日です。</p> : <DayMenu items={r.items} />}
          </div>)}
        </div>}
      </div>
    })}
  </div>
}
