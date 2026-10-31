import { NavTabs } from '@/components/ui/nav-tabs'
import { PostListItem } from '@/components/blog/post-list-item'
import { getAllBlogPosts } from '@/lib/blog-posts'
import { getBlogLinks } from '@/lib/blog-links'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog' }
const panelClassName =
  'rounded-xl border border-border bg-card p-[var(--card-padding)] text-card-foreground shadow-sm'

export default function Blog() {
  const posts = getAllBlogPosts()
  const toItem = (post: (typeof posts)[number]) => ({
    title: post.title,
    authors: post.author === 'Giung Nam' ? undefined : post.author,
    href: `/blog/${post.slug}/`,
    description: post.description?.trim(),
    date: post.date,
  })
  const articles = posts.filter((post) => post.type === 'article').map(toItem)
  const notes = posts.filter((post) => post.type === 'note').map(toItem)
  const hasOwn = articles.length > 0 || notes.length > 0
  const reading = [
    ...posts.filter((post) => post.type === 'excerpt').map(toItem),
    ...getBlogLinks().map((item) => ({
      title: item.title,
      authors: item.authors.replace(/,\s*\d{4}$/, ''),
      href: item.url,
      description: item.note,
      date: item.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <h1 className="sr-only">Blog</h1>
        <div className="space-y-4">
          {hasOwn && (
            <section data-blog-panel="own" aria-label="Original writing" className={panelClassName}>
              {articles.length > 0 && (
                <ul
                  data-blog-list=""
                  data-blog-group="articles"
                  aria-label="Articles"
                  className="space-y-3"
                >
                  {articles.map((item) => (
                    <PostListItem key={item.href} {...item} />
                  ))}
                </ul>
              )}
              {articles.length > 0 && notes.length > 0 && (
                <hr className="my-4 border-0 border-t border-border" />
              )}
              {notes.length > 0 && (
                <ul
                  data-blog-list=""
                  data-blog-group="notes"
                  aria-label="Research notes"
                  className="space-y-3"
                >
                  {notes.map((item) => (
                    <PostListItem key={item.href} {...item} />
                  ))}
                </ul>
              )}
            </section>
          )}
          {reading.length > 0 && (
            <section data-blog-panel="reading" aria-label="Reading" className={panelClassName}>
              <ul
                data-blog-list=""
                data-blog-group="reading"
                aria-label="Reading"
                className="space-y-3"
              >
                {reading.map((item) => (
                  <PostListItem key={item.href} {...item} />
                ))}
              </ul>
            </section>
          )}
          {!hasOwn && reading.length === 0 && (
            <section className={panelClassName}>
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
