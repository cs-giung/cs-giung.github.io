import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NavTabs } from '@/components/ui/nav-tabs'
import { getPostData, getAllPostSlugs } from '@/lib/posts'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Components } from 'react-markdown'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params
    const postData = getPostData(slug)
    return {
        title: postData.title,
        description: postData.description,
    }
}

export async function generateStaticParams() {
    const paths = getAllPostSlugs()
    return paths.map((path) => path.params)
}

const markdownComponents: Components = {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3 border-b pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-bold mt-4 mb-2">{children}</h3>,
    p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>,
    ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
    ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
    blockquote: ({ children }) => <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>,
    code: ({ children, className }) => {
        const isInline = !className
        if (isInline) {
            return <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{children}</code>
        }
        return <code className="relative rounded bg-muted font-mono text-sm">{children}</code>
    },
    pre: ({ children }) => <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4 px-4 text-white dark:bg-muted dark:text-foreground">{children}</pre>,
    img: ({ src, alt }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className="rounded-md border my-4 w-full h-auto object-cover"
        />
    ),
    a: ({ href, children }) => <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params
    const postData = getPostData(slug)

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <NavTabs />
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">{postData.title}</CardTitle>
                        <p className="text-muted-foreground mt-2">
                            {postData.author}, {postData.date}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={markdownComponents}
                        >
                            {postData.content}
                        </ReactMarkdown>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
