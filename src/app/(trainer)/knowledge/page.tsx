import Link from 'next/link'
import { Bookmark, ChevronRight, Search } from 'lucide-react'
import { requireTrainer } from '@/lib/auth'
import { loadKnowledge, type KnowledgeCard, type KnowledgeTab } from '@/lib/knowledge'
import { Num } from '@/components/ui/Num'
import { BookmarkButton } from '@/components/knowledge/BookmarkButton'

export const dynamic = 'force-dynamic'

const TABS: { key: KnowledgeTab; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'disease', label: '疾患' },
  { key: 'brucke', label: 'BRÜCKE' },
  { key: 'bookmark', label: 'ブックマーク' },
]

function href(c: KnowledgeTab, q: string) {
  const p = new URLSearchParams()
  if (c !== 'all') p.set('c', c)
  if (q) p.set('q', q)
  const s = p.toString()
  return s ? `/knowledge?${s}` : '/knowledge'
}

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ c?: string; q?: string }> }) {
  const trainer = await requireTrainer()
  const sp = await searchParams
  const tab = (TABS.some((t) => t.key === sp.c) ? sp.c : 'all') as KnowledgeTab
  const query = (sp.q ?? '').trim()
  const k = await loadKnowledge(trainer, query)
  const show = (t: KnowledgeTab) => tab === 'all' || tab === t

  return <main className="oa-root">
    <div className="oa-page">
      <div className="oa-wrap">
        <div className="oa-head">
          <h1 className="oa-h1">ナレッジ</h1>
        </div>

        <form method="get" action="/knowledge" className="oa-search">
          {tab !== 'all' && <input type="hidden" name="c" value={tab} />}
          <span className="oa-search-icon" aria-hidden="true"><Search size={20} strokeWidth={2} /></span>
          <input type="search" name="q" defaultValue={query} aria-label="ナレッジを検索" placeholder="疾患、記事を検索..." className="oa-input" />
          <button type="submit" className="sr-only">検索する</button>
        </form>

        <div className="oa-filters">
          <div className="oa-pillrow">
            {TABS.map((t) => <Link key={t.key} href={href(t.key, query)} aria-current={t.key === tab ? 'page' : undefined} data-active={t.key === tab} className="oa-pill">
              {t.key === 'bookmark' && <Bookmark size={16} strokeWidth={2} aria-hidden="true" />}
              {t.label}
            </Link>)}
          </div>
        </div>

        <div className="space-y-10">
          {show('disease') && <section>
            {tab === 'all' && <h2 className="mb-3 text-lg font-bold text-white">疾患</h2>}
            {k.diseases.length === 0
              ? <p className="oa-empty">該当する疾患はありません。</p>
              : <div className="overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
                  {k.diseases.map((d) => <Link key={d.key} href={`/knowledge/disease/${d.key}`} className="flex items-center gap-4 px-4 py-4 hover:bg-layer-5">
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-bold text-white">{d.name}</span>
                      <span className="mt-0.5 block truncate text-2xs text-navy-400">{d.variants.join(' ／ ')}</span>
                    </span>
                    {d.inUse > 0 && <span className="shrink-0 text-2xs text-gold-400">適用中 <Num>{d.inUse}</Num> 名</span>}
                    <ChevronRight size={16} aria-hidden="true" className="shrink-0 text-navy-500" />
                  </Link>)}
                </div>}
          </section>}

          {show('brucke') && <section>
            {tab === 'all' && <h2 className="mb-3 text-lg font-bold text-white">BRÜCKE</h2>}
            <Cards cards={k.brucke} empty="該当する記事はありません。" />
          </section>}

          {tab === 'all' && k.mine.length > 0 && <section>
            <h2 className="mb-3 text-lg font-bold text-white">自分の記事</h2>
            <Cards cards={k.mine} empty="" />
          </section>}

          {tab === 'bookmark' && <Cards cards={k.bookmarks} empty="ブックマークした記事はありません。" />}
        </div>
      </div>
    </div>
  </main>
}

function Cards({ cards, empty }: { cards: KnowledgeCard[]; empty: string }) {
  if (cards.length === 0) return <p className="oa-empty">{empty}</p>
  return <div className="oa-grid">
    {cards.map((c) => <div key={c.key} className="oa-cardwrap">
      <Link href={c.href}>
        <div className="oa-card oa-cardbody">
          <div className="oa-cardchips">
            <span className="oa-chip-accent">{c.kind}</span>
            {c.sub && <span className="oa-chip">{c.sub}</span>}
          </div>
          <h3 className="oa-cardtitle">{c.title}</h3>
          {c.description && <p className="oa-carddesc">{c.description}</p>}
        </div>
      </Link>
      {c.articleId && <BookmarkButton card articleId={c.articleId} bookmarked={c.bookmarked} title={c.title} />}
    </div>)}
  </div>
}
