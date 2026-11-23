'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Plus } from 'lucide-react'
import { Button, Field, Input, Modal, Select, Textarea } from '@/components/ui'
import { SIGNAL } from '@/lib/design/signal'
import { cn } from '@/lib/utils'
import { addTeamEvent, deleteTeamEvent, updateTeamEvent } from '@/app/(trainer)/team/actions'
import type { TeamRef } from '@/lib/team'

const KINDS = [
  { value: 'match', label: '試合' },
  { value: 'training', label: 'チーム練習' },
  { value: 'off', label: 'オフ' },
]

/** 「予定を追加」（元の physios の AddScheduleButton。クラブをチームに置き換えた） */
export interface EditableEvent {
  id: string
  date: string
  kind: string
  time: string
  opponent: string
  venue: string
  homeAway: string
  note: string
}

/** 「予定を追加」。edit を渡すと、その予定を直す・消すボタンになる */
export function AddTeamEventButton({ teams, currentTeamId, initialDate, variant = 'primary', edit }: {
  teams: TeamRef[]
  currentTeamId: string | null
  initialDate?: string
  variant?: 'primary' | 'secondary'
  edit?: EditableEvent
}) {
  const router = useRouter()
  const initialTeam = currentTeamId ?? (teams.length === 1 ? teams[0].id : '')
  const [open, setOpen] = useState(false)
  const [teamId, setTeamId] = useState(initialTeam)
  const [eventOn, setEventOn] = useState(edit?.date ?? initialDate ?? '')
  const [kind, setKind] = useState(edit?.kind ?? '')
  const [startTime, setStartTime] = useState(edit?.time ?? '')
  const [opponent, setOpponent] = useState(edit?.opponent ?? '')
  const [venue, setVenue] = useState(edit?.venue ?? '')
  const [homeAway, setHomeAway] = useState(edit?.homeAway ?? '')
  const [note, setNote] = useState(edit?.note ?? '')
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const reset = () => {
    setTeamId(initialTeam); setEventOn(edit?.date ?? initialDate ?? ''); setKind(edit?.kind ?? '')
    setStartTime(edit?.time ?? ''); setOpponent(edit?.opponent ?? ''); setVenue(edit?.venue ?? ''); setHomeAway(edit?.homeAway ?? ''); setNote(edit?.note ?? ''); setError(null); setRemoving(false)
  }
  const canSubmit = teamId && eventOn && kind

  return <Modal
    open={open}
    onOpenChange={(next) => { setOpen(next); if (!next) reset() }}
    busy={pending}
    busyLabel={edit ? '保存しています…' : '追加しています…'}
    trigger={edit
      ? <button type="button" aria-label="この予定を直す" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-field text-navy-400 hover:bg-layer-10 hover:text-white"><Pencil size={16} strokeWidth={2} aria-hidden="true" /></button>
      : <Button variant={variant} size="sm" className={variant === 'primary' ? 'ml-auto' : undefined}>
          <Plus size={16} strokeWidth={2} aria-hidden="true" />予定を追加
        </Button>}
    title={edit ? '予定を直す' : '予定を追加する'}
    footer={removing && edit
      ? <>
          <Button variant="secondary" disabled={pending} onClick={() => setRemoving(false)}>やめる</Button>
          <Button variant="primary" disabled={pending} onClick={() => startTransition(async () => {
            setError(null)
            const result = await deleteTeamEvent(edit.id)
            if (!result.ok) { setError(result.message); return }
            setOpen(false)
            router.refresh()
          })}>{pending ? '消しています…' : 'この予定を消す'}</Button>
        </>
      : <>
          {edit
            ? <Button variant="ghost" disabled={pending} onClick={() => setRemoving(true)}>消す</Button>
            : <Button variant="secondary" disabled={pending} onClick={() => setOpen(false)}>やめる</Button>}
          <Button
            variant="primary" disabled={pending || !canSubmit}
            onClick={() => startTransition(async () => {
              setError(null)
              const input = { teamId, eventOn, kind, startTime, opponent, venue, homeAway, note }
              const result = edit ? await updateTeamEvent(edit.id, input) : await addTeamEvent(input)
              if (!result.ok) { setError(result.message); return }
              setOpen(false); if (!edit) reset()
              router.refresh()
            })}
          >{pending ? (edit ? '保存しています…' : '追加しています…') : edit ? '保存する' : '追加する'}</Button>
        </>}
  >
    {removing && edit ? <div className="space-y-2 text-sm text-navy-200">
      <p>この予定を消します。元に戻せません。</p>
      {error && <p role="alert" className={cn('text-2xs font-medium', SIGNAL.act.text)}>{error}</p>}
    </div> :
    <div className="space-y-4">
      {teams.length === 0 && <p className={cn('text-2xs font-medium', SIGNAL.act.text)}>先にチームを作ってください。</p>}
      {!edit && teams.length >= 2 && <Field id="ev-team" label="チーム">
        <Select id="ev-team" value={teamId} disabled={pending} onChange={(e) => setTeamId(e.target.value)}>
          <option value="" className="bg-navy-700">チームを選ぶ</option>
          {teams.map((t) => <option key={t.id} value={t.id} className="bg-navy-700">{t.name}</option>)}
        </Select>
      </Field>}
      <div className="grid grid-cols-2 gap-3">
        <Field id="ev-date" label="日付">
          <Input id="ev-date" type="date" numeric value={eventOn} disabled={pending} onChange={(e) => setEventOn(e.target.value)} />
        </Field>
        <Field id="ev-kind" label="種別">
          <Select id="ev-kind" value={kind} disabled={pending} onChange={(e) => setKind(e.target.value)}>
            <option value="" className="bg-navy-700">種別を選ぶ</option>
            {KINDS.map((k) => <option key={k.value} value={k.value} className="bg-navy-700">{k.label}</option>)}
          </Select>
        </Field>
      </div>
      {kind !== '' && kind !== 'off' && <Field id="ev-time" label="開始時刻" hint="任意">
        <Input id="ev-time" type="time" numeric value={startTime} disabled={pending} onChange={(e) => setStartTime(e.target.value)} />
      </Field>}
      {kind === 'match' && <>
        <Field id="ev-opponent" label="対戦相手">
          <Input id="ev-opponent" value={opponent} disabled={pending} onChange={(e) => setOpponent(e.target.value)} />
        </Field>
        <Field id="ev-homeaway" label="ホーム／アウェイ" hint="任意">
          <Select id="ev-homeaway" value={homeAway} disabled={pending} onChange={(e) => setHomeAway(e.target.value)}>
            <option value="" className="bg-navy-700">指定しない</option>
            <option value="home" className="bg-navy-700">ホーム</option>
            <option value="away" className="bg-navy-700">アウェイ</option>
          </Select>
        </Field>
      </>}
      {kind !== '' && kind !== 'off' && <Field id="ev-venue" label="会場" hint="任意">
        <Input id="ev-venue" value={venue} disabled={pending} onChange={(e) => setVenue(e.target.value)} />
      </Field>}
      <Field id="ev-note" label="メモ" hint="任意">
        <Textarea id="ev-note" value={note} disabled={pending} onChange={(e) => setNote(e.target.value)} />
      </Field>
      {error && <p role="alert" className={cn('text-2xs font-medium', SIGNAL.act.text)}>{error}</p>}
    </div>}
  </Modal>
}
