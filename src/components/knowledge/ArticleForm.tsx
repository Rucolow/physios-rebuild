'use client'
import { useActionState } from 'react'
import { deleteArticle, saveArticle, type ArticleFormState } from '@/app/(trainer)/knowledge/actions'

const CATEGORIES: [string, string][] = [
  ['protocol_guide', 'プロトコル解説'],
  ['assessment', '評価・検査法'],
  ['exercise', 'エクササイズ'],
  ['evidence', 'エビデンス・ガイドライン'],
  ['other', 'その他'],
]
const REGIONS: [string, string][] = [
  ['', '指定なし'],
  ['upper', '上肢'],
  ['trunk', '体幹'],
  ['lower', '下肢'],
  ['general', '全身'],
]

export interface ArticleDraft {
  id?: string
  title: string
  summary: string
  category: string
  body_region: string
  evidence_grade: string
  tags: string
  body_md: string
}

const label = 'mb-1 block text-[14px] leading-[20px] text-navy-300'
const input = 'oa-kfinput w-full'

export function ArticleForm({ draft }: { draft: ArticleDraft }) {
  const [state, action, pending] = useActionState<ArticleFormState, FormData>(saveArticle, { message: null })
  return <form action={action} className="space-y-5">
    {draft.id && <input type="hidden" name="id" value={draft.id} />}
    <div><label className={label} htmlFor="title">題</label><input id="title" name="title" required defaultValue={draft.title} className={input} /></div>
    <div><label className={label} htmlFor="summary">要約</label><textarea id="summary" name="summary" rows={2} defaultValue={draft.summary} className={input} /></div>
    <div className="grid grid-cols-2 gap-3">
      <div><label className={label} htmlFor="category">分類</label>
        <select id="category" name="category" defaultValue={draft.category || 'protocol_guide'} className={input}>{CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div><label className={label} htmlFor="body_region">部位</label>
        <select id="body_region" name="body_region" defaultValue={draft.body_region} className={input}>{REGIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div><label className={label} htmlFor="evidence_grade">エビデンス</label>
        <select id="evidence_grade" name="evidence_grade" defaultValue={draft.evidence_grade} className={input}>{['', 'A', 'B', 'C'].map((v) => <option key={v} value={v}>{v || '指定なし'}</option>)}</select></div>
      <div><label className={label} htmlFor="tags">タグ（読点で区切る）</label><input id="tags" name="tags" defaultValue={draft.tags} className={input} /></div>
    </div>
    <div><label className={label} htmlFor="body_md">本文（Markdown）</label><textarea id="body_md" name="body_md" rows={16} required defaultValue={draft.body_md} className={`${input} font-mono`} /></div>
    {state.message && <p role="alert" className="text-[14px] text-red-400">{state.message}</p>}
    <div className="flex items-center justify-between gap-3">
      {draft.id
        ? <button type="button" className="text-[14px] text-red-400 hover:text-red-300" onClick={() => { if (draft.id && window.confirm('この記事を消します。元に戻せません。')) void deleteArticle(draft.id) }}>記事を消す</button>
        : <span />}
      <button type="submit" disabled={pending} className="oa-kfbtn oa-kfbtn--gold">{pending ? '保存しています' : '保存する'}</button>
    </div>
  </form>
}
