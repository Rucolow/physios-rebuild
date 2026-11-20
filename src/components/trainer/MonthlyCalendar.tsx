'use client'

import { useState } from 'react'
import { Card, Modal, Num, Pill } from '@/components/ui'
import { PHASE_BAND } from '@/lib/design/phaseBand'
import { SIGNAL } from '@/lib/design/signal'
import type { MonthlyCalendar as MonthlyCalendarData } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * 月間カレンダー（DESIGN_SYSTEM.md §5-7）。
 *
 * **セルの中に置いてよいのは日付数字・イベントドット・フェーズ帯の3種のみで、
 * 文字は日付数字だけである。** イベント名・選手名・フェーズ名・件数バッジ・「+N」表記・
 * アイコンをセル内に置くことを禁止する——詳細はセルのタップでボトムシートに出す。
 *
 * ゴールドは今日のセルの枠1箇所のみ（§1-5 現在地）。
 */
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export function MonthlyCalendar({ data }: { data: MonthlyCalendarData }) {
  const [openDate, setOpenDate] = useState<string | null>(null)
  // 帯は3本まで（§5-7）。**既定の3人は復帰見込みが近い順**で、
  // 4人以上いるときはトレーナーが「どの3人を見るか」を選べる
  const [selected, setSelected] = useState<string[]>(() => data.legend.slice(0, 3).map((l) => l.playerId))
  const legend = data.legend.filter((l) => selected.includes(l.playerId))
  const visibleIndexes = new Set(
    data.legend.map((l, i) => (selected.includes(l.playerId) ? i : -1)).filter((i) => i >= 0),
  )
  const details = openDate ? (data.details[openDate] ?? []) : []
  const toggle = (playerId: string) => setSelected((prev) =>
    prev.includes(playerId) ? prev.filter((id) => id !== playerId) : prev.length >= 3 ? prev : [...prev, playerId])

  return <div className="space-y-4">

    {/* 曜日ヘッダはグリッド外・テーブルヘッダ様式（§2-6 / §5-7） */}
    <Card className="overflow-hidden p-0">
      <div className="grid grid-cols-7 border-b border-layer-5">
        {WEEKDAYS.map((w) => <span key={w} className="px-2 py-2 text-center text-2xs font-bold uppercase tracking-wider text-navy-400">{w}</span>)}
      </div>
      <div className="grid grid-cols-7">
        {data.days.map((day) => <button
          key={day.date}
          type="button"
          onClick={() => setOpenDate(day.date)}
          aria-label={`${day.date} の予定`}
          className={cn(
            'flex h-16 flex-col items-center gap-1 border-b border-r border-layer-5 px-1 pt-1.5 text-left transition-colors duration-fast hover:bg-layer-5',
            // 今日のセルは枠。**この画面のゴールドはこの1箇所のみ**（§5-7）
            day.isToday && 'border border-gold-500',
          )}
        >
          <Num className={cn('text-2xs', day.inMonth ? 'text-navy-300' : 'text-navy-500')}>{day.day}</Num>

          {/* イベントドット: 試合=塗り / 練習=中抜き（形でも区別する・P6）。3個まで。
              **要確認は承認済みの予定が無くても印す**——新規追加や日付変更の下書きは
              まさに確認が要る変更であり、承認済みの行が無い日に印が出ないのは取り落としになる */}
          <span className="flex h-1.5 items-center gap-1">
            {day.needsReview && <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-pill', SIGNAL.watch.dot)} />}
            {day.events.slice(0, day.needsReview ? 2 : 3).map((event) => <span
              key={event.id}
              aria-hidden="true"
              className={cn('h-1.5 w-1.5 rounded-pill',
                event.kind === 'match' ? 'bg-navy-100' : 'border border-navy-500')}
            />)}
          </span>

          {/* フェーズ帯: 凡例の行位置に対応。3本まで */}
          <span className="mt-auto w-full space-y-0.5 pb-1">
            {day.bands.filter((b) => visibleIndexes.has(b.legendIndex)).slice(0, 3).map((band) => <span
              key={band.legendIndex}
              aria-hidden="true"
              className={cn('block h-1 rounded-pill', PHASE_BAND[band.level])}
            />)}
          </span>
        </button>)}
      </div>
    </Card>

    {/* 帯と選手の対応はセル内に書かず、グリッド外の凡例で示す（§5-7） */}
    {data.legend.length > 0 && <div className="space-y-2">
      <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">フェーズ帯</p>
      <div className="space-y-1.5">
        {legend.map((entry) => <p key={entry.playerId} className="flex items-center gap-2 text-2xs text-navy-300">
          <span aria-hidden="true" className={cn('h-1 w-8 shrink-0 rounded-pill', entry.level ? PHASE_BAND[entry.level] : 'bg-layer-10')} />
          {entry.playerName}{entry.phaseName ? ` ・ ${entry.phaseName}` : ''}
        </p>)}
      </div>
      {/* リハビリ中が4人以上のときだけ絞り込みを出す（§5-7）。
          **候補は全員**——既定の3人しか出さないと4人目以降を選べない */}
      {data.legend.length > 3 && <div className="flex flex-wrap items-center gap-2">
        {data.legend.map((entry) => <Pill
          key={entry.playerId}
          active={selected.includes(entry.playerId)}
          disabled={!selected.includes(entry.playerId) && selected.length >= 3}
          onClick={() => toggle(entry.playerId)}
        >{entry.playerName}</Pill>)}
        <span className="text-2xs text-navy-500">帯は<Num>3</Num>人まで</span>
      </div>}
    </div>}

    {/* 詳細はボトムシート（§4-10）。セルに書いて済ませることを禁止する（§5-7） */}
    <Modal
      open={openDate !== null}
      onOpenChange={(open) => { if (!open) setOpenDate(null) }}
      placement="sheet"
      width="detail"
      title={openDate ? <Num>{openDate}</Num> : ''}
    >
      {details.length === 0
        ? <p className="text-sm text-navy-400">予定はありません。</p>
        : <div className="space-y-3">
            {details.map((d, i) => <p key={i} className="flex items-baseline gap-3 text-sm">
              <Num mono className="w-11 shrink-0 text-navy-400">{d.time}</Num>
              <span className="min-w-0 flex-1 text-navy-100">
                {d.title}
                {d.detail && <span className="mt-0.5 block text-2xs text-navy-400">{d.detail}</span>}
              </span>
            </p>)}
          </div>}
    </Modal>

  </div>
}
