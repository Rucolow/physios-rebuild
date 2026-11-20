'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, ListChecks, TrendingUp } from 'lucide-react'
import { MobileNav, mobileNavItem } from '@/components/ui/NavRail'
import { cn } from '@/lib/cn'

export function PlayerNav({ token }: { token: string }) {
  const path = usePathname()
  const items = [
    { href: `/p/${token}`, label: 'ホーム', Icon: House },
    { href: `/p/${token}/log`, label: '記録', Icon: ListChecks },
    { href: `/p/${token}/progress`, label: '経過', Icon: TrendingUp },
  ]
  return <MobileNav className="fixed inset-x-0 bottom-0 z-nav">
    {items.map(({ href, label, Icon }) => {
      const active = path === href
      return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={cn(mobileNavItem({ active }))}>
        <Icon width={20} height={20} aria-hidden="true" />
        <span className="text-2xs font-medium">{label}</span>
      </Link>
    })}
  </MobileNav>
}
