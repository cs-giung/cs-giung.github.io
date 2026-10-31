import type { Metadata } from 'next'
import { NavTabs } from '@/components/ui/nav-tabs'
import { DocumentHeader } from '@/components/cv/document-header'
import { CareerEntry, HonorEntry } from '@/components/cv/career-entry'
import { DocumentSection, RecordList } from '@/components/cv/document-section'
import { PublicationList } from '@/components/cv/publication-list'
import { PrintButton } from '@/components/cv/print-button'
import { InlineMarkdown } from '@/components/cv/inline-markdown'
import { getCVData } from '@/lib/cv-data'

export const metadata: Metadata = {
  title: 'CV',
  description:
    'Curriculum vitae of Giung Nam: positions, education, honors, publications, academic service, and teaching.',
}

function yearOnly(period: string) {
  return period.match(/\b\d{4}\b/)?.[0] ?? period
}

export default function CVPage() {
  const cv = getCVData()

  return (
    <main className="cv-page min-h-screen bg-background">
      <div className="cv-container container mx-auto px-4 py-8 max-w-4xl">
        <NavTabs />
        <article className="cv-document rounded-xl border shadow-sm">
          <div className="cv-screen-only mb-6 flex justify-center">
            <PrintButton />
          </div>
          <div className="cv-content">
            <DocumentHeader personal={cv.personal} document={cv.document} />

            <DocumentSection id="positions" title="Positions">
              {cv.position.map((position, index) => (
                <CareerEntry key={index} entry={position} />
              ))}
            </DocumentSection>

            <DocumentSection id="education" title="Education">
              {cv.education.map((education, index) => (
                <CareerEntry key={index} entry={education} education />
              ))}
            </DocumentSection>

            <DocumentSection id="honors" title="Honors & Awards" keepTogether>
              {cv.honors.map((honor) => (
                <HonorEntry
                  key={honor.title}
                  honor={{ ...honor, period: yearOnly(honor.period) }}
                />
              ))}
            </DocumentSection>

            <DocumentSection
              id="publications"
              title="Publications"
              description={
                <>
                  <sup>*</sup> Co-first author; <sup>†</sup> Co-corresponding author
                </>
              }
            >
              <PublicationList publications={cv.publication} />
            </DocumentSection>

            <DocumentSection id="service" title="Academic Service" keepTogether>
              <div className="cv-service-group">
                <h3 className="cv-subheading">Area Chair</h3>
                <RecordList entries={cv.service.leadership} />
              </div>
              <div className="cv-service-group">
                <h3 className="cv-subheading">Reviewer</h3>
                <RecordList entries={cv.service.reviewing} />
              </div>
              <div className="cv-service-group">
                <h3 className="cv-subheading">Recognition</h3>
                <RecordList entries={cv.service.recognition} />
              </div>
            </DocumentSection>

            <DocumentSection id="teaching" title="Teaching">
              <ul className="cv-records">
                {cv.teaching.map((course) => (
                  <li className="cv-record" key={`${course.course}-${course.period}`}>
                    <div>
                      <span>{course.course}</span>
                      <span className="cv-teaching-details">
                        {' '}
                        · {course.role} · {course.institution} (Instructor:{' '}
                        <InlineMarkdown>{course.instructor}</InlineMarkdown>)
                      </span>
                    </div>
                    <span className="cv-entry-period">{yearOnly(course.period)}</span>
                  </li>
                ))}
              </ul>
            </DocumentSection>

            <DocumentSection id="talks" title="Talks & Presentations">
              <ul className="cv-talks">
                {cv.talks.map((talk) => (
                  <li className="cv-talk" key={`${talk.event}-${talk.period}`}>
                    <div>
                      <span className="cv-talk-event">{talk.event}</span>
                      <span className="cv-talk-location"> · {talk.location}</span>
                    </div>
                    <span className="cv-entry-period">{yearOnly(talk.period)}</span>
                  </li>
                ))}
              </ul>
            </DocumentSection>
          </div>
        </article>
      </div>
    </main>
  )
}
