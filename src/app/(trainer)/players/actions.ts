'use server'
import { revalidatePath } from 'next/cache'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'

export type AddPlayerState = { ok: boolean; message: string | null; team: string }

/** 選手を一人足す。怪我は音声メモで話せばダイジェストに出る（名簿に居ない選手は同定できないので、先にここで足す） */
export async function addPlayerAction(_prev: AddPlayerState, form: FormData): Promise<AddPlayerState> {
  const trainer = await requireTrainer()
  const s = (k: string) => String(form.get(k) ?? '').trim()
  const family = s('family_name')
  const given = s('given_name')
  const team = s('team')
  if (!family || !given) return { ok: false, message: '姓と名を入れてください。', team }
  const aliases = s('aliases')
    .split(/[、,，\s]+/)
    .map((a) => a.trim())
    .filter(Boolean)
  const { error } = await adminDb()
    .from('player')
    .insert({ trainer_id: trainer.id, family_name: family, given_name: given, aliases, team: team || null })
  if (error) {
    console.error(error)
    return { ok: false, message: '足せませんでした。もう一度お試しください。', team }
  }
  revalidatePath('/players')
  return { ok: true, message: `${family} ${given} を足しました。`, team }
}
