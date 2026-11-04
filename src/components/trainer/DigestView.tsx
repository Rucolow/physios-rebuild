'use client'
import { useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Num } from '@/components/ui/Num'
import { StateWord } from '@/components/ui/StateWord'
import { confirmAction } from '@/app/(trainer)/digest/actions'
import type { InterpretedSegment } from '@/lib/llm/interpret'
import type { DraftAnswer } from '@/lib/confirm'

export interface DigestItem {
  id: string
  kind: 'karte' | 'injury' | 'menu_row' | 'schedule'
  status: 'pending' | 'confirmed' | 'rejected'
  carried: boolean
  localDate: string
  time: string
  playerId: string | null
  playerName: string | null
  reason: 'player' | 'protocol' | 'menu_row' | 'schedule' | null
  seg: InterpretedSegment
  audioUrl: string | null
  answer: DraftAnswer | null
}

export interface DigestContext {
  today: string
  timeZone: string
  players: { id: string; name: string }[]
  protocols: { id: string; title: string }[]
  rows: Record<string, { id: string; row_index: number; week_hint: number | null; period_raw: string }[]>
  episodes: Record<string, { protocolId: string | null; label: string; week: number; currentRowId: string | null }>
}

interface Props {
  dateLabel: { full: string; wd: string }
  pending: DigestItem[]
  resolved: DigestItem[]
  failed: { id: string; time: string; audioUrl: string | null }[]
  ctx: DigestContext
  /** 見本の表示。確定を押しても書かない */
  preview?: boolean
}

/** 答えの初期値。AI が言葉から読んだもの（話した時期・一人に決まった選手）だけを入れる */
function initialAnswer(it: DigestItem, ctx: DigestContext): DraftAnswer {
  const a: DraftAnswer = { action: 'confirm' }
  if (it.kind === 'menu_row' && it.playerId && it.seg.menu_row_index != null) {
    const ep = ctx.episodes[it.playerId]
    const row = ep?.protocolId ? ctx.rows[ep.protocolId]?.find((r) => r.row_index === it.seg.menu_row_index) : undefined
    if (row) a.menu_row_id = row.id
  }
  if (it.kind === 'injury') {
    if (it.seg.protocol_candidates.length === 1) a.protocol_id = it.seg.protocol_candidates[0]
    a.injured_on = it.seg.injured_on ?? it.localDate
  }
  return a
}

function unanswered(it: DigestItem, a: DraftAnswer): boolean {
  if (a.action === 'reject') return false
  if (!it.playerId && !a.player_id && it.kind !== 'schedule') return true
  if (it.kind === 'injury') return !a.protocol_id || !a.menu_row_id
  if (it.kind === 'menu_row') return !a.menu_row_id
  if (it.kind === 'schedule') return !a.accept_schedule
  return false
}

