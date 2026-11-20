'use client'
import { useState, useTransition } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { toggleBookmark } from '@/app/(trainer)/knowledge/actions'

/** ブックマークの付け外し。card は一覧カード右上のアイコン、そうでなければ語つきのボタン */
export function BookmarkButton({ articleId, bookmarked, title, card }: { articleId: string; bookmarked: boolean; title: string; card?: boolean }) {
  const [on, setOn] = useState(bookmarked)
  const [pending, start] = useTransition()
  const Icon = on ? BookmarkCheck : Bookmark
  const click = () =>
    start(async () => {
      const next = !on
      setOn(next)
      try {
        await toggleBookmark(articleId, next)
      } catch {
        setOn(!next)
      }
    })
  if (card)
    return <button type="button" disabled={pending} aria-pressed={on} aria-label={`${title} を${on ? 'ブックマークから外す' : 'ブックマークする'}`} className="oa-iconbutton oa-cardbookmark" onClick={click}>
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
    </button>
  return <button type="button" disabled={pending} aria-pressed={on} className="oa-button" onClick={click}>
    <Icon size={16} strokeWidth={2} aria-hidden="true" />
    {on ? 'ブックマークを外す' : 'ブックマーク'}
  </button>
}
