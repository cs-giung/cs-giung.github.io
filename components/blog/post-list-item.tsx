import Link from 'next/link'

interface PostListItemProps {
  title: string
  authors?: string
  date: string
  href: string
  description?: string
}

export function PostListItem({ title, authors, date, href, description }: PostListItemProps) {
  const destination = new URL(href, 'https://cs-giung.github.io')
  const isExternal = destination.origin !== 'https://cs-giung.github.io'
  const isPdf = destination.pathname.toLowerCase().endsWith('.pdf')
  const kind = isExternal ? 'external' : isPdf ? 'pdf' : 'internal'
  const opensNewTab = isExternal || isPdf
  const className =
    'blog-title-link text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:text-blue-300'
  const linkText = (
    <>
      {title}
      {opensNewTab && (
        <span className="sr-only"> ({isPdf ? 'PDF' : 'External link'}, opens in a new tab)</span>
      )}
    </>
  )

  return (
    <li data-blog-entry="" data-link-kind={kind} className="min-w-0">
      <div className="break-words leading-5">
        <h2 className="inline text-sm font-medium">
          {opensNewTab ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
              {linkText}
            </a>
          ) : (
            <Link href={href} className={className}>
              {linkText}
            </Link>
          )}
        </h2>
        <span className="post-list-meta text-[13px] text-muted-foreground">
          {' '}
          <span aria-hidden="true">·</span>{' '}
          {authors && (
            <>
              <span data-post-author="">{authors}</span> <span aria-hidden="true">·</span>{' '}
            </>
          )}
          <time dateTime={date} className="whitespace-nowrap">
            {date}
          </time>
        </span>
      </div>
      {description && (
        <p className="mt-0.5 whitespace-normal break-words text-[13px] leading-[1.5] text-muted-foreground">
          {description}
        </p>
      )}
    </li>
  )
}
