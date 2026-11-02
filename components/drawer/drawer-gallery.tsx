'use client'

import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import type { DrawerImage as DrawerImageData } from '@/lib/drawer-data'
import { justifiedLayout } from '@/lib/drawer-layout'
import { eagerImageCount } from '@/lib/drawer-loading'
import { DrawerImage } from './drawer-image'

export function DrawerGallery({ images }: { images: readonly DrawerImageData[] }) {
  const galleryRef = useRef<HTMLUListElement>(null)
  const [measurement, setMeasurement] = useState({ width: 0, gap: 16, visibleHeight: 0 })

  useLayoutEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    const measure = () => {
      const { width, top } = gallery.getBoundingClientRect()
      const gap = Number.parseFloat(getComputedStyle(gallery).columnGap) || 16
      // Anchor the initial viewport to the document, not the current scroll position.
      const visibleHeight = Math.max(0, window.innerHeight - (top + window.scrollY))
      setMeasurement((previous) =>
        previous.width === width && previous.gap === gap && previous.visibleHeight === visibleHeight
          ? previous
          : { width, gap, visibleHeight },
      )
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(gallery)
    window.addEventListener('resize', measure)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const narrow = measurement.width < 480
  const tiles = justifiedLayout(
    images.map((image) => image.width / image.height),
    measurement.width,
    {
      gap: measurement.gap,
      targetHeight: narrow ? 160 : 192,
      maxItemsPerRow: narrow ? 1 : Infinity,
    },
  )

  const eagerCount = eagerImageCount(tiles, measurement.visibleHeight, measurement.gap)

  return (
    <ul
      ref={galleryRef}
      className="drawer-gallery"
      aria-label="Collected images"
      data-layout-ready={tiles.length === images.length || undefined}
      data-gallery-width={measurement.width || undefined}
    >
      {images.map((entry, index) => {
        const tile = tiles[index]
        return (
          <li
            key={entry.src}
            data-reveal=""
            data-year={entry.year}
            data-image={entry.src}
            data-row={tile?.row}
            data-justified={tile ? String(tile.justified) : undefined}
            style={
              {
                '--drawer-aspect': entry.width / entry.height,
                ...(tile && {
                  '--drawer-render-width': `${tile.width}px`,
                  '--drawer-render-height': `${tile.height}px`,
                }),
              } as CSSProperties
            }
          >
            <DrawerImage entry={entry} eager={index < eagerCount} />
          </li>
        )
      })}
    </ul>
  )
}
