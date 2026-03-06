import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { NavTabs } from '@/components/ui/nav-tabs'
import { getBlogPostData, getAllBlogPostSlugs, getAdjacentBlogPosts } from '@/lib/blog-posts'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { Components } from 'react-markdown'
import React from 'react'
import { TableOfContents } from '@/components/blog/table-of-contents'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params
    const postData = getBlogPostData(slug)
    return {
        title: postData.title,
        description: postData.description,
    }
}

export async function generateStaticParams() {
    const paths = getAllBlogPostSlugs()
    return paths.map((path) => path.params)
}

function extractFootnotes(content: string): Record<string, string> {
    const footnotes: Record<string, string> = {};
    const footnoteRegex = /^\[\^([^\]]+)\]:\s+([\s\S]*?)(?=\n\[\^|\n\n|$)/gm;
    let match;
    while ((match = footnoteRegex.exec(content)) !== null) {
        footnotes[match[1]] = match[2].trim();
    }
    return footnotes;
}

function generateSlug(text: string) {
    return text.toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]/gu, '');
}

const getText = (children: React.ReactNode): string => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return children.toString();
    if (Array.isArray(children)) return children.map(getText).join('');
    if (React.isValidElement(children)) return getText(children.props.children);
    return '';
};

function extractHeadings(content: string) {
    // Only extract h2 (##) and h3 (###) for the index
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const headings: { level: number; title: string; slug: string }[] = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
        const titleText = match[2].replace(/\[\^[^\]]+\]/g, '').trim(); // Remove footnote refs from titles
        headings.push({
            level: match[1].length,
            title: titleText,
            slug: generateSlug(titleText)
        });
    }
    return headings;
}

