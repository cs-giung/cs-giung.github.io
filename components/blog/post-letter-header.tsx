import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import type { BlogPostSource } from '@/lib/blog-posts'

interface PostLetterHeaderProps {
  title: string
  date: string
  author: string
  sources: BlogPostSource[]
}

export function PostLetterHeader({ title, date, author, sources }: PostLetterHeaderProps) {
  const originalAuthor = author.trim() !== 'Giung Nam' ? author : null

  return (
    <header className="post-letter-header">
      <div className="post-screen-only mb-3 flex justify-start">
        <Link
          href="/blog/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          Back to blog
        </Link>
      </div>
      <dl data-post-envelope="" className="post-envelope">
        <dt>Date:</dt>
        <dd>
          <time dateTime={date}>{date}</time>
        </dd>
        <dt>From:</dt>
        <dd>{originalAuthor || 'Giung Nam'}</dd>
        <dt>To:</dt>
        <dd>{originalAuthor ? 'Giung Nam' : 'You'}</dd>
        {originalAuthor && (
          <>
            <dt>CC:</dt>
            <dd>You</dd>
          </>
        )}
        <dt className="post-subject-label">Subject:</dt>
        <dd className="post-subject-value">
          <h1 id="post-subject">{title}</h1>
        </dd>
        {sources.length > 0 && (
          <>
            <dt>{sources.length === 1 ? 'Source:' : 'Sources:'}</dt>
            <dd>
              <ul className="space-y-0.5">
                {sources.map((source, index) => (
                  <li key={`${source.url || source.title}-${index}`} data-post-source="">
                    {source.url ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-border underline-offset-4 hover:decoration-current"
                      >
                        {source.title}
                        <ArrowUpRight aria-hidden="true" className="ml-1 inline h-3 w-3" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      source.title
                    )}
                  </li>
                ))}
              </ul>
            </dd>
          </>
        )}
      </dl>
    </header>
  )
}
