import type { Metadata } from 'next'
import { MovedPage } from '@/components/blog/moved-page'

export const metadata: Metadata = {
  title: 'About',
  alternates: { canonical: '/' },
  robots: { index: false, follow: true },
}

export default function AboutPage() {
  return <MovedPage href="/" label="the home page" />
}
