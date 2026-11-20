import { BookOpen, LayoutDashboard, Shield, Users, type LucideIcon } from 'lucide-react'

export interface TrainerNavEntry {
  href: string
  label: string
  icon: LucideIcon
}

/** 下部ナビ。中央（左二つと右二つの間）に録音のボタンが入る */
export const NAV_LEFT: TrainerNavEntry[] = [
  { href: '/dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/players', label: '選手', icon: Users },
]
export const NAV_RIGHT: TrainerNavEntry[] = [
  { href: '/team', label: 'チーム', icon: Shield },
  { href: '/knowledge', label: 'ナレッジ', icon: BookOpen },
]

const TITLES: { href: string; label: string }[] = [
  ...NAV_LEFT,
  ...NAV_RIGHT,
  { href: '/digest', label: 'ダイジェスト' },
  { href: '/settings', label: '設定' },
]

export function trainerScreenTitle(pathname: string): string {
  return TITLES.find((t) => pathname.startsWith(t.href))?.label ?? 'PHYSIOS'
}
