import { Fragment } from 'react'
import type { CareerEntry as CareerData, Honor } from '@/lib/cv-data'
import { InlineMarkdown } from './inline-markdown'

interface CareerEntryProps {
  entry: CareerData & { gpa?: string }
  education?: boolean
}

export function CareerEntry({ entry, education = false }: CareerEntryProps) {
  // Institutions lead education entries; roles lead professional appointments.
  const title = education ? entry.subtitle : entry.title
  const subtitle = education ? entry.title : entry.subtitle
  const periods = entry.period.split(/;\s*/)

  return (
    <div className="cv-career-entry" data-career-kind={education ? 'education' : 'position'}>
      <div className="cv-career-heading">
        <div>
          <h3>
            <InlineMarkdown>{title}</InlineMarkdown>
          </h3>
          <p className="cv-career-subtitle">
            <InlineMarkdown>{subtitle}</InlineMarkdown>
          </p>
        </div>
        <p className="cv-career-period">
          {periods.length === 1
            ? entry.period
            : periods.map((period, index) => (
                <Fragment key={index}>
                  {index > 0 && ' '}
                  <span className="cv-period-segment">
                    {period}
                    {index < periods.length - 1 && ';'}
                  </span>
                </Fragment>
              ))}
        </p>
      </div>
      {(entry.location ||
        entry.gpa ||
        entry.mentors ||
        entry.collaborators ||
        entry.facilitators) && (
        <p className="cv-career-meta">
          {entry.location && <span>{entry.location}</span>}
          {entry.gpa && <span>GPA: {entry.gpa}</span>}
          {entry.mentors && (
            <span>
              Mentored by <InlineMarkdown>{entry.mentors}</InlineMarkdown>
            </span>
          )}
          {entry.collaborators && (
            <span>
              Working with <InlineMarkdown>{entry.collaborators}</InlineMarkdown>
            </span>
          )}
          {entry.facilitators && (
            <span>
              Facilitated by <InlineMarkdown>{entry.facilitators}</InlineMarkdown>
            </span>
          )}
        </p>
      )}
      {entry.details && entry.details.length > 0 && (
        <div className="cv-career-details">
          {entry.details.map((detail, index) => {
            const labelled = detail.match(/^(Thesis|Committee|Advisor):\s*(.*)$/)
            return labelled ? (
              <p className="cv-labelled-detail" key={index}>
                <span className="cv-detail-label">{labelled[1]}</span>
                <span>
                  <InlineMarkdown>{labelled[2]}</InlineMarkdown>
                </span>
              </p>
            ) : (
              <p key={index}>
                <InlineMarkdown>{detail}</InlineMarkdown>
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function HonorEntry({ honor }: { honor: Honor }) {
  return (
    <div className="cv-honor-entry">
      <div className="cv-career-heading">
        <h3>
          {honor.title}
          <span className="cv-honor-organization"> · {honor.organization}</span>
        </h3>
        <p className="cv-career-period">{honor.period}</p>
      </div>
      <p className="cv-honor-description">{honor.description}</p>
    </div>
  )
}
