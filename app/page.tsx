import { Card, CardContent } from '@/components/ui/card'
import { NavTabs } from '@/components/ui/nav-tabs'
import { ProfileHeader } from '@/components/cv/profile-header'
import { getCVData } from '@/lib/cv-data'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkBreaks from 'remark-breaks'

const inlineMarkdownComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-link hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

export default function Home() {
  const { personal } = getCVData()

  return (
    <main className="about-page min-h-screen bg-background">
      <div className="about-container container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <div className="space-y-8">
          <ProfileHeader personal={personal} />
          <Card className="w-full">
            <CardContent className="space-y-4">
              {personal.about.map((paragraph, index) => (
                <div key={index}>
                  <ReactMarkdown
                    components={inlineMarkdownComponents}
                    remarkPlugins={[remarkBreaks]}
                  >
                    {paragraph}
                  </ReactMarkdown>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
