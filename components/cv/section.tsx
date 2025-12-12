import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import { LinkableTitle } from '@/components/ui/linkable-title'

interface SectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function Section({ title, children, className = '' }: SectionProps) {
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl">
          <h2>{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  )
}

interface SectionItemProps {
  title: string
  subtitle?: string
  period: string
  location?: string
  details?: string[]
  children?: ReactNode
}

interface PublicationItemProps {
  title: string
  authors: string
  venue: string
  url?: string
  note?: string
}

const inlineMarkdownComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

export function SectionItem({
  title,
  subtitle,
  period,
  location,
  details,
  children
}: SectionItemProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">
            <ReactMarkdown components={inlineMarkdownComponents}>
              {title}
            </ReactMarkdown>
          </h3>
          {subtitle && (
            <div className="text-muted-foreground">
              <ReactMarkdown components={inlineMarkdownComponents}>
                {subtitle}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground text-right">
          <div>{period}</div>
          {location && <div>{location}</div>}
        </div>
      </div>

      {details && details.length > 0 && (
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
          {details.map((detail, index) => (
            <li key={index} className="[&>*]:inline [&>*:first-child]:ml-0">
              <ReactMarkdown components={inlineMarkdownComponents}>
                {detail}
              </ReactMarkdown>
            </li>
          ))}
        </ul>
      )}

      {children}
    </div>
  )
}

interface ReadingItemProps {
  title: string
  authors: string
  url?: string
  note?: string
}

export function ReadingItem({
  title,
  authors,
  url,
  note,
}: ReadingItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex-1">
          <div className="font-semibold text-sm">
            <LinkableTitle title={title} url={url} />
          </div>
          <div className="text-sm text-muted-foreground">
            <ReactMarkdown components={inlineMarkdownComponents}>
              {authors}
            </ReactMarkdown>
          </div>
          {note && (
            <div className="text-sm text-muted-foreground italic">
              <ReactMarkdown components={inlineMarkdownComponents}>
                {note}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function PublicationItem({
  title,
  authors,
  venue,
  url,
  note,
}: PublicationItemProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <div className="flex-1">
          <div className="font-semibold text-sm">
            <LinkableTitle title={title} url={url} />
          </div>
          <div className="text-sm text-muted-foreground">
            <ReactMarkdown components={inlineMarkdownComponents}>
              {authors}
            </ReactMarkdown>
          </div>
          <div className="text-sm text-muted-foreground italic">
            <ReactMarkdown components={inlineMarkdownComponents}>
              {note}
            </ReactMarkdown>
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <Badge variant="secondary">{venue}</Badge>
        </div>
      </div>
    </div>
  )
}