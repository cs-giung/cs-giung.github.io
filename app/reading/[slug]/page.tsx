import type { Metadata } from 'next'
import { getStaticBlogParams, resolveBlogSlug } from '@/lib/blog-redirects'
import { MovedPage } from '@/components/blog/moved-page'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getStaticBlogParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: 'Blog',
    alternates: { canonical: `/blog/${resolveBlogSlug(slug)}/` },
    robots: { index: false, follow: true },
  }
}

export default async function ReadingPostRedirect({ params }: Props) {
  const { slug } = await params
  return <MovedPage href={`/blog/${resolveBlogSlug(slug)}/`} />
}
