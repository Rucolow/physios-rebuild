'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Users } from 'lucide-react'
import { cn } from '@/lib/cn'

const ITEMS = [
  { href: '/brief', label: '朝', Icon: Sun },
  { href: '/digest', label: '夜', Icon: Moon },
  { href: '/players', label: '選手', Icon: Users },
]

export function TrainerNav() {
  const path = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-nav border-t border-layer-5 glass pb-safe">
      <ul className="mx-auto flex h-nav max-w-read">
        {ITEMS.map(({ href, label, Icon }) => {
          const here = path.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={here ? 'page' : undefined}
                className={cn(
                  'flex h-full flex-col items-center justify-center gap-1 text-2xs font-medium transition-colors duration-fast',
                  here ? 'text-gold-400' : 'text-navy-400 hover:text-white',
                )}
              >
                <Icon size={20} aria-hidden="true" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
