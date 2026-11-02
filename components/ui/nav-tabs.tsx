'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function NavTabs() {
  const pathname = usePathname()

  const tabs = [
    { name: 'ABOUT', href: '/' },
    { name: 'BLOG', href: '/blog' },
    { name: 'CV', href: '/cv' },
    { name: 'DRAWER', href: '/drawer' },
  ]

  return (
    <nav
      aria-label="Main navigation"
      className="flex border-b border-gray-200 dark:border-gray-800 mb-6 print:hidden"
    >
      {tabs.map((tab) => {
        const isActive =
          tab.href === '/'
            ? pathname === '/'
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors hover:text-foreground sm:px-6',
              isActive
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground border-b-2 border-transparent',
            )}
          >
            {tab.name}
          </Link>
        )
      })}
    </nav>
  )
}
