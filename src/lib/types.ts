import type { Signal } from '@/lib/design/signal'

/** 元の physios の lib/fixtures/types.ts から、移した画面が使う型だけを写したもの */

export type ScheduleSlotState = 'past' | 'next' | 'future'

export interface ScheduleEvent {
  id: string
  /** ISO 日付 */
  dateIso: string
  kind: 'match' | 'training' | 'off'
  date: string
  weekday: string
  time: string
  title: string
  detail?: string
  state: ScheduleSlotState
  /** 日程変更など、確認が要る予定 */
  tone?: Extract<Signal, 'watch'>
  toneLabel?: string
  /** 「今日」「明日」など、現在地であることのラベル */
  nowLabel?: string
  teamId: string
  score?: { for: number; against: number } | null
}

export interface CalendarDay {
  date: string
  day: number
  inMonth: boolean
  isToday: boolean
  events: { id: string; kind: 'match' | 'training' }[]
  needsReview: boolean
  bands: { legendIndex: number; level: 'first' | 'middle' | 'last' }[]
}

export interface CalendarLegendEntry {
  playerId: string
  playerName: string
  phaseName: string | null
  level: 'first' | 'middle' | 'last' | null
}

export interface MonthlyCalendar {
  year: number
  month: number
  days: CalendarDay[]
  legend: CalendarLegendEntry[]
  details: Record<string, { time: string; title: string; detail?: string }[]>
}
