'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireTrainer } from '@/lib/auth'
import { adminDb } from '@/lib/supabase/server'
import { ARTICLE_CATEGORIES, BODY_REGIONS } from '@/lib/knowledge'

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

export type ArticleFormState = { message: string | null }

/** 記事を書く・直す。id があれば自分の記事だけ直せる */
export async function saveArticle(_prev: ArticleFormState, form: FormData): Promise<ArticleFormState> {
  const trainer = await requireTrainer()
  const s = (k: string) => String(form.get(k) ?? '').trim()
  const id = s('id')
  const title = s('title')
  const body = s('body_md')
  const category = s('category')
  const region = s('body_region')
  const grade = s('evidence_grade')
  if (!title || !body) return { message: '題と本文を入れてください。' }
  if (!(category in ARTICLE_CATEGORIES)) return { message: '分類を選んでください。' }
  const row = {
    title,
    body_md: body,
    summary: s('summary') || null,
    category,
    body_region: region in BODY_REGIONS ? region : null,
    evidence_grade: ['A', 'B', 'C'].includes(grade) ? grade : null,
    tags: s('tags').split(/[、,，\s]+/).map((t) => t.replace(/^#/, '')).filter(Boolean),
    updated_at: new Date().toISOString(),
  }
  const db = adminDb()
  let savedId = id
  if (id) {
    const { data, error } = await db.from('knowledge_article').update(row).eq('id', id).eq('owner_trainer_id', trainer.id).select('id')
    if (error || !data?.length) return { message: '保存できませんでした。もう一度お試しください。' }
  } else {
    const { data, error } = await db
      .from('knowledge_article')
      .insert({ ...row, source: 'trainer', owner_trainer_id: trainer.id, author_name: trainer.name, published_on: new Date().toISOString().slice(0, 10) })
      .select('id')
      .single()
    if (error || !data) {
      console.error(error)
      return { message: '保存できませんでした。もう一度お試しください。' }
    }
    savedId = data.id
  }
  revalidatePath('/knowledge', 'layout')
  redirect(`/knowledge/article/${savedId}`)
}

export async function deleteArticle(id: string) {
  const trainer = await requireTrainer()
  await adminDb().from('knowledge_article').delete().eq('id', id).eq('owner_trainer_id', trainer.id)
  revalidatePath('/knowledge', 'layout')
  redirect('/knowledge')
}
