'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// The links are server-rendered from the same syntax tree as the body. JavaScript
// only adds scroll tracking and the small-screen disclosure preference.
export function TableOfContents({ children }: { children: ReactNode }) {
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = nav.current
    if (!element) return
    const details = element.querySelector('details')
    const wide = window.matchMedia('(min-width: 80rem)')
    const setDisclosure = () => {
      if (details) details.open = wide.matches
    }
    setDisclosure()
    wide.addEventListener('change', setDisclosure)

    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    const layout = element.closest('[data-reading-layout]')
    const headings = links.map(
      (link) =>
        layout?.querySelector<HTMLElement>(
          `#${CSS.escape(decodeURIComponent(link.hash.slice(1)))}`,
        ) ?? null,
    )
    let frame = 0
    const update = () => {
      frame = 0
      let current = -1
      headings.forEach((heading, index) => {
        if (heading && heading.getBoundingClientRect().top <= 130) current = index
      })
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20)
        current = links.length - 1
      links.forEach((link, index) => {
        if (index === current) link.setAttribute('aria-current', 'location')
        else link.removeAttribute('aria-current')
      })
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => {
      window.cancelAnimationFrame(frame)
      wide.removeEventListener('change', setDisclosure)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [children])

  return (
    <nav ref={nav} className="post-toc" aria-label="Table of contents">
      {children}
    </nav>
  )
}
