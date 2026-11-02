import { NavTabs } from '@/components/ui/nav-tabs'
import { getBlogPostData, getAdjacentBlogPosts, type BlogPostData } from '@/lib/blog-posts'
import { getStaticBlogParams, resolveBlogSlug } from '@/lib/blog-redirects'
import { rehypeReadingLayout } from '@/lib/reading-layout'
import { MovedPage } from '@/components/blog/moved-page'
import { PostLetterHeader } from '@/components/blog/post-letter-header'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { FitMath } from '@/components/blog/fit-math'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import 'katex/dist/katex.min.css'
import './reading-fonts.css'
import './post-letter.css'

interface Props {
  params: Promise<{ slug: string }>
}
export const dynamicParams = false

function publishedPost(slug: string) {
  const post = getBlogPostData(slug)
  if (post.draft) notFound()
  return post
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = resolveBlogSlug(slug)
  const post = publishedPost(canonicalSlug)
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${canonicalSlug}/` },
    ...(canonicalSlug !== slug && { robots: { index: false, follow: true } }),
  }
}

export function generateStaticParams() {
  return getStaticBlogParams()
}

function markdownComponents(post: BlogPostData): Components {
  return {
    h1: ({ children, id, className }) => (
      <h2 id={id} className={className}>
        {children}
      </h2>
    ),
    div: ({ node, children, ...props }) =>
      node?.properties.dataPostMain ? (
        <article
          data-post-letter=""
          data-reveal=""
          data-post-slug={post.slug}
          aria-labelledby="post-subject"
          className="post-letter rounded-2xl border border-border bg-card text-card-foreground shadow-sm"
        >
          <PostLetterHeader
            title={post.title}
            date={post.date}
            author={post.author}
            sources={post.sources}
          />
          <div data-post-body="" className="post-letter-body">
            {children}
          </div>
          <FitMath key={post.slug} postSlug={post.slug} />
        </article>
      ) : (
        <div {...props}>{children}</div>
      ),
    nav: ({ node, children, ...props }) =>
      node?.properties.dataPostToc ? (
        <TableOfContents>{children}</TableOfContents>
      ) : (
        <nav {...props}>{children}</nav>
      ),
    a: ({ node, href, children, ...props }) => {
      const isLocal =
        href?.startsWith('/') && !href.startsWith('//') && !/\.pdf(?:[?#]|$)/i.test(href)
      const className = node?.properties.dataFootnoteRef ? 'post-footnote-ref' : props.className
      if (isLocal)
        return (
          <Link {...props} href={href!} className={className}>
            {children}
          </Link>
        )
      const opensNewTab = Boolean(href && /^https?:\/\//i.test(href))
      return (
        <a
          {...props}
          href={href}
          className={className}
          {...(opensNewTab && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {children}
        </a>
      )
    },
    img: ({ src, alt, title }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt || ''} title={title} loading="lazy" />
    ),
    table: ({ children }) => (
      <div className="post-table-scroll" tabIndex={0} role="region" aria-label="Scrollable table">
        <table>{children}</table>
      </div>
    ),
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const canonicalSlug = resolveBlogSlug(slug)
  if (canonicalSlug !== slug) return <MovedPage href={`/blog/${canonicalSlug}/`} />
  const post = publishedPost(slug)
  const { previous, next } = getAdjacentBlogPosts(slug)

  return (
    <main className="post-page min-h-screen bg-background">
      <div className="post-screen-only container mx-auto max-w-4xl px-4 pt-8">
        <NavTabs />
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeReadingLayout, rehypeKatex]}
        components={markdownComponents(post)}
      >
        {post.content}
      </ReactMarkdown>

      {(previous || next) && (
        <div className="post-screen-only container mx-auto max-w-4xl px-4 pb-8">
          <nav
            aria-label="Adjacent posts"
            className="mt-8 grid grid-cols-1 gap-5 border-t border-border pt-5 sm:grid-cols-2"
          >
            <div>
              {previous && (
                <Link href={`/blog/${previous.slug}/`} className="group block">
                  <span className="mb-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <ArrowLeft aria-hidden="true" className="h-3 w-3" />
                    Older
                  </span>
                  <span className="block text-sm font-medium leading-6 group-hover:text-blue-600">
                    {previous.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="sm:text-right">
              {next && (
                <Link href={`/blog/${next.slug}/`} className="group block">
                  <span className="mb-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    Newer
                    <ArrowRight aria-hidden="true" className="h-3 w-3" />
                  </span>
                  <span className="block text-sm font-medium leading-6 group-hover:text-blue-600">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </main>
  )
}
