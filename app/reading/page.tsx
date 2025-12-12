import { NavTabs } from '@/components/ui/nav-tabs'
import { getReadingData } from '@/lib/reading-data'
import { Section, ReadingItem } from '@/components/cv/section'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Reading",
}

export default function Reading() {
  const readingData = getReadingData()
  const scrapbook = readingData.scrapbook || []
  const outer = readingData.outer || []

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <div className="space-y-8">
          {/* Scrapbook Section */}
          <Section title="Scrapbook">
            {scrapbook.length > 0 ? (
              scrapbook.map((item, index) => (
                <div key={index}>
                  <ReadingItem
                    title={item.title}
                    authors={item.authors}
                    url={item.url}
                    note={item.note}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No scrapbook items yet.</p>
            )}
          </Section>

          {/* Outer Section */}
          <Section title="Outer">
            {outer.length > 0 ? (
              outer.map((item, index) => (
                <div key={index}>
                  <ReadingItem
                    title={item.title}
                    authors={item.authors}
                    url={item.url}
                    note={item.note}
                  />
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No outer items yet.</p>
            )}
          </Section>
        </div>
      </div>
    </main>
  )
}