export function DigestView({ dateLabel, pending, resolved, failed, ctx, preview }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, DraftAnswer>>(() =>
    Object.fromEntries(pending.map((it) => [it.id, initialAnswer(it, ctx)])),
  )
  const [result, setResult] = useState<string | null>(null)
  const [busy, start] = useTransition()

  const set = (id: string, patch: Partial<DraftAnswer>) =>
    setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  const needs = pending.filter((it) => it.reason !== null)
  const open = pending.filter((it) => unanswered(it, answers[it.id]))
  const carried = pending.filter((it) => it.carried).length

  function confirm() {
    setResult(null)
    if (preview) {
      setResult('見本の画面なので記録はしません。')
      return
    }
    start(async () => {
      const r = await confirmAction(answers)
      if (r.ok) {
        setResult(
          `${r.confirmed} 件を記録しました。` +
            (r.prescriptions ? `明日のメニューを ${r.prescriptions} 人分組みました。` : ''),
        )
        router.refresh()
      } else setResult(r.message)
    })
  }

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-read space-y-6 pb-24">
        <section>
          <p className="text-2xs font-bold uppercase tracking-wider text-navy-400">
            <Num>{dateLabel.full}</Num> {dateLabel.wd}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-white">今日を振り返る</h1>
          <p className="mt-2 text-sm text-navy-300">
            {pending.length === 0 ? (
              resolved.length ? '今日の記録は確定しました。' : 'まだ今日の記録はありません。'
            ) : (
              <>
                下書き <Num>{pending.length}</Num> 件。読んで、
                {needs.length ? (
                  <>
                    <Num>{needs.length}</Num> 箇所だけ確認してください。
                  </>
                ) : (
                  'よければ記録してください。'
                )}
              </>
            )}
          </p>
        </section>

        {carried > 0 && (
          <div className="flex w-full items-center gap-3 rounded-field border border-gold-500/30 bg-gold-500/10 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">前の日の下書きが残っています</p>
              <p className="text-2xs text-navy-300">
                <Num>{carried}</Num> 件。今日の分と一緒に記録できます。
              </p>
            </div>
          </div>
        )}

        {pending.length > 0 && (
          <section className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
            {pending.map((it) => (
              <Row key={it.id} it={it} a={answers[it.id]} ctx={ctx} onChange={(p) => set(it.id, p)} />
            ))}
          </section>
        )}

        {failed.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">処理できなかった録音</h2>
            <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
              {failed.map((m) => (
                <div key={m.id} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-11 shrink-0 font-mono text-sm text-navy-400 nums">{m.time}</span>
                  <p className="min-w-0 flex-1 text-sm text-navy-200">文字起こしか解釈に失敗しました。</p>
                  {m.audioUrl && <AudioButton url={m.audioUrl} start={0} />}
                </div>
              ))}
            </div>
          </section>
        )}

        {resolved.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">記録済み</h2>
            <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
              {resolved.map((it) => (
                <div key={it.id} className="flex items-start gap-4 px-5 py-4">
                  <span className="w-11 shrink-0 pt-0.5 font-mono text-sm text-navy-500 nums">{it.time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-navy-400">{it.playerName ?? '日程'}</p>
                    <p className="mt-1 text-sm text-navy-500">{it.answer?.summary ?? it.seg.summary}</p>
                  </div>
                  <StateWord tone="none">{it.status === 'confirmed' ? '確定済み' : '記録しない'}</StateWord>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-center text-2xs text-navy-500">記録したカルテは選手の画面で読めます。</p>
      </div>

      {pending.length > 0 && (
        <div className="fixed inset-x-0 bottom-above-nav z-header border-t border-layer-5 glass px-4 py-3">
          <div className="mx-auto flex max-w-read items-center gap-4">
            <p className="min-w-0 flex-1 text-2xs text-navy-400" role="status">
              {result ?? (
                <>
                  <Num>{pending.length}</Num> 件の記録・
                  {open.length ? (
                    <>
                      あと <Num>{open.length}</Num> 件に答えてください
                    </>
                  ) : (
                    <>
                      要確認 <Num>{needs.length}</Num> 件は回答済み
                    </>
                  )}
                </>
              )}
            </p>
            <Button variant="primary" size="md" disabled={busy || open.length > 0} onClick={confirm}>
              {busy ? '記録しています' : '今日を記録する'}
            </Button>
          </div>
        </div>
      )}
    </main>
  )
}

function Row({ it, a, ctx, onChange }: { it: DigestItem; a: DraftAnswer; ctx: DigestContext; onChange: (p: Partial<DraftAnswer>) => void }) {
  const playerId = a.player_id ?? it.playerId
  const playerName = playerId ? ctx.players.find((p) => p.id === playerId)?.name ?? null : null
  const rejected = a.action === 'reject'
  const isOpen = unanswered(it, a)

  const title =
    it.kind === 'schedule'
      ? '試合の日程の変更'
      : it.kind === 'injury'
        ? `${playerName ?? '選手'} の新しい怪我`
        : it.kind === 'menu_row'
          ? `${playerName ?? '選手'} のメニューの時期`
          : playerName ?? 'どの選手ですか'

  return (
    <div className={cn('flex items-start gap-4 px-5 py-4', rejected && 'bg-layer-3')}>
      <span className={cn('w-11 shrink-0 pt-0.5 font-mono text-sm nums', rejected ? 'text-navy-500' : 'text-navy-400')}>{it.time}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <p className={cn('min-w-0 flex-1 text-sm', rejected ? 'text-navy-400' : 'font-bold text-white')}>{title}</p>
          {rejected ? (
            <StateWord tone="none">記録しない</StateWord>
          ) : it.reason ? (
            <StateWord tone={isOpen ? 'watch' : 'none'}>{isOpen ? '要確認' : '回答済み'}</StateWord>
          ) : null}
        </div>
        <p className={cn('mt-1 text-sm', rejected ? 'text-navy-500' : 'text-navy-200')}>{it.seg.summary}</p>
        {it.seg.alert && !rejected && (
          <p className="mt-2 flex items-start gap-2 text-sm text-navy-200">
            <StateWord tone="act" className="pt-0.5">注意</StateWord>
            {it.seg.alert}
          </p>
        )}

        {!rejected && (
          <div className="mt-3 space-y-3">
            {!it.playerId && it.kind !== 'schedule' && (
              <PlayerChoice it={it} a={a} ctx={ctx} onChange={onChange} />
            )}
            {it.kind === 'menu_row' && playerId && <RowChoice playerId={playerId} a={a} ctx={ctx} onChange={onChange} />}
            {it.kind === 'injury' && <InjuryChoice it={it} a={a} ctx={ctx} onChange={onChange} />}
            {it.kind === 'schedule' && it.seg.kickoff_at && (
              <div className="space-y-2">
                <p className="text-sm text-navy-200">
                  新しい日時 <Num className="font-bold text-white">{formatKickoff(it.seg.kickoff_at, ctx.timeZone)}</Num>
                  {it.seg.schedule_note ? `・${it.seg.schedule_note}` : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Choice selected={!!a.accept_schedule} onClick={() => onChange({ accept_schedule: true })}>この日時にする</Choice>
                  <Choice selected={false} onClick={() => onChange({ action: 'reject' })}>変えない</Choice>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {it.audioUrl && <AudioButton url={it.audioUrl} start={it.seg.start_sec ?? 0} />}
          {rejected ? (
            <Button variant="ghost" size="sm" onClick={() => onChange({ action: 'confirm' })}>記録に戻す</Button>
          ) : it.kind === 'schedule' ? null : (
            <Button variant="ghost" size="sm" onClick={() => onChange({ action: 'reject' })}>記録しない</Button>
          )}
        </div>
      </div>
    </div>
  )
}

function formatKickoff(iso: string, timeZone: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('ja-JP', { timeZone, month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(d)
}

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-8 items-center gap-1.5 rounded-pill border px-3 py-1 text-left text-2xs font-bold transition-colors duration-fast',
        selected ? 'border-layer-10 bg-layer-20 text-white' : 'border-layer-10 bg-layer-5 text-navy-300 hover:bg-layer-10 hover:text-white',
      )}
    >
      {selected && <Check size={14} aria-hidden="true" />}
      {children}
    </button>
  )
}

function PlayerChoice({ it, a, ctx, onChange }: { it: DigestItem; a: DraftAnswer; ctx: DigestContext; onChange: (p: Partial<DraftAnswer>) => void }) {
  const candidates = it.seg.candidates.length ? it.seg.candidates : []
  const others = ctx.players.filter((p) => !candidates.includes(p.id))
  return (
    <div className="space-y-2">
      <p className="text-2xs font-medium text-navy-300">どの選手の話ですか{it.seg.player_basis ? `（${it.seg.player_basis}）` : ''}</p>
      <div className="flex flex-wrap gap-2">
        {candidates.map((id) => (
          <Choice key={id} selected={a.player_id === id} onClick={() => onChange({ player_id: id })}>
            {ctx.players.find((p) => p.id === id)?.name ?? '—'}
          </Choice>
        ))}
        {others.length > 0 && (
          <select
            aria-label="ほかの選手"
            value={a.player_id && !candidates.includes(a.player_id) ? a.player_id : ''}
            onChange={(e) => onChange({ player_id: e.target.value || undefined })}
            className="h-8 rounded-pill border border-layer-10 bg-layer-5 px-3 text-2xs font-bold text-navy-300"
          >
            <option value="">ほかの選手</option>
            {others.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

function RowList({ protocolId, a, ctx, currentRowId, onChange }: { protocolId: string; a: DraftAnswer; ctx: DigestContext; currentRowId: string | null; onChange: (p: Partial<DraftAnswer>) => void }) {
  const rows = ctx.rows[protocolId] ?? []
  return (
    <div className="flex flex-wrap gap-2">
      {rows.map((r) => (
        <Choice key={r.id} selected={a.menu_row_id === r.id} onClick={() => onChange({ menu_row_id: r.id })}>
          <span>{r.period_raw}</span>
          {r.id === currentRowId && <span className="font-normal text-navy-400">いま</span>}
        </Choice>
      ))}
    </div>
  )
}

function RowChoice({ playerId, a, ctx, onChange }: { playerId: string; a: DraftAnswer; ctx: DigestContext; onChange: (p: Partial<DraftAnswer>) => void }) {
  const ep = ctx.episodes[playerId]
  if (!ep?.protocolId) return <p className="text-sm text-navy-400">この選手には進行中の怪我がありません。記録しないを選んでください。</p>
  return (
    <div className="space-y-2">
      <p className="text-2xs font-medium text-navy-300">
        {ep.label}・受傷から <Num>{ep.week}</Num> 週目。明日からの時期を選んでください。
      </p>
      <RowList protocolId={ep.protocolId} a={a} ctx={ctx} currentRowId={ep.currentRowId} onChange={onChange} />
    </div>
  )
}

function InjuryChoice({ it, a, ctx, onChange }: { it: DigestItem; a: DraftAnswer; ctx: DigestContext; onChange: (p: Partial<DraftAnswer>) => void }) {
  const cands = it.seg.protocol_candidates
  const list = cands.length ? ctx.protocols.filter((p) => cands.includes(p.id)) : []
  const others = ctx.protocols.filter((p) => !cands.includes(p.id))
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="text-2xs font-medium text-navy-300">プロトコル</p>
        <div className="flex flex-wrap gap-2">
          {list.map((p) => (
            <Choice key={p.id} selected={a.protocol_id === p.id} onClick={() => onChange({ protocol_id: p.id, menu_row_id: undefined })}>
              {p.title}
            </Choice>
          ))}
          <select
            aria-label="ほかのプロトコル"
            value={a.protocol_id && !cands.includes(a.protocol_id) ? a.protocol_id : ''}
            onChange={(e) => onChange({ protocol_id: e.target.value || undefined, menu_row_id: undefined })}
            className="h-8 max-w-full rounded-pill border border-layer-10 bg-layer-5 px-3 text-2xs font-bold text-navy-300"
          >
            <option value="">ほかのプロトコル</option>
            {others.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>
      <label className="flex flex-col items-start gap-2">
        <span className="text-2xs font-medium text-navy-300">受傷日</span>
        <input
          type="date"
          value={a.injured_on ?? ''}
          max={ctx.today}
          onChange={(e) => onChange({ injured_on: e.target.value })}
          className="h-8 rounded-field border border-layer-10 bg-layer-5 px-3 text-2xs text-white nums"
        />
      </label>
      {a.protocol_id && (
        <div className="space-y-2">
          <p className="text-2xs font-medium text-navy-300">明日からの時期</p>
          <RowList protocolId={a.protocol_id} a={a} ctx={ctx} currentRowId={null} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

function AudioButton({ url, start }: { url: string; start: number }) {
  const ref = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const label = useMemo(() => `${Math.floor(start / 60)}:${String(Math.floor(start % 60)).padStart(2, '0')}`, [start])
  function toggle() {
    if (!ref.current) {
      ref.current = new Audio(url)
      ref.current.onended = () => setPlaying(false)
    }
    const el = ref.current
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.currentTime = start
      void el.play()
      setPlaying(true)
    }
  }
  return (
    <Button variant="ghost" size="sm" onClick={toggle}>
      {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      元音声 <Num>{label}</Num>
    </Button>
  )
}
