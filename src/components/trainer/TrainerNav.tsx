'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Loader2, Mic } from 'lucide-react'
import { MobileNav, mobileNavItem, navRailItem } from '@/components/ui'
import { Num } from '@/components/ui/Num'
import { cn } from '@/lib/utils'
import { NAV_LEFT, NAV_RIGHT, type TrainerNavEntry } from './nav'
import { useRecorder } from './RecorderProvider'

function Item({ entry, active }: { entry: TrainerNavEntry; active: boolean }) {
  const Icon = entry.icon
  return (
    <Link href={entry.href} aria-current={active ? 'page' : undefined} className={cn(mobileNavItem({ active }))}>
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
      <span className="text-2xs font-medium">{entry.label}</span>
    </Link>
  )
}

function RailItem({ entry, active }: { entry: TrainerNavEntry; active: boolean }) {
  const Icon = entry.icon
  return (
    <Link href={entry.href} aria-current={active ? 'page' : undefined} className={cn(navRailItem({ active }))}>
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
      <span>{entry.label}</span>
    </Link>
  )
}

/** 長押ししている間だけ録音する中央のボタン */
function HoldButton({ rail = false }: { rail?: boolean }) {
  const { state, sec, level, press, release } = useRecorder()
  const active = state === 'recording' || state === 'starting'
  return (
    <div className={cn('relative flex justify-center', rail ? 'py-3' : 'flex-1')}>
      {state === 'recording' && (
        <div className={cn('pointer-events-none absolute flex w-max items-center gap-2 whitespace-nowrap rounded-pill border border-layer-10 glass px-3 py-2', rail ? 'left-full top-1/2 ml-3 -translate-y-1/2' : 'bottom-full mb-14')}>
          <Num mono className="text-sm font-bold text-white">
            {Math.floor(sec / 60)}:{String(sec % 60).padStart(2, '0')}
          </Num>
          <span className="h-2 w-16 overflow-hidden rounded-pill bg-navy-900">
            <span className="block h-full bg-red-400" style={{ width: `${Math.round(level * 100)}%` }} />
          </span>
        </div>
      )}
      <button
        type="button"
        aria-label={state === 'processing' ? '文字起こし中' : '押している間だけ録音'}
        aria-busy={state === 'processing'}
        disabled={state === 'processing'}
        onPointerDown={(e) => {
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
          press()
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onContextMenu={(e) => e.preventDefault()}
        className={cn(
          'no-callout', !rail && '-mt-6', 'inline-flex h-16 w-16 touch-none select-none items-center justify-center rounded-pill transition-colors duration-base ease-out',
          active ? 'bg-red-500 text-navy-900 animate-glow-pulse-danger' : 'bg-gold-500 text-navy-900 shadow-glow',
          state === 'processing' && 'cursor-not-allowed bg-layer-10 text-navy-300 shadow-none',
        )}
      >
        {state === 'processing' ? <Loader2 size={24} className="animate-spin" aria-hidden="true" /> : <Mic size={26} aria-hidden="true" />}
      </button>
    </div>
  )
}

/** スマホは下、タブレット以上は左に置く。録音のボタンはどちらも真ん中 */
export function TrainerNav() {
  const path = usePathname()
  return (
    <>
      <MobileNav className="fixed inset-x-0 bottom-0 z-nav md:hidden">
        {NAV_LEFT.map((e) => <Item key={e.href} entry={e} active={path.startsWith(e.href)} />)}
        <HoldButton />
        {NAV_RIGHT.map((e) => <Item key={e.href} entry={e} active={path.startsWith(e.href)} />)}
      </MobileNav>
      <nav className="fixed inset-y-0 left-0 z-nav hidden w-rail flex-col justify-center gap-1 border-r border-layer-10 bg-navy-900 px-1.5 md:flex">
        {NAV_LEFT.map((e) => <RailItem key={e.href} entry={e} active={path.startsWith(e.href)} />)}
        <HoldButton rail />
        {NAV_RIGHT.map((e) => <RailItem key={e.href} entry={e} active={path.startsWith(e.href)} />)}
      </nav>
    </>
  )
}
