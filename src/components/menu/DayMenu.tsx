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
      footer={open && onToggle ? <Button
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

function ExerciseDetail({ it }: { it: PlayerDayItem }) {
  const dose: [string, string | null][] = [['セット', it.sets], ['回数', it.reps], ['負荷', it.load], ['休憩', it.rest]]
  const shown = dose.filter(([, v]) => v)
  return <div className="space-y-4">
    <VideoFrame url={it.videoUrl} title={it.name} />
    {shown.length === 0
      ? <p className="text-sm text-navy-400">用量の記載はありません。</p>
      : <dl className="space-y-2">
          {shown.map(([k, v]) => <div key={k} className="flex gap-3">
            <dt className="w-12 shrink-0 pt-0.5 text-2xs text-navy-400">{k}</dt>
            <dd className="min-w-0 flex-1 whitespace-pre-line text-sm text-navy-100"><Num>{strip(v!)}</Num></dd>
          </div>)}
        </dl>}
    {it.startPosition && <Block label="開始姿勢" text={it.startPosition} />}
    {it.movement && <Block label="動作" text={it.movement} />}
    {it.focus.length > 0 && <div>
      <p className="text-2xs text-navy-400">ポイント</p>
      <ul className="mt-1 space-y-1">{it.focus.map((f) => <li key={f} className="text-sm text-navy-100">{f}</li>)}</ul>
    </div>}
  </div>
}

function Block({ label, text }: { label: string; text: string }) {
  return <div>
    <p className="text-2xs text-navy-400">{label}</p>
    <p className="mt-1 whitespace-pre-line text-sm text-navy-100">{text}</p>
  </div>
}
