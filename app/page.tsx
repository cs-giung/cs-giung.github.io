import { Card, CardContent } from '@/components/ui/card'
import { getCVData } from '@/lib/cv-data'
import { ProfileHeader } from '@/components/cv/profile-header'
import { Section, SectionItem, PublicationItem } from '@/components/cv/section'
import { Separator } from '@/components/ui/separator'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkBreaks from 'remark-breaks'

const inlineMarkdownComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ children, href }) => (
    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

import { NavTabs } from '@/components/ui/nav-tabs'

export default function Home() {
  const cvData = getCVData()
  const publications = [
    ...cvData.publication.filter(pub => pub.status === 'preprint').sort((a, b) => b.year - a.year),
    ...cvData.publication.filter(pub => pub.status !== 'preprint').sort((a, b) => b.year - a.year),
  ]

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <div className="space-y-8">

          {/* Profile Header */}
          <ProfileHeader personal={cvData.personal} />

          {/* About Section */}
          <Card className="w-full">
            <CardContent className="space-y-4">
              {cvData.personal.about.map((item, index) => {
                const shouldRenderSeparator = index > 0 && (
                  <Separator className="bg-background" />
                );
                return (
                  <div key={index}>
                    {shouldRenderSeparator}
                    <ReactMarkdown components={inlineMarkdownComponents} remarkPlugins={[remarkBreaks]} key={index}>
                      {item}
                    </ReactMarkdown>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Position Section */}
          <Section title="Position">
            {cvData.position.map((pos, index) => (
              <div key={index}>
                <SectionItem
                  title={pos.title}
                  subtitle={pos.subtitle}
                  period={pos.period}
                  location={pos.location}
                  details={pos.details}
                />
                {index < cvData.position.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </Section>

          {/* Education Section */}
          <Section title="Education">
            {cvData.education.map((edu, index) => (
              <div key={index}>
                <SectionItem
                  title={edu.title}
                  subtitle={edu.subtitle}
                  period={edu.period}
                  location={edu.location}
                  details={edu.details}
                />
                {index < cvData.education.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </Section>

          {/* Publication Section */}
          <Section title="Preprints & Publications" description="*: Co-first; †: Co-corresponding" className="gap-4">
            {publications.map((pub, index) => {
              const previousPub = publications[index - 1]
              const isPreprint = pub.status === 'preprint'
              const shouldRenderSeparator = !previousPub ||
                isPreprint !== (previousPub.status === 'preprint') ||
                (!isPreprint && previousPub.year !== pub.year)

              return (
                <div key={pub.title}>
                  {shouldRenderSeparator && (
                    <div className={`flex items-center ${index === 0 ? 'mb-4' : 'my-4'}`}>
                      <div className="flex-grow border-t text-muted-foreground mr-4" aria-hidden="true"></div>
                      <h3 className="text-sm text-muted-foreground">{isPreprint ? 'Preprints' : pub.year}</h3>
                      <div className="flex-grow border-t text-muted-foreground ml-4" aria-hidden="true"></div>
                    </div>
                  )}
                  <PublicationItem
                    title={pub.title}
                    authors={pub.authors}
                    venue={pub.venue}
                    status={pub.status}
                    url={pub.url}
                    note={pub.note}
                  />
                </div>
              );
            })}
          </Section>

        </div>
      </div>
    </main>
  )
}
