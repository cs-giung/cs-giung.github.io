import fs from 'node:fs'
import path from 'node:path'
import { parseFrontmatter } from './content-data.ts'

const blogDirectory = path.join(process.cwd(), 'data', 'blog')
const postTypes = ['article', 'note', 'excerpt'] as const
export type BlogPostType = (typeof postTypes)[number]

export interface BlogPostSource {
  title: string
  url?: string
}

export interface BlogPostData {
  slug: string
  title: string
  date: string
  author: string
  category: string
  type: BlogPostType
  draft: boolean
  description?: string
  sources: BlogPostSource[]
  content: string
}

export function parseBlogPostData(slug: string, source: string): BlogPostData {
  const { metadata: data, content } = parseFrontmatter(source, slug)
  if (typeof data.title !== 'string' || !data.title.trim())
    throw new Error(`Missing post title in ${slug}`)
  const author = typeof data.author === 'string' ? data.author.trim() : 'Giung Nam'
  const category = typeof data.category === 'string' ? data.category : 'Posts'
  const type =
    data.type ?? (author !== 'Giung Nam' ? 'excerpt' : category === 'Posts' ? 'article' : 'note')
  if (typeof type !== 'string' || !postTypes.includes(type as BlogPostType))
    throw new Error(`Invalid post type in ${slug}`)
  if (data.draft !== undefined && typeof data.draft !== 'boolean')
    throw new Error(`draft must be a boolean in ${slug}`)
  if (data.description !== undefined && typeof data.description !== 'string')
    throw new Error(`description must be text in ${slug}`)
  if (typeof data.date !== 'string' && typeof data.date !== 'number')
    throw new Error(`Missing post date in ${slug}`)
  const date = String(data.date)
  const parsedDate = new Date(date)
  if (
    !/^\d{4}(?:-\d{2}-\d{2})?$/.test(date) ||
    !Number.isFinite(parsedDate.getTime()) ||
    (date.length === 10 && parsedDate.toISOString().slice(0, 10) !== date)
  ) {
    throw new Error(`Invalid post date in ${slug}`)
  }
  const rawSources = data.sources ?? []
  if (!Array.isArray(rawSources)) throw new Error(`sources must be a list in ${slug}`)
  const sources: BlogPostSource[] = rawSources.map((item: unknown) => {
    if (
      !item ||
      typeof item !== 'object' ||
      !('title' in item) ||
      typeof item.title !== 'string' ||
      !item.title.trim()
    ) {
      throw new Error(`Each source needs a title in ${slug}`)
    }
    const url = 'url' in item ? item.url : undefined
    if (url !== undefined && typeof url !== 'string')
      throw new Error(`Source URL must be text in ${slug}`)
    return { title: item.title, ...(url === undefined ? {} : { url }) }
  })
  return {
    slug,
    content,
    title: data.title,
    date,
    author,
    category,
    type: type as BlogPostType,
    draft: data.draft === true,
    description: data.description,
    sources,
  }
}

export function getBlogPostData(slug: string): BlogPostData {
  if (!/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(slug))
    throw new Error(`Invalid article slug: ${slug}`)
  return parseBlogPostData(slug, fs.readFileSync(path.join(blogDirectory, `${slug}.md`), 'utf8'))
}

export function getAllBlogPosts({ includeDrafts = false }: { includeDrafts?: boolean } = {}): Omit<
  BlogPostData,
  'content'
>[] {
  if (!fs.existsSync(blogDirectory)) return []
  return fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => getBlogPostData(file.slice(0, -3)))
    .filter((post) => includeDrafts || !post.draft)
    .map(({ content, ...post }) => {
      void content
      return post
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export function getAdjacentBlogPosts(slug: string): {
  previous: Omit<BlogPostData, 'content'> | null
  next: Omit<BlogPostData, 'content'> | null
} {
  const posts = getAllBlogPosts()
  const index = posts.findIndex((post) => post.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return { next: posts[index - 1] || null, previous: posts[index + 1] || null }
}

export function getAllBlogPostSlugs() {
  return getAllBlogPosts().map((post) => ({ params: { slug: post.slug } }))
}
