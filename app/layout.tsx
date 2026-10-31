import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: '../assets/fonts/geist/Geist-Latin.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
  fallback: ['Arial', 'Helvetica', 'sans-serif'],
})

const geistMono = localFont({
  src: '../assets/fonts/geist/GeistMono-Latin.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://cs-giung.github.io'),
  title: {
    default: 'Giung Nam',
    template: '%s | Giung Nam',
  },
  description: 'Portfolio and CV of Giung Nam, AI Researcher at KAIST.',
  keywords: [
    'Giung Nam',
    'Nam Giung',
    'AI Researcher',
    'KAIST',
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Computer Science',
  ],
  authors: [{ name: 'Giung Nam', url: 'https://cs-giung.github.io' }],
  creator: 'Giung Nam',
  openGraph: {
    title: 'Giung Nam',
    description: 'Portfolio and CV of Giung Nam, AI Researcher at KAIST.',
    url: 'https://cs-giung.github.io',
    siteName: 'Giung Nam',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
