import type { Metadata } from 'next'
import { MovedPage } from '@/components/blog/moved-page'

export const metadata: Metadata = {
  title: 'Blog',
  alternates: { canonical: '/blog/' },
  robots: { index: false, follow: true },
}

export default function ReadingRedirect() {
  return <MovedPage href="/blog/" />
}
