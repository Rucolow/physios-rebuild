'use client'
import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { DayMenu } from '@/components/menu/DayMenu'
import { Button } from '@/components/ui/Button'
import type { PlayerDay, PlayerDayItem } from '@/lib/playerDay'
import type { PlayerStage } from '@/lib/playerApp'

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

export function PlayerHome({ token, name, day, stage }: { token: string; name: string; day: PlayerDay; stage: PlayerStage }) {
  const [items, setItems] = useState(day.items ?? [])
  const done = items.filter((i) => i.done).length

  async function toggle(it: PlayerDayItem) {
    const next = !it.done
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: next } : x)))
    const res = await fetch(`/api/p/${token}/done`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: it.id, done: next }) }).catch(() => null)
    if (!res?.ok) setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: it.done } : x)))
  }

  return <div className="space-y-10 pt-6">
    <p className="text-sm font-bold text-white">こんにちは、{name}</p>
    {stage.episode && <section>
      <Ring percent={stage.ret?.percent ?? (stage.stage ? (stage.stage.index / stage.stage.total) * 100 : 0)}>
        {stage.ret
          ? stage.ret.days > 0
            ? <>
                <p className="text-2xs font-bold text-navy-400">チーム合流まで</p>
                <p className="mt-1 flex items-end gap-1"><Num mono className="text-4xl font-bold text-white">{stage.ret.days}</Num><span className="pb-1.5 text-base text-navy-400">日</span></p>
                <Num mono className="mt-1 text-2xs text-emerald-400">{stage.ret.percent}%</Num>
              </>
            : <p className="text-xl font-bold text-white">チームの練習に全て参加できます</p>
          : <>
              <p className="text-2xs font-bold text-navy-400">受傷から</p>
              <p className="mt-1 flex items-end gap-1"><Num mono className="text-4xl font-bold text-white">{stage.episode.week}</Num><span className="pb-1.5 text-base text-navy-400">週目</span></p>
            </>}
      </Ring>
      <p className="mt-4 text-center text-sm text-navy-300">{stage.episode.label}</p>
      {stage.stage && <div className="mt-6">
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: stage.stage.total }, (_, i) => <span key={i} className={cn('h-1.5 flex-1 rounded-pill', i + 1 < stage.stage!.index ? 'bg-emerald-400' : i + 1 === stage.stage!.index ? 'bg-gold-400' : 'bg-layer-10')} />)}
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <p className="text-base font-bold text-gold-400">{stage.stage.name}</p>
          <Num mono className="text-sm text-navy-400">{stage.stage.index} / {stage.stage.total}</Num>
        </div>
      </div>}
    </section>}

    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-2xs text-navy-400"><Num>{md(day.date)}</Num></p>
          <h2 className="text-xl font-bold text-white">{day.rest ? '休みの日' : day.focus ?? '今日のメニュー'}</h2>
        </div>
        {!day.rest && items.length > 0 && <Num mono className="pb-1 text-sm text-navy-300">{done} / {items.length}</Num>}
      </div>
      {day.rest
        ? <p className="text-sm text-navy-300">今日のメニューはありません。</p>
        : day.items === null || items.length === 0
          ? <p className="text-sm text-navy-400">{stage.episode ? '今日のメニューはまだありません。' : 'いま進めているリハビリはありません。'}</p>
          : <DayMenu items={items} onToggle={toggle} checkable />}
    </section>

    <Report token={token} initial={stage.condition} />
  </div>
}

const SCALE = [0, 1, 2, 3, 4, 5, 6]

/** 今日の報告。痛みと疲労を選び、ひとことを添えて送る */
function Report({ token, initial }: { token: string; initial: { pain: number | null; fatigue: number | null; comment: string | null } }) {
  const [pain, setPain] = useState(initial.pain)
  const [fatigue, setFatigue] = useState(initial.fatigue)
  const [comment, setComment] = useState(initial.comment ?? '')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(initial.pain !== null && initial.fatigue !== null ? 'sent' : 'idle')
  const dirty = () => state === 'sent' && setState('idle')
  async function send() {
    setState('sending')
    const res = await fetch(`/api/p/${token}/condition`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pain, fatigue, comment }) }).catch(() => null)
    setState(res?.ok ? 'sent' : 'error')
  }
  const Scale = ({ title, value, set, none, severe }: { title: string; value: number | null; set: (n: number) => void; none: string; severe: string }) => <div>
    <p className="mb-2 text-sm font-bold text-white">{title}</p>
    <div className="flex items-center justify-between gap-1" role="radiogroup" aria-label={title}>
      {SCALE.map((s) => <button key={s} type="button" role="radio" aria-checked={value === s} onClick={() => { set(s); dirty() }}
        className={cn('h-11 w-11 rounded-pill text-sm font-bold transition-colors duration-fast', value === s ? 'bg-gold-500 text-navy-900' : 'bg-layer-5 text-navy-300 hover:bg-layer-10 hover:text-white')}>
        <Num>{s}</Num>
      </button>)}
    </div>
    <div className="mt-1.5 flex justify-between"><span className="text-2xs text-navy-500">{none}</span><span className="text-2xs text-navy-500">{severe}</span></div>
  </div>
  return <section className="space-y-6 rounded-card border border-layer-10 bg-layer-5 px-4 py-5">
    <h2 className="text-xl font-bold text-white">今日の報告</h2>
    <Scale title="痛み" value={pain} set={setPain} none="痛みなし" severe="強い" />
    <Scale title="疲労" value={fatigue} set={setFatigue} none="疲れなし" severe="強い" />
    <div>
      <label htmlFor="report-comment" className="mb-2 block text-sm font-bold text-white">ひとこと</label>
      <textarea id="report-comment" value={comment} onChange={(e) => { setComment(e.target.value); dirty() }} rows={3}
        className="w-full rounded-field border border-layer-10 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-navy-500 focus:border-gold-500 focus:outline-none" placeholder="気になることがあれば" />
    </div>
    <Button variant="primary" block size="lg" disabled={pain === null || fatigue === null || state === 'sending' || state === 'sent'} onClick={send}>
      {state === 'sending' ? '送っています…' : state === 'sent' ? '送りました' : '送信する'}
    </Button>
    {state === 'error' && <p role="alert" className="text-sm text-red-400">送れませんでした。もう一度お試しください。</p>}
  </section>
}
