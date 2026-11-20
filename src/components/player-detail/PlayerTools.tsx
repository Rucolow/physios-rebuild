'use client'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { Eye, EyeOff, ImagePlus, PencilLine, Plus } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { addKarte, setParticipation, setWatching, type FormState } from '@/app/(trainer)/players/[id]/actions'

const field = 'oa-kfinput w-full'
const label = 'mb-1 block text-2xs text-navy-300'

/** 参加区分・制限・復帰見込みを決める */
export function ParticipationButton({ playerId, status, restriction, expectedReturn }: { playerId: string; status: string | null; restriction: string | null; expectedReturn: string | null }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<FormState, FormData>(setParticipation, { ok: false, message: null })
  const [sel, setSel] = useState(status ?? 'limited')
  useEffect(() => { if (state.ok) setOpen(false) }, [state])
  return <Modal open={open} onOpenChange={setOpen} title="参加区分を決める" busy={pending}
    trigger={<button type="button" className="oa-button"><PencilLine size={16} strokeWidth={2} aria-hidden="true" />参加区分</button>}>
    <form action={action} className="space-y-4">
      <input type="hidden" name="player_id" value={playerId} />
      <fieldset className="grid grid-cols-3 gap-2">
        {([['full', '完全参加'], ['limited', '制限付き'], ['out', '離脱']] as const).map(([v, l]) => <label key={v} className="oa-pill justify-center" data-active={sel === v}>
          <input type="radio" name="status" value={v} checked={sel === v} onChange={() => setSel(v)} className="sr-only" />{l}
        </label>)}
      </fieldset>
      {sel === 'limited' && <div><label className={label} htmlFor="restriction">制限（指導者に伝わります）</label>
        <input id="restriction" name="restriction" defaultValue={restriction ?? ''} placeholder="例: 接触プレーなし" className={field} /></div>}
      {sel !== 'full' && <div><label className={label} htmlFor="expected_return">復帰見込み</label>
        <input id="expected_return" name="expected_return" type="date" defaultValue={expectedReturn ?? ''} className={field} /></div>}
      {state.message && <p role="alert" className="text-sm text-red-400">{state.message}</p>}
      <div className="flex justify-end"><Button type="submit" variant="primary" disabled={pending}>{pending ? '保存しています…' : '保存する'}</Button></div>
    </form>
  </Modal>
}

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
export function KarteButton({ playerId, today }: { playerId: string; today: string }) {
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
      {([['subjective', '訴え'], ['objective', '所見'], ['assessment', '評価'], ['treatment', '治療'], ['plan', '次の予定']] as const).map(([n, l]) =>
        <div key={n}><label className={label} htmlFor={n}>{l}</label><textarea id={n} name={n} rows={2} className={field} /></div>)}
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
