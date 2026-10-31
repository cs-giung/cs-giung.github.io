import { Children, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'

function ContributionMarks({ children }: { children: ReactNode }) {
  return Children.map(children, (child) => {
    if (typeof child !== 'string') return child
    return child
      .split(/([*†]+)/)
      .map((part, index) => (/^[*†]+$/.test(part) ? <sup key={index}>{part}</sup> : part))
  })
}

const components: Components = {
  p: ({ children }) => <span>{children}</span>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

const authorComponents: Components = {
  ...components,
  p: ({ children }) => (
    <span>
      <ContributionMarks>{children}</ContributionMarks>
    </span>
  ),
  strong: ({ children }) => (
    <strong>
      <ContributionMarks>{children}</ContributionMarks>
    </strong>
  ),
  em: ({ children }) => (
    <em>
      <ContributionMarks>{children}</ContributionMarks>
    </em>
  ),
}

export function InlineMarkdown({ children }: { children: string }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>
}

export function AuthorList({ children }: { children: string }) {
  return <ReactMarkdown components={authorComponents}>{children}</ReactMarkdown>
}