const createMarkdownComponents = (
    footnotes: Record<string, string>, 
    hideFootnotes: boolean = false
): Components => ({
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => {
        const id = generateSlug(getText(children));
        return <h2 id={id} className="text-2xl font-bold mt-10 mb-3 border-b pb-2 scroll-mt-24">{children}</h2>;
    },
    h3: ({ children }) => {
        const id = generateSlug(getText(children));
        return <h3 id={id} className="text-xl font-bold mt-8 mb-2 scroll-mt-24">{children}</h3>;
    },
    p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6 relative">{children}</p>,
    ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
    ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
    blockquote: ({ children }) => <blockquote className="mt-6 border-l-2 pl-6 italic">{children}</blockquote>,
    code: ({ children, className }) => {
        const isInline = !className
        if (isInline) {
            return <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">{children}</code>
        }
        return <code className="relative rounded font-mono text-sm">{children}</code>
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
    sup: (props) => {
        return <sup {...props} className="ml-0.5">{props.children}</sup>;
    },
    li: (props) => {
        return <li {...props} className="mt-2">{props.children}</li>;
    },
    a: (props) => {
        const { href, children, ...rest } = props;
        const isFootnoteRef = href?.includes('fn-') && !href?.includes('fnref-');
        const isBackLink = href?.includes('fnref-');
        
        if (isFootnoteRef) {
            const idMatch = href?.match(/fn-(.+)$/);
            const id = idMatch ? idMatch[1] : '';
            const content = footnotes[id] || footnotes[children?.toString() || ''] || 'Footnote content not found';
            
            return (
                <span className="group inline text-blue-600">
                    {/* Sidenote: Stackable float-right implementation. Adaptive width based on screen size. */}
                    <span className="float-right clear-right w-0 overflow-visible hidden xl:block select-none pointer-events-none" aria-hidden="true">
                        <span className="relative left-6 w-48 2xl:w-64 block border-l-2 border-blue-100 pl-4 py-1 italic text-sm text-muted-foreground pointer-events-auto transition-colors duration-200 group-hover:text-foreground group-hover:border-blue-400 mb-4">
                            <span className="font-bold mr-1 not-italic text-xs text-blue-600/50">{children}.</span>
                            {content}
                        </span>
                    </span>
                    <a {...props} className="hover:underline font-mono text-xs">
                        {children}
                    </a>
                </span>
            );
        }

        // For footnote back-links and internal footnote navigation, don't open in new tab
        if (isBackLink || href?.startsWith('#')) {
            return (
                <a {...props} className="text-blue-600 hover:underline">
                    {children}
                </a>
            );
        }

        return <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
    },
    section: ({ children, ...props }) => {
        if (props.className === 'footnotes') {
            if (hideFootnotes) return null; // Hide from within the card
            return (
                <section {...props} id={props.id} className="footnotes mt-1 pt-0 text-sm text-muted-foreground italic xl:hidden [&>h2]:hidden">
                    {children}
                </section>
            );
        }
        return <section {...props} id={props.id}>{children}</section>;
    },
})

export default async function BlogPost({ params }: Props) {
    const { slug } = await params
    const postData = getBlogPostData(slug)
    const footnotes = extractFootnotes(postData.content)
    const headings = extractHeadings(postData.content)
    const cardMarkdownComponents = createMarkdownComponents(footnotes, true) // Hide footnotes in card
    const footerMarkdownComponents = createMarkdownComponents(footnotes, false) // Show footnotes in footer
    const { previous, next } = getAdjacentBlogPosts(slug)

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl relative">
                {/* Desktop Index Sidebar - Positioned using absolute to not affect main content flow, 
                    but spanning full height to allow sticky behavior. */}
                <div className="hidden xl:block absolute left-4 top-0 bottom-0 -translate-x-full h-full" style={{ width: '220px' }}>
                    <div className="sticky top-24 pt-36 text-right">
                        <TableOfContents headings={headings} postTitle={postData.title} />
                    </div>
                </div>

                <NavTabs />

                <Card className="w-full font-noto-sans-kr font-light border border-border shadow-sm overflow-visible">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">{postData.title}</CardTitle>
                        <p className="text-muted-foreground mt-2">
                            {postData.author}, {postData.date}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            components={cardMarkdownComponents}
                        >
                            {postData.content}
                        </ReactMarkdown>
                    </CardContent>
                </Card>

                {(previous || next) && (
                    <div className="mt-8 flex flex-col font-noto-sans-kr font-light">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {previous ? (
                                <Link 
                                    href={`/blog/${previous.slug}`}
                                    className="group flex flex-col items-start gap-2 p-4 rounded-xl border border-border bg-card hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 shadow-sm"
                                >
                                    <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider">
                                        <ChevronLeft className="mr-1 h-3 w-3" />
                                        Previous
                                    </div>
                                    <div className="font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {previous.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {previous.author}, {previous.date}
                                    </div>
                                    {previous.description && (
                                        <div className="text-xs text-muted-foreground/80 line-clamp-2 mt-1 italic">
                                            {previous.description}
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <div />
                            )}

                            {next ? (
                                <Link 
                                    href={`/blog/${next.slug}`}
                                    className="group flex flex-col items-end gap-2 p-4 rounded-xl border border-border bg-card hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 text-right shadow-sm"
                                >
                                    <div className="flex items-center text-xs text-muted-foreground uppercase tracking-wider">
                                        Next
                                        <ChevronRight className="ml-1 h-3 w-3" />
                                    </div>
                                    <div className="font-medium group-hover:text-blue-600 transition-colors line-clamp-1">
                                        {next.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {next.author}, {next.date}
                                    </div>
                                    {next.description && (
                                        <div className="text-xs text-muted-foreground/80 line-clamp-2 mt-1 italic text-right">
                                            {next.description}
                                        </div>
                                    )}
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>
                    </div>
                )}

                {/* Standalone footnote section below the card for mobile/tablet */}
                {/* We use CSS to hide everything except the footnotes section in this container */}
                <div className="xl:hidden px-4 [&>*:not(.footnotes)]:hidden">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={footerMarkdownComponents}
                    >
                        {postData.content}
                    </ReactMarkdown>
                </div>
            </div>
        </main>
    )
}
