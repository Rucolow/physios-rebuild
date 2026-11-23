'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Num } from '@/components/ui/Num'
import { SIGNAL } from '@/lib/design/signal'
import { searchMatches } from '@/lib/search'

export type PlayerRow = {
  id: string
  name: string
  meta: string
  status: 'full' | 'limited' | 'out' | null
  watching: boolean
  right: string | null
  urgent: boolean
  /** 検索に当てる文（姓名・呼び方・チーム・怪我） */
  text: string
}

/** 選手の一覧と検索。打つたびに絞り込む */
export function PlayerList({ rows, initialQuery, empty }: { rows: PlayerRow[]; initialQuery: string; empty: string }) {
  const [q, setQ] = useState(initialQuery)
  const filtered = rows.filter((r) => searchMatches(r.text, q))
  const groups: { title: string; rows: PlayerRow[] }[] = [
    { title: '合流の目安なし', rows: filtered.filter((r) => r.status === null) },
    { title: '離脱中', rows: filtered.filter((r) => r.status === 'out') },
    { title: '制限付き', rows: filtered.filter((r) => r.status === 'limited') },
    { title: '要観察', rows: filtered.filter((r) => r.status === 'full' && r.watching) },
    { title: '完全参加', rows: filtered.filter((r) => r.status === 'full' && !r.watching) },
  ]
  return <>
    <div className="relative">
      <Search size={20} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="名前・呼び方・傷病で検索" aria-label="選手を検索" enterKeyHint="search"
        className="h-12 w-full rounded-field border border-layer-10 bg-layer-5 pl-12 pr-12 text-sm text-white placeholder:text-navy-500 focus:border-gold-500 focus:outline-none [&::-webkit-search-cancel-button]:hidden" />
      {q && <button type="button" aria-label="検索を消す" onClick={() => setQ('')} className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-field text-navy-400 hover:bg-layer-10 hover:text-white"><X size={16} aria-hidden="true" /></button>}
    </div>
    {filtered.length === 0 && <p className="text-sm text-navy-400">{rows.length === 0 ? empty : '該当する選手がいません。'}</p>}
    {groups.filter((g) => g.rows.length > 0).map((g) => <section key={g.title} className="space-y-3">
      <h2 className="text-base font-bold text-white">{g.title} <Num className="ml-1 text-2xs font-normal text-navy-400">{g.rows.length} 名</Num></h2>
      <div className="glass overflow-hidden rounded-card border border-layer-10 divide-y divide-layer-5">
        {g.rows.map((r) => <Link key={r.id} href={`/players/${r.id}`} className="flex items-center gap-4 px-5 py-4 transition-colors duration-fast hover:bg-layer-5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white">{r.name}</p>
            <p className="mt-1 truncate text-2xs text-navy-400">{r.meta}</p>
          </div>
          {r.status === null
            ? <span className={cn('shrink-0 text-2xs font-bold', SIGNAL.watch.text)}>目安なし</span>
            : r.right && <Num className={cn('shrink-0 text-sm', r.urgent ? cn('font-bold', SIGNAL.watch.text) : 'text-navy-200')}>{r.right}</Num>}
        </Link>)}
      </div>
    </section>)}
  </>
}
