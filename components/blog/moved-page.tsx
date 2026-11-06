import Link from 'next/link'

// GitHub Pages cannot serve HTTP redirects. A refresh works in the static export,
// including without JavaScript; keep a visible link as a fallback.
export function MovedPage({ href, label = 'Blog' }: { href: string; label?: string }) {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <meta httpEquiv="refresh" content={`0;url=${href}`} />
      <p>
        This page has moved to{' '}
        <Link href={href} className="text-link hover:underline">
          {label}
        </Link>
        .
      </p>
    </main>
  )
}
