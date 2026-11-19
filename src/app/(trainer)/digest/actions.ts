'use server'
import { revalidatePath } from 'next/cache'
import { requireTrainer } from '@/lib/auth'
import { confirmDigest, ConfirmError, type DraftAnswer } from '@/lib/confirm'
import { reprocessMemo } from '@/lib/memo'

export async function confirmAction(answers: Record<string, DraftAnswer>) {
  const trainer = await requireTrainer()
  try {
    const r = await confirmDigest(trainer, answers)
    revalidatePath('/digest')
    return { ok: true as const, ...r }
  } catch (e) {
    if (e instanceof ConfirmError) return { ok: false as const, message: e.message }
    console.error(e)
    return { ok: false as const, message: '記録できませんでした。もう一度お試しください。' }
  }
}

export async function reprocessAction(memoId: string) {
  const trainer = await requireTrainer()
  try {
    const r = await reprocessMemo(trainer, memoId)
    revalidatePath('/digest')
    return { ok: true as const, ...r }
  } catch (e) {
    console.error(e)
    revalidatePath('/digest')
    return { ok: false as const, message: 'もう一度失敗しました。音声は残っています。' }
  }
}
