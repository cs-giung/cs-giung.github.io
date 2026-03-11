import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog-posts'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

function safeDate(dateStr: string): Date {
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? new Date() : date
}

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://cs-giung.github.io'

    // Get all blog posts
    const blogPosts = getAllBlogPosts().map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: safeDate(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Get all reading posts
    const readingPosts = getAllPosts().map((post) => ({
        url: `${baseUrl}/reading/${post.slug}`,
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
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/reading`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...blogPosts,
        ...readingPosts,
    ]
}
