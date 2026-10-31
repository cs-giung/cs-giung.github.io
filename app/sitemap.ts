import type { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog-posts'

export const dynamic = 'force-static'

function safeDate(dateStr: string): Date {
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? new Date() : date
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cs-giung.github.io'

  // Get all blog posts
  const blogPosts = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}/`,
    lastModified: safeDate(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/cv/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPosts,
  ]
}
