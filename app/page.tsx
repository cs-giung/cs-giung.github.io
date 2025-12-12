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

          {/* Publication Section */}
          <Section title="Publication">
            {cvData.publication.map((pub, index) => {
              const previousPub = cvData.publication[index - 1];
              const isYearDifferent = previousPub && (previousPub.year !== pub.year);
              const shouldRenderSeparator = index > 0 && isYearDifferent;

              return (
                <div key={index}>
                  {shouldRenderSeparator && (
                    <div className="flex items-center my-4"> {/* Flexbox 컨테이너 */}
                      <div className="flex-grow border-t text-muted-foreground mr-4"></div>
                      <span className="text-sm text-muted-foreground">{pub.year}</span>
                      <div className="flex-grow border-t text-muted-foreground ml-4"></div>
                    </div>
                  )}
                  <PublicationItem
                    title={pub.title}
                    authors={pub.authors}
                    venue={pub.venue}
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
