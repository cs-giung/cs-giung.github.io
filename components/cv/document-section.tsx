import type { ReactNode } from 'react'
import type { DatedRecord } from '@/lib/cv-data'

interface DocumentSectionProps {
  id: string
  title: string
  description?: ReactNode
  keepTogether?: boolean
  children: ReactNode
}

export function DocumentSection({
  id,
  title,
  description,
  keepTogether = false,
  children,
}: DocumentSectionProps) {
  return (
    <section
      className={`cv-section${keepTogether ? ' cv-print-together' : ''}`}
      aria-labelledby={id}
    >
      <header className="cv-section-heading">
        <h2 id={id}>{title}</h2>
        {description && <p className="cv-section-description">{description}</p>}
      </header>
      <div className="cv-section-content">{children}</div>
    </section>
  )
}

export function RecordList({ entries }: { entries: DatedRecord[] }) {
  return (
    <ul className="cv-records">
      {entries.map((entry) => (
        <li className="cv-record" key={entry.title}>
          <span>{entry.title}</span>
          <span className="cv-entry-period">{entry.period}</span>
        </li>
      ))}
    </ul>
  )
}
