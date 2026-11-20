'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PencilLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { trainerScreenTitle } from './nav'
import { useRecorder } from './RecorderProvider'

/** 画面名・文字のメモ・設定への入口（アバター） */
export function TrainerHeader({ trainerName, initials }: { trainerName: string; initials: string }) {
  const pathname = usePathname()
  const { openText } = useRecorder()
  const settings = pathname.startsWith('/settings')
  return (
    <header className="sticky top-0 z-header flex h-header items-center gap-2 border-b border-layer-5 glass px-4 shadow-e1 md:px-6">
      <p className="text-sm font-bold text-white">{trainerScreenTitle(pathname)}</p>
      <button
        type="button"
        aria-label="文字でメモする"
        onClick={openText}
        className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-pill text-navy-300 transition-colors duration-fast hover:text-white"
      >
        <PencilLine size={18} aria-hidden="true" />
      </button>
      <Link href="/settings" aria-current={settings ? 'page' : undefined} className="flex min-h-11 items-center">
        <span className="sr-only">{trainerName}</span>
        <span
          aria-hidden="true"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-pill text-2xs font-bold',
            settings ? 'bg-gold-500/10 text-gold-400' : 'bg-layer-10 text-navy-100',
          )}
        >
          {initials}
        </span>
      </Link>
    </header>
  )
}
