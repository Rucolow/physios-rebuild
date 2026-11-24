'use client'
import { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { VideoFrame } from './VideoFrame'
import type { PlayerDayItem } from '@/lib/playerDay'

const strip = (s: string) => s.replace(/^・/, '')

/** 行に出す用量（セット・回数・負荷）。改行を含む列は行に出さず、開いた中で読む */
function rowDose(it: PlayerDayItem) {
  return [it.sets, it.reps, it.load].filter((v): v is string => !!v && !v.includes('\n')).map(strip)
}

/**
 * その日のメニュー。選手の画面とトレーナーの選手詳細で同じものを出す。
 * 行を押すと、画面の中央に種目の詳細（動画・用量・開始姿勢・動作・ポイント）が開く。
 * onToggle を渡したときだけ実施を付け外しできる。checkable なら行の左の丸で直接付ける（選手の画面）。
 */
export function DayMenu({ items, onToggle, checkable = false }: { items: PlayerDayItem[]; onToggle?: (it: PlayerDayItem) => Promise<void> | void; checkable?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const open = items.find((i) => i.id === openId) ?? null

  const groups: { column: string; items: PlayerDayItem[] }[] = []
  for (const it of items) {
    const g = groups.at(-1)
    if (g && g.column === it.column) g.items.push(it)
    else groups.push({ column: it.column, items: [it] })
  }

  return <>
    <div className="space-y-4">
      {groups.map((g, gi) => <div key={`${g.column}-${gi}`} className="space-y-2">
        <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">{g.column}</p>
        <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
          {g.items.map((it) => <div key={it.id} className="flex items-center">
            {checkable && onToggle && <button
              type="button"
              role="checkbox"
              aria-checked={it.done}
              aria-label={`${it.name}を${it.done ? '未実施に戻す' : '実施した'}`}
              onClick={() => onToggle(it)}
              className="flex h-14 w-14 shrink-0 items-center justify-center"
            >
              <span className={cn('flex h-7 w-7 items-center justify-center rounded-pill border-2 transition-colors duration-fast', it.done ? 'border-emerald-400 bg-emerald-400 text-navy-900' : 'border-navy-500')}>
                {it.done && <Check size={16} strokeWidth={3} aria-hidden="true" />}
              </span>
            </button>}
            <button
              type="button"
              onClick={() => setOpenId(it.id)}
              className={cn('flex min-w-0 flex-1 items-center gap-3 text-left transition-colors duration-fast', checkable ? 'pr-4' : 'px-4', it.done ? 'py-2.5 hover:bg-layer-5' : 'py-3 hover:bg-layer-10')}
            >
              <span className="min-w-0 flex-1">
                <span className={cn('block text-sm', it.done ? 'text-navy-400' : 'font-bold text-white')}>{it.name}</span>
                <span className={cn('block text-2xs', it.done ? 'text-navy-500' : 'text-navy-400')}>
                  {rowDose(it).map((d, i) => <span key={i}>{i > 0 && ' ・ '}<Num mono>{d}</Num></span>)}
                </span>
              </span>
              {it.done && !checkable
                ? <span className="shrink-0 text-2xs font-bold text-navy-400">済</span>
                : <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-navy-500" />}
            </button>
          </div>)}
        </div>
      </div>)}
    </div>

    <Modal
      open={open !== null}
      onOpenChange={(v) => { if (!v) setOpenId(null) }}
      placement="center"
      width="read"
      busy={pending}
      busyLabel={open?.done ? '戻しています…' : '記録しています…'}
      title={open?.name ?? ''}
      footer={open && onToggle && !checkable ? <Button
        variant="secondary"
        disabled={pending}
        onClick={async () => {
          setPending(true)
          try { await onToggle(open) } finally { setPending(false) }
        }}
      >{open.done ? '未実施に戻す' : '実施した'}</Button> : undefined}
    >
      {open && <ExerciseDetail it={open} />}
    </Modal>
  </>
}

/** 原文の 1 行ごとの先頭の「・」と Markdown の記号（強調・記号だけの行・取り込み時に紛れた次の種目の見出し「## …」）・行末の空白を落として行に分ける（文言は変えない） */
function lines(s: string | null): string[] {
  if (!s) return []
  return s.split('\n').map((t) => t.replace(/\*\*/g, '').trim().replace(/^・\s*/, '').trim()).filter((t) => t && !t.startsWith('#') && !/^[*\-_\s]+$/.test(t))
}

/** 数字だけを大きく見せる。文言はそのまま */
function Figure({ text }: { text: string }) {
  const parts = text.split(/(\d+(?:[.〜~\-－]\d+)?)/)
  return <>{parts.map((p, i) => i % 2 === 1
    ? <Num key={i} className="text-xl font-bold text-white">{p}</Num>
    : p && <span key={i} className="text-sm text-navy-200">{p}</span>)}</>
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return <section className="space-y-2">
    <h3 className="text-2xs font-bold uppercase tracking-wider text-navy-400">{label}</h3>
    {children}
  </section>
}

function ExerciseDetail({ it }: { it: PlayerDayItem }) {
  const sets = lines(it.sets)[0]
  const reps = lines(it.reps)
  const [rest, ...restNotes] = lines(it.rest)
  const load = lines(it.load)
  const steps = lines(it.movement)
  const focus = it.focus.flatMap((f) => lines(f))
  const start = lines(it.startPosition)
  return <div className="space-y-5">
    <VideoFrame url={it.videoUrl} title={it.name} />

    {(sets || reps.length > 0 || rest) && <div className="space-y-1.5">
      {(sets || reps.length > 0) && <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {sets && <span><Figure text={sets} /></span>}
        {sets && reps.length > 0 && <span aria-hidden="true" className="text-sm text-navy-500">×</span>}
        {reps.length > 0 && <span><Figure text={reps[0]} /></span>}
      </p>}
      {reps.slice(1).map((r) => <p key={r} className="text-sm text-navy-200">{r}</p>)}
      {rest && <p className="text-sm text-navy-300">休憩 <Num className="text-navy-100">{rest}</Num></p>}
      {restNotes.map((n) => <p key={n} className="text-2xs text-navy-400">{n}</p>)}
    </div>}

    {load.length > 0 && <Section label="強度">
      <ul className="space-y-1">{load.map((l) => <li key={l} className="text-sm text-navy-100">{l}</li>)}</ul>
    </Section>}

    {start.length > 0 && <Section label="開始姿勢">
      <div className="space-y-1">{start.map((l) => <p key={l} className="text-sm text-navy-100">{l}</p>)}</div>
    </Section>}

    {steps.length > 0 && <Section label="動作">
      <ol className="space-y-2">{steps.map((l, i) => <li key={i} className="flex gap-3">
        <Num className="flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-layer-10 text-2xs font-bold text-gold-500">{i + 1}</Num>
        <span className="min-w-0 flex-1 text-sm text-navy-100">{l}</span>
      </li>)}</ol>
    </Section>}

    {focus.length > 0 && <Section label="ポイント">
      <ul className="space-y-2">{focus.map((l) => <li key={l} className="flex gap-3">
        <Check size={16} strokeWidth={2.5} aria-hidden="true" className="mt-0.5 shrink-0 text-gold-500" />
        <span className="min-w-0 flex-1 text-sm text-navy-100">{l}</span>
      </li>)}</ul>
    </Section>}
  </div>
}
