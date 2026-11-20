'use client'

import { useEffect, useState } from 'react'
import { Num } from '@/components/ui/Num'
import { chatDateLabel, chatListLabel, chatTime, sameChatDay } from '@/lib/format/chatTime'

/**
 * 閲覧者のローカルタイムゾーンで時刻を出す最小の共通部品。
 *
 * サーバの `getHours()` は実行環境の TZ（Vercel = UTC）で丸まり、CEST の
 * トレーナーにずれて見える（PR#91 Codex P1）。SSR とのハイドレーション不一致を
 * 避けるため、マウント後に埋める——サーバ出力は空で、値の**推定はしない**（§5-3）。
 */
export function LocalTime({ iso, variant = 'time' }: { iso: string; variant?: 'time' | 'list' }) {
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    setLabel(variant === 'time' ? chatTime(iso) : chatListLabel(iso))
  }, [iso, variant])
  return <Num>{label ?? ''}</Num>
}

/**
 * 日付区切り。前のメッセージとローカル日が変わるときだけ「M/D (曜)」を出す。
 * 日の境界も閲覧者の TZ で決まるため、判定ごとクライアントで行う。
 */
export function LocalDayLabel({ iso, prevIso, className }: { iso: string; prevIso?: string; className?: string }) {
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    setLabel(!prevIso || !sameChatDay(prevIso, iso) ? chatDateLabel(iso) : null)
  }, [iso, prevIso])
  if (!label) return null
  return <p className={className}><Num>{label}</Num></p>
}

/**
 * 日付（`M/D`）と時刻（`HH:MM`）を**同じ枠**で出す（§5-17 のカルテ行）。
 *
 * サーバでは ISO の値をそのまま（＝UTC）描き、マウント後に閲覧者の TZ に差し替える。
 * **日付だけをサーバで描き、時刻だけをローカルにすると、深夜の記録で 1 日ずれる**
 * ——`LocalTime` と同じ問題（PR#91 Codex P1）の、枠が 2 つある版である。
 * 両方が同じ時点で差し替わるので、画面の中で日付と時刻が食い違わない。
 *
 * 暦日だけの値（`YYYY-MM-DD`）はタイムゾーンを持たない。**変換しない**——
 * `entered_on` に時刻は書かれておらず、00:00 を補うのは時刻の発明である（§5-3）。
 */
export function LocalStamp({ iso, part, mono = true }: { iso: string; part: 'date' | 'time'
  /** 等幅で出すか。**旧アプリ準拠ページは Inter**（旧で mono だったのは URL だけ・P1-17） */
  mono?: boolean }) {
  const dateOnly = iso.length === 10
  const fallback = part === 'date'
    ? `${Number(iso.slice(5, 7))}/${Number(iso.slice(8, 10))}`
    : (dateOnly ? '' : iso.slice(11, 16))
  const [label, setLabel] = useState(fallback)
  useEffect(() => {
    if (dateOnly) return                              // 暦日は変換しない
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return
    const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n))
    setLabel(part === 'date'
      ? `${d.getMonth() + 1}/${d.getDate()}`
      : `${pad2(d.getHours())}:${pad2(d.getMinutes())}`)
  }, [iso, part, dateOnly])
  if (label === '') return null
  return <Num mono={mono}>{label}</Num>
}

/**
 * 年見出し（§5-17 のカルテ。`w-16` の日付列に `YYYY/M/D` は収まらない）。
 *
 * **年も閲覧者の TZ で決める**（PR#134 Codex P2）。日付を `LocalStamp` がローカルに
 * 差し替える一方で、見出しだけ ISO（＝UTC）の 4 桁とサーバの現在年で組むと、年末年始の
 * 記録で**日付と見出しが食い違う**——`2026-01-01T00:30Z` は西側の TZ で `12/31` と出るのに
 * 2026 に束ねられる。判定ごと `LocalStamp` と同じ時点（マウント後）で行い、**サーバでは
 * 描かない**（`LocalDayLabel` と同じ作り。推定した年を一瞬出さない・§5-3）。
 *
 * 暦日だけの値（`YYYY-MM-DD`）は TZ を持たないので変換しない（`LocalStamp` と同じ）。
 *
 * `prevIso` は 1 つ前の行。無い＝先頭の行で、そのときは**閲覧者の今年**と比べる
 * （今年なら見出しを出さない）。
 */
export function LocalYearHeading(
  { iso, prevIso, className }: { iso: string; prevIso?: string; className?: string },
) {
  const [year, setYear] = useState<string | null>(null)
  useEffect(() => {
    const y = localYear(iso)
    const base = prevIso !== undefined ? localYear(prevIso) : String(new Date().getFullYear())
    setYear(y !== base ? y : null)
  }, [iso, prevIso])
  if (year === null) return null
  return <p className={className}><Num mono>{year}</Num></p>
}

/** 閲覧者の TZ での年。暦日（`YYYY-MM-DD`）は変換しない。読めない値は原文の 4 桁 */
function localYear(iso: string): string {
  if (iso.length === 10) return iso.slice(0, 4)
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso.slice(0, 4) : String(d.getFullYear())
}
