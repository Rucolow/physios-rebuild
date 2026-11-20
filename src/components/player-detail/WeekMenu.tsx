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

/** 週間メニュー。今日だけを大きく開いて見せ、他の日は畳んでおく */
export function WeekMenu({ days, today, many }: { days: WeekDay[]; today: string; many: boolean }) {
  const [open, setOpen] = useState<string | null>(days.some((d) => d.date === today) ? today : null)
  const dates = [...new Set(days.map((d) => d.date))]
  const todayRows = days.filter((d) => d.date === today)
  return <div className="space-y-6">
    {todayRows.length > 0 && <section className="overflow-hidden rounded-card border border-gold-500 bg-layer-5">
      <Head date={today} rows={todayRows} big />
      <Body rows={todayRows} many={many} />
    </section>}
    <div className="space-y-2">
      {dates.filter((d) => d !== today).map((date) => {
        const rows = days.filter((d) => d.date === date)
        const isOpen = open === date
        return <div key={date} className="overflow-hidden rounded-card border border-layer-10">
          <button type="button" onClick={() => setOpen(isOpen ? null : date)} aria-expanded={isOpen} className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-layer-5">
            <Head date={date} rows={rows} today={today} />
            <ChevronDown size={16} aria-hidden="true" className={cn('shrink-0 text-navy-500 transition-transform duration-fast', isOpen && 'rotate-180')} />
          </button>
          {isOpen && <div className="border-t border-layer-5"><Body rows={rows} many={many} /></div>}
        </div>
      })}
    </div>
  </div>
}

function Head({ date, rows, big = false, today }: { date: string; rows: WeekDay[]; big?: boolean; today?: string }) {
  const items = rows.flatMap((r) => r.items)
  const done = items.filter((i) => i.done).length
  const rest = rows.every((r) => r.rest)
  const focus = rows.map((r) => r.focus).filter(Boolean).join('・')
  if (big) return <div className="flex items-end justify-between gap-3 px-4 pb-1 pt-4">
    <div>
      <p className="text-2xs font-bold text-gold-400"><Num>今日 {md(date)}（{wd(date)}）</Num></p>
      <p className="mt-1 text-xl font-bold text-white">{rest ? '休みの日' : focus || 'メニュー'}</p>
    </div>
    {!rest && items.length > 0 && <Num mono className="pb-1 text-sm text-navy-300">{done} / {items.length}</Num>}
  </div>
  return <span className="flex min-w-0 flex-1 items-center gap-3">
    <Num mono className="w-20 shrink-0 text-sm text-navy-300">{md(date)}（{wd(date)}）</Num>
    <span className="min-w-0 flex-1 text-2xs text-navy-500">{rest ? '休み' : today && date > today ? '明日' : ''}</span>
    {!rest && items.length > 0 && <Num mono className={cn('shrink-0 text-2xs', done === items.length ? 'text-emerald-400' : 'text-navy-400')}>{done} / {items.length}</Num>}
  </span>
}

function Body({ rows, many }: { rows: WeekDay[]; many: boolean }) {
  return <div className="space-y-4 px-4 py-4">
    {rows.map((r, i) => <div key={i} className="space-y-3">
      {(many || r.period) && <p className="text-2xs text-navy-400">{[many ? r.episodeLabel : null, r.period].filter(Boolean).join(' ・ ')}</p>}
      {r.rest ? <p className="text-sm text-navy-300">休みの日です。</p> : <DayMenu items={r.items} />}
    </div>)}
  </div>
}
