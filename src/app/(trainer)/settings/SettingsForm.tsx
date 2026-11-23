'use client'
import { useActionState } from 'react'
import { Button } from '@/components/ui/Button'
import { saveSettings, type SettingsState } from './actions'

const ZONES: [string, string][] = [
  ['Europe/Berlin', 'ドイツ（ベルリン）'],
  ['Asia/Tokyo', '日本（東京）'],
  ['Europe/London', 'イギリス（ロンドン）'],
  ['Europe/Vienna', 'オーストリア（ウィーン）'],
  ['Europe/Zurich', 'スイス（チューリッヒ）'],
]
const field = 'h-12 w-full rounded-field border border-layer-10 bg-layer-5 px-4 text-sm text-white focus:border-gold-500 focus:outline-none'

export function SettingsForm({ name, timeZone, terms }: { name: string; timeZone: string; terms: string[] }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(saveSettings, { ok: false, message: null })
  const zones = ZONES.some(([z]) => z === timeZone) ? ZONES : [[timeZone, timeZone] as [string, string], ...ZONES]
  return <form action={action} className="space-y-4">
    <div>
      <label htmlFor="name" className="mb-1 block text-sm text-navy-300">表示名</label>
      <input id="name" name="name" defaultValue={name} required className={field} />
      <p className="mt-1 text-2xs text-navy-400">記事の著者名と記録に出ます。</p>
    </div>
    <div>
      <label htmlFor="time_zone" className="mb-1 block text-sm text-navy-300">時間帯</label>
      <select id="time_zone" name="time_zone" defaultValue={timeZone} className={field}>{zones.map(([z, l]) => <option key={z} value={z}>{l}</option>)}</select>
      <p className="mt-1 text-2xs text-navy-400">一日の区切り（ダイジェストと翌日のメニュー）をこの時間帯で決めます。</p>
    </div>
    <div>
      <label htmlFor="terms" className="mb-1 block text-sm text-navy-300">よく使う言葉</label>
      <textarea id="terms" name="terms" rows={4} defaultValue={terms.join('\n')} className="w-full rounded-field border border-layer-10 bg-layer-5 p-3 text-sm text-white focus:border-gold-500 focus:outline-none" />
      <p className="mt-1 text-2xs text-navy-400">音声メモで違う言葉に起こされた用語を、一行に一つ入れてください。次の録音から聞き取りの手がかりにします。</p>
    </div>
    {state.message && <p role="status" className={state.ok ? 'text-sm text-navy-300' : 'text-sm text-red-400'}>{state.message}</p>}
    <Button type="submit" variant="primary" disabled={pending}>{pending ? '保存しています…' : '保存する'}</Button>
  </form>
}
