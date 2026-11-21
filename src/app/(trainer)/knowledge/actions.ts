'use server'
import { revalidatePath } from 'next/cache'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'

/** ブックマークを付け外しする。読める記事（自分の記事か BRÜCKE）だけ */
export async function toggleBookmark(articleId: string, on: boolean) {
  const trainer = await requireTrainer()
  const db = adminDb()
  const { data: a } = await db.from('knowledge_article').select('source, owner_trainer_id').eq('id', articleId).maybeSingle()
  if (!a || (a.source === 'trainer' && a.owner_trainer_id !== trainer.id)) return
  if (on) await db.from('knowledge_bookmark').upsert({ trainer_id: trainer.id, article_id: articleId })
  else await db.from('knowledge_bookmark').delete().eq('trainer_id', trainer.id).eq('article_id', articleId)
  revalidatePath('/knowledge', 'layout')
}
