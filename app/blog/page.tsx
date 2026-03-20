import { NavTabs } from '@/components/ui/nav-tabs'
import { getAllBlogPosts } from '@/lib/blog-posts'
import { Section, ReadingItem } from '@/components/cv/section'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Blog",
}

export default function Blog() {
  const allPosts = getAllBlogPosts()

  const posts = allPosts.filter(post => post.category === 'Posts')
  const notesAndScribbles = allPosts.filter(post => post.category === 'Notes & Scribbles')

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <div className="space-y-8">
          {posts.length > 0 && (
            <Section title="Posts">
              {posts.map((post, index) => (
                <div key={index}>
                  <ReadingItem
                    title={post.title}
                    authors={`${post.author}, ${post.date}`}
                    url={`/blog/${post.slug}`}
                    note={post.description}
                  />
                </div>
              ))}
            </Section>
          )}

          {notesAndScribbles.length > 0 && (
            <Section title="Notes & Scribbles">
              {notesAndScribbles.map((post, index) => (
                <div key={index}>
                  <ReadingItem
                    title={post.title}
                    authors={`${post.author}, ${post.date}`}
                    url={`/blog/${post.slug}`}
                    note={post.description}
                  />
                </div>
              ))}
            </Section>
          )}

          {allPosts.length === 0 && (
            <Section title="Blog">
              <p className="text-muted-foreground">No posts yet.</p>
            </Section>
          )}
        </div>
      </div>
    </main>
  )
}
