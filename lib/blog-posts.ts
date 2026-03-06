import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const blogDirectory = path.join(process.cwd(), 'data', 'blog')

export interface BlogPostData {
    slug: string
    title: string
    date: string
    author: string
    description?: string
    content: string
}

export function getBlogPostData(slug: string): BlogPostData {
    const fullPath = path.join(blogDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents)

    return {
        slug,
        content,
        title: data.title,
        date: data.date,
        author: data.author,
        description: data.description,
    }
}

export function getAllBlogPosts(): Omit<BlogPostData, 'content'>[] {
    if (!fs.existsSync(blogDirectory)) {
        return []
    }
    const fileNames = fs.readdirSync(blogDirectory)
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '')
            const fullPath = path.join(blogDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')
            const { data } = matter(fileContents)

            return {
                slug,
                title: data.title,
                date: data.date,
                author: data.author,
                description: data.description,
            }
        })

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAdjacentBlogPosts(slug: string): { 
    previous: Omit<BlogPostData, 'content'> | null, 
    next: Omit<BlogPostData, 'content'> | null 
} {
    const posts = getAllBlogPosts()
    const currentIndex = posts.findIndex(post => post.slug === slug)
    
    if (currentIndex === -1) {
        return { previous: null, next: null }
    }

    // Since getAllBlogPosts returns posts sorted from newest to oldest:
    // next: newer (index - 1)
    // previous: older (index + 1)
    return {
        next: currentIndex > 0 ? posts[currentIndex - 1] : null,
        previous: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
    }
}

export function getAllBlogPostSlugs() {
    if (!fs.existsSync(blogDirectory)) {
        return []
    }
    const fileNames = fs.readdirSync(blogDirectory)
    return fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map((fileName) => {
            return {
                params: {
                    slug: fileName.replace(/\.md$/, ''),
                },
            }
        })
}
