import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

/**
 * ナビレール項目（§4-6・J19-6）。
 * アクティブ表現は (1) 文字 text-gold-400 (2) 面 bg-gold-500/10 の2層のみ。
 * 旧4層の左端バーと glow は廃止（J19-4 の色棒禁止と整合）。
 */
export const navRailItem = cva('flex w-full flex-col items-center gap-1 rounded-field px-2 py-3 text-center text-2xs font-medium transition-colors duration-fast', { variants: { active: {
  true: 'text-gold-400 bg-gold-500/10',
  false: 'text-navy-300 hover:bg-layer-5 hover:text-white',
} }, defaultVariants: { active: false } })
export type NavRailItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof navRailItem> & { icon?: ReactNode }
export function NavRailItem({ active, icon, children, className, ...props }: NavRailItemProps) { return <a aria-current={active ? 'page' : undefined} className={cn(navRailItem({ active }), className)} {...props}>{icon}{children}</a> }

/** ナビレール（§4-6）。幅 92px（w-rail）・bg-navy-900。最上部にブランド、最下部にアカウント。 */
export function NavRail({ brand, footer, children, className }: { brand?: ReactNode; footer?: ReactNode; children: ReactNode; className?: string }) {
  return <aside className={cn('flex h-full w-rail flex-col items-center border-r border-layer-10 bg-navy-900 py-4', className)}>{brand}<nav className="w-full flex-1 space-y-0.5 px-1.5">{children}</nav>{footer}</aside>
}

/** モバイル下部ナビ（§4-6）。タップ領域 44px 以上を必須とする。 */
export const mobileNavItem = cva('flex min-h-11 flex-1 flex-col items-center justify-center gap-1 transition-colors duration-fast', { variants: { active: {
  true: 'text-gold-400',
  false: 'text-navy-400',
} }, defaultVariants: { active: false } })
export function MobileNav({ children, className }: { children: ReactNode; className?: string }) { return <nav className={cn('glass border-t border-layer-5 pb-safe', className)}><div className="flex h-nav items-stretch justify-around">{children}</div></nav> }
export type MobileNavItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof mobileNavItem> & { icon?: ReactNode }
export function MobileNavItem({ active, icon, children, className, ...props }: MobileNavItemProps) { return <a aria-current={active ? 'page' : undefined} className={cn(mobileNavItem({ active }), className)} {...props}>{icon}<span className="text-2xs font-medium">{children}</span></a> }
