'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PageReveal() {
  const pathname = usePathname()
  const revealed = useRef(new WeakMap<HTMLElement, string>())

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const printing = window.matchMedia('print')
    if (
      reducedMotion.matches ||
      printing.matches ||
      window.location.hash ||
      typeof IntersectionObserver === 'undefined' ||
      typeof Element.prototype.animate !== 'function'
    )
      return

    const registered = new WeakSet<HTMLElement>()
    const active = new Map<HTMLElement, Animation>()
    let stopped = false
    const observer = new IntersectionObserver(
      (entries) => {
        if (stopped || reducedMotion.matches || printing.matches) return
        let sequence = 0
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const element = entry.target as HTMLElement
          observer.unobserve(element)
          // Streamed targets can be observed before the route effect is replaced.
          const route = window.location.pathname
          if (revealed.current.get(element) === route) continue
          revealed.current.set(element, route)
          // Keep restored scroll positions and focused controls stationary.
          if (entry.boundingClientRect.top < 0 || element.contains(document.activeElement)) continue
          const animation = element.animate(
            [{ transform: 'translate3d(0, 18px, 0)' }, { transform: 'translate3d(0, 0, 0)' }],
            {
              duration: 560,
              delay: Math.min(sequence++, 3) * 60,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'backwards',
            },
          )
          active.set(element, animation)
          animation.finished
            .then(() => {
              active.delete(element)
              animation.cancel()
            })
            .catch(() => active.delete(element))
        }
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' },
    )

    const register = (root: ParentNode) => {
      const elements = [...root.querySelectorAll<HTMLElement>('[data-reveal]')]
      if (root instanceof HTMLElement && root.matches('[data-reveal]')) elements.unshift(root)
      for (const element of elements) {
        if (registered.has(element) || element.parentElement?.closest('[data-reveal]')) continue
        registered.add(element)
        observer.observe(element)
      }
    }
    register(document)
    // App Router navigation and streamed content can insert targets after this effect.
    const mutations = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes) if (node instanceof HTMLElement) register(node)
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    const stop = () => {
      stopped = true
      observer.disconnect()
      mutations.disconnect()
      for (const animation of active.values()) animation.cancel()
      active.clear()
    }
    const stopForPreference = () => {
      if (reducedMotion.matches || printing.matches) stop()
    }
    const stopForFocus = (event: FocusEvent) => {
      for (const [element, animation] of active)
        if (event.target instanceof Node && element.contains(event.target)) {
          animation.cancel()
          active.delete(element)
        }
    }
    reducedMotion.addEventListener('change', stopForPreference)
    printing.addEventListener('change', stopForPreference)
    window.addEventListener('beforeprint', stop)
    window.addEventListener('hashchange', stop)
    document.addEventListener('focusin', stopForFocus)
    return () => {
      stop()
      reducedMotion.removeEventListener('change', stopForPreference)
      printing.removeEventListener('change', stopForPreference)
      window.removeEventListener('beforeprint', stop)
      window.removeEventListener('hashchange', stop)
      document.removeEventListener('focusin', stopForFocus)
    }
  }, [pathname])

  return null
}
