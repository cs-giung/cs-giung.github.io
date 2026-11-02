import type { Metadata } from 'next'
import { DrawerGallery } from '@/components/drawer/drawer-gallery'
import { NavTabs } from '@/components/ui/nav-tabs'
import { drawerImages } from '@/lib/drawer-data'
import './drawer.css'

export const metadata: Metadata = {
  title: 'Drawer',
  description: 'A small collection of images from science and computing.',
}

export default function Drawer() {
  const images = drawerImages.toSorted((a, b) => b.year - a.year)

  return (
    <main className="drawer-page min-h-screen bg-background">
      <div className="drawer-container container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <h1 className="sr-only">Drawer</h1>
        <DrawerGallery images={images} />
        <noscript>
          <style>
            {
              '.drawer-caption { position: static; opacity: 1; visibility: visible; transform: none; pointer-events: auto; }'
            }
          </style>
        </noscript>
      </div>
    </main>
  )
}
