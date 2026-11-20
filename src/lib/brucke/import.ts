import 'server-only'
import { adminDb } from '@/lib/supabase/server'
import { parseLlmsFull } from './parse'

export const BRUCKE_FULL_TEXT_URL = 'https://www.brucke.app/llms-full.txt'

/** BRÜCKE の公開記事をナレッジに写す。記事の場所（URL）で照合し、同じ記事は上書きする */
export async function importBrucke(): Promise<{ fetched: number; saved: number }> {
  const res = await fetch(BRUCKE_FULL_TEXT_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`BRÜCKE: ${res.status}`)
  const articles = parseLlmsFull(await res.text())
  if (articles.length === 0) throw new Error('BRÜCKE: 記事が 1 件も読めませんでした')
  const rows = articles.map((a) => ({
    source: 'brucke',
    owner_trainer_id: null,
    source_ref: a.url,
    source_url: a.url,
    category: a.category ?? 'BRÜCKE',
    title: a.title,
    summary: a.subtitle,
    body_md: a.body,
    author_name: a.author,
    published_on: a.publishedOn,
    updated_at: new Date().toISOString(),
  }))
  const { data, error } = await adminDb().from('knowledge_article').upsert(rows, { onConflict: 'source_ref' }).select('id')
  if (error) throw error
  return { fetched: articles.length, saved: data?.length ?? 0 }
}
