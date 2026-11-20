'use client'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, ImagePlus, ListChecks, Plus, X } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { addKarte, setKarteFields, setWatching, type FormState } from '@/app/(trainer)/players/[id]/actions'

const field = 'oa-kfinput w-full'
const label = 'mb-1 block text-2xs text-navy-300'

export function WatchButton({ playerId, watching }: { playerId: string; watching: boolean }) {
  const [on, setOn] = useState(watching)
  const [pending, start] = useTransition()
  const Icon = on ? EyeOff : Eye
  return <button type="button" disabled={pending} aria-pressed={on} className="oa-button"
    onClick={() => start(async () => { const next = !on; setOn(next); try { await setWatching(playerId, next) } catch { setOn(!next) } })}>
    <Icon size={16} strokeWidth={2} aria-hidden="true" />{on ? '要観察を外す' : '要観察にする'}
  </button>
}

/** カルテを手で書く。画像を添えられる */
export function KarteButton({ playerId, today, fields }: { playerId: string; today: string; fields: string[] }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<FormState, FormData>(addKarte, { ok: false, message: null })
  const [names, setNames] = useState<string[]>([])
  useEffect(() => { if (state.ok) { setOpen(false); setNames([]) } }, [state])
  return <Modal open={open} onOpenChange={setOpen} title="カルテを書く" width="detail" busy={pending} busyLabel="保存しています…"
    trigger={<button type="button" className="oa-button"><Plus size={16} strokeWidth={2} aria-hidden="true" />カルテを書く</button>}>
    <form action={action} className="space-y-3">
      <input type="hidden" name="player_id" value={playerId} />
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div><label className={label} htmlFor="summary">要点</label><input id="summary" name="summary" required className={field} /></div>
        <div><label className={label} htmlFor="written_on">日付</label><input id="written_on" name="written_on" type="date" defaultValue={today} className={field} /></div>
      </div>
      {fields.map((l, i) =>
        <div key={l}><label className={label} htmlFor={`kf${i}`}>{l}</label><textarea id={`kf${i}`} name={`f:${l}`} rows={2} className={field} /></div>)}
      <div>
        <label className="oa-button cursor-pointer">
          <ImagePlus size={16} strokeWidth={2} aria-hidden="true" />画像を添える
          <input type="file" name="images" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple className="sr-only"
            onChange={(e) => setNames(Array.from(e.target.files ?? []).map((f) => f.name))} />
        </label>
        {names.length > 0 && <p className="mt-2 text-2xs text-navy-300">{names.join('、')}</p>}
      </div>
      {state.message && <p role="alert" className="text-sm text-red-400">{state.message}</p>}
      <div className="flex justify-end"><Button type="submit" variant="primary" disabled={pending}>{pending ? '保存しています…' : '保存する'}</Button></div>
    </form>
  </Modal>
}

/** この選手のカルテの記入項目を足す・外す・並べ替える */
export function KarteFieldsButton({ playerId, fields }: { playerId: string; fields: string[] }) {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState(fields)
  const [draft, setDraft] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [pending, start] = useTransition()
  useEffect(() => { if (open) { setList(fields); setDraft(''); setMsg(null) } }, [open, fields])
  const move = (i: number, d: number) => setList((l) => { const n = [...l]; const j = i + d; if (j < 0 || j >= n.length) return l; [n[i], n[j]] = [n[j], n[i]]; return n })
  const add = () => { const v = draft.trim(); if (v && !list.includes(v)) setList([...list, v]); setDraft('') }
  return <Modal open={open} onOpenChange={setOpen} title="カルテの項目" busy={pending}
    trigger={<button type="button" className="oa-button"><ListChecks size={16} strokeWidth={2} aria-hidden="true" />項目</button>}
    footer={<>
      <Button variant="ghost" disabled={pending} onClick={() => setList(['訴え', '所見', '評価', '治療', '次の予定'])}>既定に戻す</Button>
      <Button variant="primary" disabled={pending || list.length === 0} onClick={() => start(async () => {
        const r = await setKarteFields(playerId, list)
        if (r.ok) setOpen(false); else setMsg(r.message)
      })}>保存する</Button>
    </>}>
    <div className="space-y-3">
      <ul className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
        {list.map((l, i) => <li key={l} className="flex items-center gap-1 px-3 py-2">
          <span className="min-w-0 flex-1 text-sm text-white">{l}</span>
          <button type="button" aria-label={`${l}を上へ`} disabled={i === 0} onClick={() => move(i, -1)} className="inline-flex h-9 w-9 items-center justify-center rounded-field text-navy-300 hover:bg-layer-10 disabled:opacity-30"><ArrowUp size={16} aria-hidden="true" /></button>
          <button type="button" aria-label={`${l}を下へ`} disabled={i === list.length - 1} onClick={() => move(i, 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-field text-navy-300 hover:bg-layer-10 disabled:opacity-30"><ArrowDown size={16} aria-hidden="true" /></button>
          <button type="button" aria-label={`${l}を外す`} onClick={() => setList(list.filter((x) => x !== l))} className="inline-flex h-9 w-9 items-center justify-center rounded-field text-navy-300 hover:bg-layer-10"><X size={16} aria-hidden="true" /></button>
        </li>)}
      </ul>
      <div className="flex gap-2">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }} placeholder="例: 可動域" aria-label="足す項目" className={field} />
        <Button variant="secondary" onClick={add} disabled={!draft.trim()}>足す</Button>
      </div>
      {msg && <p role="alert" className="text-sm text-red-400">{msg}</p>}
    </div>
  </Modal>
}
