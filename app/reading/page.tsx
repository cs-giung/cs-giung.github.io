import { NavTabs } from '@/components/ui/nav-tabs'
import { getReadingData } from '@/lib/reading-data'
import { Section, ReadingItem } from '@/components/cv/section'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Reading",
}

export default function Reading() {
  const readingData = getReadingData()
  const notes = readingData.notes || []
  const links = readingData.links || []

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <div className="space-y-8">
          {/* Notes Section */}
          <Section title="Notes">
            {notes.length > 0 ? (
              notes.map((item, index) => (
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
              <p className="text-muted-foreground">No notes yet.</p>
            )}
          </Section>

          {/* Links Section */}
          <Section title="Links">
            {links.length > 0 ? (
              links.map((item, index) => (
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
              <p className="text-muted-foreground">No links yet.</p>
            )}
          </Section>
        </div>
      </div>
    </main>
  )
}
