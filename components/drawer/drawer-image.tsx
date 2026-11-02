'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { DrawerImage as DrawerImageData } from '@/lib/drawer-data'

const dismissals = new Set<() => void>()

function dismissCaptions(event: KeyboardEvent) {
  if (event.key === 'Escape') for (const dismiss of dismissals) dismiss()
}

export function DrawerImage({ entry, eager = false }: { entry: DrawerImageData; eager?: boolean }) {
  const [caption, setCaption] = useState<'idle' | 'pinned' | 'dismissed'>('idle')
  const itemRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const filename = entry.src.slice(entry.src.lastIndexOf('/') + 1).replace(/\.[^.]+$/, '')
  const captionId = `drawer-caption-${filename}`
  const yearLabel = entry.yearLabel ?? entry.year
  const restoreCaption = () => setCaption((current) => (current === 'dismissed' ? 'idle' : current))

  useEffect(() => {
    const dismiss = () => {
      if (itemRef.current?.contains(document.activeElement)) buttonRef.current?.focus()
      setCaption('dismissed')
    }
    // All tiles share one listener, removed when the gallery unmounts.
    if (!dismissals.size) document.addEventListener('keydown', dismissCaptions)
    dismissals.add(dismiss)
    return () => {
      dismissals.delete(dismiss)
      if (!dismissals.size) document.removeEventListener('keydown', dismissCaptions)
    }
  }, [])

  return (
    <figure
      ref={itemRef}
      className="drawer-item"
      data-caption-open={caption === 'pinned' || undefined}
      data-caption-dismissed={caption === 'dismissed' || undefined}
      onPointerEnter={restoreCaption}
      onFocusCapture={restoreCaption}
    >
      <button
        ref={buttonRef}
        type="button"
        tabIndex={0}
        className="drawer-image"
        aria-label={`Keep caption visible: ${yearLabel} — ${entry.title}`}
        aria-pressed={caption === 'pinned'}
        aria-describedby={captionId}
        onClick={() => setCaption((current) => (current === 'pinned' ? 'dismissed' : 'pinned'))}
      >
        <Image
          src={entry.src}
          alt={entry.alt}
          width={entry.width}
          height={entry.height}
          unoptimized
          loading={eager ? 'eager' : 'lazy'}
        />
      </button>
      <figcaption id={captionId} className="drawer-caption">
        <span className="drawer-year">{yearLabel}</span> ·{' '}
        <a
          className="drawer-source"
          href={entry.source}
          aria-label={`Source: ${entry.credit} (opens in a new tab)`}
          tabIndex={0}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source
        </a>
      </figcaption>
    </figure>
  )
}
