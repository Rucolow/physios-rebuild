'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import type { PlayerDay, PlayerDayItem } from '@/lib/playerDay'

function shift(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

const WD = ['日', '月', '火', '水', '木', '金', '土']
function label(iso: string, today: string) {
  const d = new Date(`${iso}T00:00:00Z`)
  const md = `${d.getUTCMonth() + 1}/${d.getUTCDate()}（${WD[d.getUTCDay()]}）`
  if (iso === today) return { rel: '今日', md }
  if (iso === shift(today, 1)) return { rel: '明日', md }
  if (iso === shift(today, -1)) return { rel: '昨日', md }
  return { rel: null, md }
}

/**
 * 選手の画面（390px 設計・1 カラム）。
 * ストア版で Capacitor に包む前提なので、Service Worker・ホーム画面への追加・Web Push を持たない。
 */
export function PlayerHome({ token, givenName, day }: { token: string; givenName: string; day: PlayerDay }) {
  const [items, setItems] = useState(day.items ?? [])
  const done = items.filter((i) => i.done).length
  const editable = day.date === day.today
  const l = label(day.date, day.today)

  async function toggle(it: PlayerDayItem) {
    const next = !it.done
    setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: next } : x)))
    const res = await fetch(`/api/p/${token}/done`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: it.id, done: next }),
    })
    if (!res.ok) setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, done: it.done } : x)))
  }

  const groups: { column: string; items: PlayerDayItem[] }[] = []
  for (const it of items) {
    const g = groups.at(-1)
    if (g && g.column === it.column) g.items.push(it)
    else groups.push({ column: it.column, items: [it] })
  }

  return (
    <div lang="ja" className="min-h-screen shell-bg text-navy-100">
      <main className="mx-auto max-w-form px-4 pb-safe pt-safe">
        <header className="pt-6">
          <p className="text-2xs font-bold uppercase tracking-wider text-navy-200">PHYSIOS</p>
          <h1 className="mt-1 text-3xl font-bold text-white">こんにちは、{givenName}</h1>
          {day.episode ? (
            <p className="mt-2 text-sm text-navy-300">
              {day.episode.label}・<Num>{day.episode.week}</Num> 週目
              {day.episode.period ? `・${day.episode.period}` : ''}
            </p>
          ) : (
            <p className="mt-2 text-sm text-navy-300">いま進めているリハビリはありません。</p>
          )}
        </header>

        <nav aria-label="日付" className="mt-6 flex items-center justify-between rounded-field border border-layer-10 bg-layer-5 px-2 py-1">
          <Link
            href={`/p/${token}?d=${shift(day.date, -1)}`}
            aria-label="前の日"
            className="inline-flex h-10 w-10 items-center justify-center rounded-field text-navy-300 transition-colors duration-fast hover:bg-layer-10 hover:text-white"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </Link>
          <p className="text-sm font-bold text-white">
            {l.rel && <span className={cn('mr-2', day.date === day.today ? 'text-gold-400' : 'text-navy-300')}>{l.rel}</span>}
            <Num>{l.md}</Num>
          </p>
          {day.canMoveForward ? (
            <Link
              href={`/p/${token}?d=${shift(day.date, 1)}`}
              aria-label="次の日"
              className="inline-flex h-10 w-10 items-center justify-center rounded-field text-navy-300 transition-colors duration-fast hover:bg-layer-10 hover:text-white"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </Link>
          ) : (
            <span className="h-10 w-10" aria-hidden="true" />
          )}
        </nav>

        <section className="mt-6 space-y-4 pb-10">
          {day.items === null ? (
            <p className="text-sm text-navy-400">{day.rest ? '' : 'この日のメニューはまだありません。'}</p>
          ) : day.rest ? (
            <div className="glass rounded-card border border-layer-10 px-5 py-6">
              <p className="text-base font-bold text-white">休みの日です</p>
              <p className="mt-1 text-sm text-navy-300">この日のメニューはありません。</p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between">
                <h2 className="text-base font-bold text-white">{l.rel ?? ''}のメニュー</h2>
                <p className="text-2xs text-navy-400">
                  <Num className="text-xl font-bold text-white">{done}</Num>
                  <span className="mx-1">/</span>
                  <Num>{items.length}</Num> 種目
                </p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-pill bg-layer-10">
                <div className="h-full bg-emerald-400 transition-[width] duration-base" style={{ width: `${items.length ? (done / items.length) * 100 : 0}%` }} />
              </div>
              {groups.map((g) => (
                <div key={g.column} className="space-y-2">
                  <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">{g.column}</p>
                  <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
                    {g.items.map((it) => (
                      <ItemRow key={it.id} it={it} editable={editable} onToggle={() => toggle(it)} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </section>
      </main>
    </div>
  )
}

function ItemRow({ it, editable, onToggle }: { it: PlayerDayItem; editable: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false)
  const dose = [it.sets, it.reps, it.rest && `休憩 ${it.rest.replace(/^・/, '')}`, it.load].filter(Boolean).join('  ')
  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={it.done}
          aria-label={`${it.name}を${it.done ? '未実施に戻す' : '実施した'}`}
          disabled={!editable}
          onClick={onToggle}
          className={cn(
            'mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border transition-colors duration-fast',
            it.done ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400' : 'border-layer-10 bg-layer-5 text-transparent hover:bg-layer-10',
            !editable && 'opacity-50',
          )}
        >
          <Check size={16} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="min-w-0 flex-1 text-left">
          <p className={cn('text-sm font-bold', it.done ? 'text-navy-400' : 'text-white')}>{it.name}</p>
          <p className="mt-0.5 text-2xs text-navy-400 nums">{dose || it.category}</p>
        </button>
        <ChevronDown size={16} className={cn('mt-1 shrink-0 text-navy-500 transition-transform duration-fast', open && 'rotate-180')} aria-hidden="true" />
      </div>
      {open && (
        <div className="mt-3 space-y-2 pl-11 text-sm text-navy-200">
          {it.startPosition && <p className="text-2xs text-navy-400">開始姿勢：{it.startPosition}</p>}
          {it.movement && <p className="whitespace-pre-line">{it.movement}</p>}
          {it.focus.length > 0 && <p className="whitespace-pre-line text-navy-300">{it.focus.join('\n')}</p>}
          {it.videoUrl && (
            <a href={it.videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-2xs font-bold text-gold-400 hover:text-gold-300">
              動画を見る <ExternalLink size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
