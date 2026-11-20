'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button, Field, Input, Modal, Select, Textarea } from '@/components/ui'
import { SIGNAL } from '@/lib/design/signal'
import { cn } from '@/lib/utils'
import { addTeamEvent } from '@/app/(trainer)/team/actions'
import type { TeamRef } from '@/lib/team'

const KINDS = [
  { value: 'match', label: '試合' },
  { value: 'training', label: 'チーム練習' },
  { value: 'off', label: 'オフ' },
]

/** 「予定を追加」（元の physios の AddScheduleButton。クラブをチームに置き換えた） */
export function AddTeamEventButton({ teams, currentTeamId, initialDate, variant = 'primary' }: {
  teams: TeamRef[]
  currentTeamId: string | null
  initialDate?: string
  variant?: 'primary' | 'secondary'
}) {
  const router = useRouter()
  const initialTeam = currentTeamId ?? (teams.length === 1 ? teams[0].id : '')
  const [open, setOpen] = useState(false)
  const [teamId, setTeamId] = useState(initialTeam)
  const [eventOn, setEventOn] = useState(initialDate ?? '')
  const [kind, setKind] = useState('')
  const [startTime, setStartTime] = useState('')
  const [opponent, setOpponent] = useState('')
  const [venue, setVenue] = useState('')
  const [homeAway, setHomeAway] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const reset = () => {
    setTeamId(initialTeam); setEventOn(initialDate ?? ''); setKind('')
    setStartTime(''); setOpponent(''); setVenue(''); setHomeAway(''); setNote(''); setError(null)
  }
  const canSubmit = teamId && eventOn && kind

  return <Modal
    open={open}
    onOpenChange={(next) => { setOpen(next); if (!next) reset() }}
    busy={pending}
    busyLabel="追加しています…"
    trigger={<Button variant={variant} size="sm" className={variant === 'primary' ? 'ml-auto' : undefined}>
      <Plus size={16} strokeWidth={2} aria-hidden="true" />予定を追加
    </Button>}
    title="予定を追加する"
    footer={<>
      <Button variant="secondary" disabled={pending} onClick={() => setOpen(false)}>やめる</Button>
      <Button
        variant="primary" disabled={pending || !canSubmit}
        onClick={() => startTransition(async () => {
          setError(null)
          const result = await addTeamEvent({ teamId, eventOn, kind, startTime, opponent, venue, homeAway, note })
          if (!result.ok) { setError(result.message); return }
          setOpen(false); reset()
          router.refresh()
        })}
      >{pending ? '追加しています…' : '追加する'}</Button>
    </>}
  >
    <div className="space-y-4">
      {teams.length === 0 && <p className={cn('text-2xs font-medium', SIGNAL.act.text)}>先にチームを作ってください。</p>}
      {teams.length >= 2 && <Field id="ev-team" label="チーム">
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
    </div>
  </Modal>
}
