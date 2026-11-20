'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { DayMenu } from '@/components/menu/DayMenu'
import { ConditionScale } from './ConditionScale'
import type { PlayerDay, PlayerDayItem } from '@/lib/playerDay'
import type { PlayerStage } from '@/lib/playerApp'

function shift(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}
const WD = ['日', '月', '火', '水', '木', '金', '土']
const md = (iso: string) => `${Number(iso.slice(5, 7))}/${Number(iso.slice(8))}（${WD[new Date(`${iso}T00:00:00Z`).getUTCDay()]}）`

const R = 54
const C = 2 * Math.PI * R
function Ring({ percent, children }: { percent: number; children: React.ReactNode }) {
  return <div className="relative mx-auto h-60 w-60">
    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
      <circle cx="60" cy="60" r={R} fill="none" strokeWidth="4" className="stroke-layer-10" />
      <circle cx="60" cy="60" r={R} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(100, Math.max(0, percent)) / 100)} className="stroke-emerald-400" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">{children}</div>
  </div>
}

export function PlayerHome({ token, day, stage }: { token: string; day: PlayerDay; stage: PlayerStage }) {
  const [items, setItems] = useState(day.items ?? [])
  const done = items.filter((i) => i.done).length
  const editable = day.date === day.today

  async function toggle(it: PlayerDayItem) {
    const next = !it.done
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: next } : x)))
    const res = await fetch(`/api/p/${token}/done`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: it.id, done: next }) }).catch(() => null)
    if (!res?.ok) setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: it.done } : x)))
  }

  const rel = day.date === day.today ? '今日' : day.date === shift(day.today, 1) ? '明日' : day.date === shift(day.today, -1) ? '昨日' : null

  return <div className="space-y-8">
    {stage.episode && <section className="pt-4">
      <Ring percent={stage.ret?.percent ?? (stage.stage ? (stage.stage.index / stage.stage.total) * 100 : 0)}>
        {stage.ret
          ? stage.ret.days > 0
            ? <>
                <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">復帰まで</p>
                <p className="mt-1 flex items-end gap-1"><Num mono className="text-4xl font-bold text-white">{stage.ret.days}</Num><span className="pb-1.5 text-base text-navy-400">日</span></p>
                <Num mono className="mt-1 text-2xs text-emerald-400">{stage.ret.percent}% 完了</Num>
              </>
            : <p className="text-xl font-bold text-white">{stage.ret.days === 0 ? '今日が復帰見込みの日です' : '復帰見込みの日を過ぎました'}</p>
          : <>
              <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">受傷から</p>
              <p className="mt-1 flex items-end gap-1"><Num mono className="text-4xl font-bold text-white">{stage.episode.week}</Num><span className="pb-1.5 text-base text-navy-400">週目</span></p>
            </>}
      </Ring>
      <p className="mt-4 text-center text-sm text-navy-300">{stage.episode.label} ・ <Num>{stage.episode.week}</Num> 週目</p>
    </section>}
    {!stage.episode && <p className="pt-6 text-sm text-navy-300">いま進めているリハビリはありません。</p>}

    {stage.stage && <section>
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-bold text-white">段階</h2>
        <Num mono className="text-sm text-navy-400">{stage.stage.index} / {stage.stage.total}</Num>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: stage.stage.total }, (_, i) => <span key={i} className={cn('h-1.5 flex-1 rounded-pill', i + 1 < stage.stage!.index ? 'bg-emerald-400' : i + 1 === stage.stage!.index ? 'bg-gold-400' : 'bg-layer-10')} />)}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-lg font-bold text-gold-400">{stage.stage.name}</p>
        {stage.stage.next && <p className="shrink-0 text-sm text-navy-400">次: {stage.stage.next}</p>}
      </div>
    </section>}

    <section className="space-y-3">
      <nav aria-label="日付" className="flex items-center justify-between">
        <Link href={`/p/${token}?d=${shift(day.date, -1)}`} aria-label="前の日" className="inline-flex h-10 w-10 items-center justify-center rounded-field text-navy-300 hover:bg-layer-10 hover:text-white"><ChevronLeft size={20} aria-hidden="true" /></Link>
        <p className="text-sm font-bold text-white"><Num mono>{md(day.date)}</Num></p>
        {day.canMoveForward
          ? <Link href={`/p/${token}?d=${shift(day.date, 1)}`} aria-label="次の日" className="inline-flex h-10 w-10 items-center justify-center rounded-field text-navy-300 hover:bg-layer-10 hover:text-white"><ChevronRight size={20} aria-hidden="true" /></Link>
          : <span className="h-10 w-10" aria-hidden="true" />}
      </nav>
      {day.rest
        ? <div className="glass rounded-card border border-layer-10 px-5 py-6"><p className="text-base font-bold text-white">休みの日です</p><p className="mt-1 text-sm text-navy-300">この日のメニューはありません。</p></div>
        : day.items === null
          ? <p className="text-sm text-navy-400">この日のメニューはまだありません。</p>
          : <>
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xs font-bold uppercase tracking-wider text-navy-400">{rel ?? ''}のメニュー</h2>
                <Num mono className="text-sm text-navy-400">{done} / {items.length} 完了</Num>
              </div>
              <DayMenu items={items} onToggle={editable ? toggle : undefined} />
            </>}
    </section>

    {day.date === day.today && stage.episode && <section className="space-y-6">
      <ConditionScale token={token} kind="pain" value={stage.condition.pain} title="今日の痛み" none="痛みなし" severe="強い" />
      <ConditionScale token={token} kind="fatigue" value={stage.condition.fatigue} title="今日の疲労" none="疲労なし" severe="強い" />
    </section>}
  </div>
}
