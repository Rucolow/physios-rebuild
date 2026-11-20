import Link from 'next/link'
import { Bookmark, Search } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { ARTICLE_CATEGORIES, loadKnowledge, type KnowledgeFilter } from '@/lib/knowledge'
import { Num } from '@/components/ui/Num'
import { BookmarkButton } from '@/components/knowledge/BookmarkButton'

export const dynamic = 'force-dynamic'

const PILLS: { key: KnowledgeFilter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'protocol', label: 'リハビリプロトコル' },
  ...(Object.entries(ARTICLE_CATEGORIES) as [KnowledgeFilter, string][]).map(([key, label]) => ({ key, label })),
  { key: 'brucke', label: 'BRÜCKE' },
  { key: 'bookmark', label: 'ブックマーク' },
]

function href(c: KnowledgeFilter, q: string) {
  const p = new URLSearchParams()
  if (c !== 'all') p.set('c', c)
  if (q) p.set('q', q)
  const s = p.toString()
  return s ? `/knowledge?${s}` : '/knowledge'
}

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ c?: string; q?: string }> }) {
  const trainer = await requireTrainer()
  const sp = await searchParams
  const filter = (PILLS.some((p) => p.key === sp.c) ? sp.c : 'all') as KnowledgeFilter
  const query = (sp.q ?? '').trim()
  const { cards, counts } = await loadKnowledge(trainer, filter, query)
  // 0 件の分類は並べない（選んでいるもの・すべて・プロトコル・ブックマークは残す）
  const pills = PILLS.filter((p) => ['all', 'protocol', 'bookmark'].includes(p.key) || p.key === filter || counts[p.key] > 0)

  return <main className="oa-root">
    <div className="oa-page">
      <div className="oa-wrap">
        <div className="oa-head">
          <h1 className="oa-h1">ナレッジベース</h1>
          <p className="oa-lead">プロトコル、評価・検査法、エクササイズ、文献にアクセスできます。</p>
          <div className="oa-headmeta"><span><Num>{counts.all}</Num> 件</span></div>
          <Link href="/knowledge/article/new" className="oa-button oa-headaction">記事を書く</Link>
        </div>

        <form method="get" action="/knowledge" className="oa-search">
          {filter !== 'all' && <input type="hidden" name="c" value={filter} />}
          <span className="oa-search-icon" aria-hidden="true"><Search size={20} strokeWidth={2} /></span>
          <input type="search" name="q" defaultValue={query} aria-label="ナレッジを検索" placeholder="疾患、種目、記事を検索..." className="oa-input" />
          <button type="submit" className="sr-only">検索する</button>
        </form>

        <div className="oa-filters">
          <div className="oa-pillrow">
            {pills.map((p) => <Link key={p.key} href={href(p.key, query)} aria-current={p.key === filter ? 'page' : undefined} data-active={p.key === filter} className="oa-pill">
              {p.key === 'bookmark' && <Bookmark size={16} strokeWidth={2} aria-hidden="true" />}
              {p.label}
            </Link>)}
          </div>
        </div>

        {cards.length === 0
          ? <p className="oa-empty">{filter === 'bookmark' ? 'ブックマークした記事はありません。' : '該当するものがありません。'}</p>
          : <div className="oa-grid">
              {cards.map((c) => <div key={c.key} className="oa-cardwrap">
                <Link href={c.href}>
                  <div className="oa-card oa-cardbody">
                    <div className="oa-cardchips">
                      <span className="oa-chip-accent">{c.kind}</span>
                      {c.sub && <span className="oa-chip">{c.sub}</span>}
                    </div>
                    <h3 className="oa-cardtitle">{c.title}</h3>
                    {c.description && <p className="oa-carddesc">{c.description}</p>}
                    {c.meta.length > 0 && <div className="oa-cardmeta flex-wrap gap-y-1">{c.meta.map((m) => <span key={m}>{m}</span>)}</div>}
                  </div>
                </Link>
                {c.articleId && <BookmarkButton card articleId={c.articleId} bookmarked={c.bookmarked} title={c.title} />}
              </div>)}
            </div>}
      </div>
    </div>
  </main>
}
