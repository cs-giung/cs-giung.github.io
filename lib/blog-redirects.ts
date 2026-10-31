import fs from 'node:fs'
import path from 'node:path'
import { getAllBlogPostSlugs } from './blog-posts.ts'

// Old URLs remain exported as static refresh pages, never as duplicate articles.
export const blogRedirects: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data', 'blog-redirects.json'), 'utf8'),
)

export function resolveBlogSlug(slug: string): string {
  return Object.hasOwn(blogRedirects, slug) ? blogRedirects[slug] : slug
}

export function getStaticBlogParams() {
  const paths = getAllBlogPostSlugs().map((path) => path.params)
  const published = new Set(paths.map((path) => path.slug))
  const aliases = Object.entries(blogRedirects)
    .filter(([, target]) => published.has(target))
    .map(([slug]) => ({ slug }))
  return [...paths, ...aliases]
}
