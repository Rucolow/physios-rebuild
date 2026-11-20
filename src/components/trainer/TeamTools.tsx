'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button, Field, Input, Modal } from '@/components/ui'
import { Num } from '@/components/ui/Num'
import { SIGNAL } from '@/lib/design/signal'
import { cn } from '@/lib/utils'
import { addTeam, setMatchScore } from '@/app/(trainer)/team/actions'

/** チームを足す */
export function AddTeamButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  return <Modal
    open={open}
    onOpenChange={(n) => { setOpen(n); if (!n) { setName(''); setError(null) } }}
    busy={pending}
    busyLabel="作っています…"
    trigger={<Button variant="outline" size="sm"><Plus size={16} strokeWidth={2} aria-hidden="true" />チームを足す</Button>}
    title="チームを足す"
    footer={<>
      <Button variant="secondary" disabled={pending} onClick={() => setOpen(false)}>やめる</Button>
      <Button variant="primary" disabled={pending || !name.trim()} onClick={() => start(async () => {
        const r = await addTeam(name)
        if (!r.ok) { setError(r.message); return }
        setOpen(false); setName('')
        router.push(`/team?t=${r.id}`)
      })}>{pending ? '作っています…' : '作る'}</Button>
    </>}
  >
    <div className="space-y-4">
      <Field id="team-name" label="チームの名前">
        <Input id="team-name" value={name} disabled={pending} onChange={(e) => setName(e.target.value)} />
      </Field>
      {error && <p role="alert" className={cn('text-2xs font-medium', SIGNAL.act.text)}>{error}</p>}
    </div>
  </Modal>
}

/** 試合の点を入れる・直す */
export function ScoreButton({ eventId, opponent, score }: { eventId: string; opponent: string; score: { for: number; against: number } | null }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [a, setA] = useState(score ? String(score.for) : '')
  const [b, setB] = useState(score ? String(score.against) : '')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const parse = (v: string) => (v.trim() === '' ? null : Number(v))
  return <Modal
    open={open}
    onOpenChange={(n) => { setOpen(n); if (!n) setError(null) }}
    busy={pending}
    trigger={score
      ? <button type="button" className="w-col-state shrink-0 text-right"><Num mono className="text-sm font-bold text-white">{score.for} - {score.against}</Num></button>
      : <Button variant="link" size="sm" className="w-col-state shrink-0 justify-end px-0">点を入れる</Button>}
    title={`vs ${opponent}`}
    footer={<>
      <Button variant="secondary" disabled={pending} onClick={() => setOpen(false)}>やめる</Button>
      <Button variant="primary" disabled={pending} onClick={() => start(async () => {
        const r = await setMatchScore(eventId, parse(a), parse(b))
        if (!r.ok) { setError(r.message); return }
        setOpen(false)
        router.refresh()
      })}>{pending ? '保存しています…' : '保存する'}</Button>
    </>}
  >
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field id="score-for" label="自チーム">
          <Input id="score-for" type="number" inputMode="numeric" min={0} numeric value={a} disabled={pending} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field id="score-against" label="相手">
          <Input id="score-against" type="number" inputMode="numeric" min={0} numeric value={b} disabled={pending} onChange={(e) => setB(e.target.value)} />
        </Field>
      </div>
      {error && <p role="alert" className={cn('text-2xs font-medium', SIGNAL.act.text)}>{error}</p>}
    </div>
  </Modal>
}
