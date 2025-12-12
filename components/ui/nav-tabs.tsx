'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function NavTabs() {
    const pathname = usePathname()

    const tabs = [
        { name: 'CV', href: '/' },
        { name: 'Reading', href: '/reading' },
    ]

    return (
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
            {tabs.map((tab) => {
                const isActive = tab.href === '/'
                    ? pathname === '/'
                    : (pathname === tab.href || pathname.startsWith(`${tab.href}/`))
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "px-6 py-3 text-sm font-medium transition-colors hover:text-foreground",
                            isActive
                                ? "border-b-2 border-primary text-foreground"
                                : "text-muted-foreground border-b-2 border-transparent"
                        )}
                    >
                        {tab.name}
                    </Link>
                )
            })}
        </div>
    )
}
