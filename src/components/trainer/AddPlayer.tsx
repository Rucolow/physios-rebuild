'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { addPlayerAction, type AddPlayerState } from '@/app/(trainer)/players/actions'
import { Button } from '@/components/ui/Button'

const field =
  'h-12 w-full rounded-field border border-layer-10 bg-layer-5 px-4 text-sm text-white placeholder:text-navy-500 focus:border-gold-500 focus:outline-none'

/** 選手一覧の上に置く。続けて何人も足せるように、チーム名は前の値を残す */
export function AddPlayer({ defaultTeam }: { defaultTeam: string }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState<AddPlayerState, FormData>(addPlayerAction, { ok: false, message: null, team: defaultTeam })
  const form = useRef<HTMLFormElement>(null)
  const first = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.ok) {
      form.current?.reset()
      first.current?.focus()
    }
  }, [state])

  if (!open)
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus size={16} aria-hidden="true" />
        選手を足す
      </Button>
    )

  return (
    <form ref={form} action={action} className="glass space-y-3 rounded-card border border-layer-10 p-4">
      <div className="grid grid-cols-2 gap-3">
        <input ref={first} name="family_name" required autoFocus placeholder="姓" aria-label="姓" className={field} />
        <input name="given_name" required placeholder="名" aria-label="名" className={field} />
      </div>
      <input name="aliases" placeholder="呼び方（ケンタ、健太くん）" aria-label="呼び方" className={field} />
      <input name="team" defaultValue={state.team} key={state.team} placeholder="チーム" aria-label="チーム" className={field} />
      <div className="flex items-center justify-between gap-3">
        <p role="status" className={state.ok ? 'text-2xs text-navy-300' : 'text-2xs text-red-400'}>
          {state.message}
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            閉じる
          </Button>
          <Button type="submit" variant="secondary" disabled={pending}>
            足す
          </Button>
        </div>
      </div>
    </form>
  )
}
