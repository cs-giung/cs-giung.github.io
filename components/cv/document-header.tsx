import { Globe, Mail, MapPin } from 'lucide-react'
import type { DocumentInfo, PersonalInfo } from '@/lib/cv-data'
import { EmailContact } from '@/components/contact/email-contact'

interface DocumentHeaderProps {
  personal: PersonalInfo
  document: DocumentInfo
}

export function DocumentHeader({ personal, document }: DocumentHeaderProps) {
  const updated = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${document.updated}T00:00:00Z`))

  return (
    <header className="cv-profile">
      <div className="cv-identity-heading">
        <h1>{personal.name}</h1>
        <div className="cv-document-meta">
          <p className="cv-document-label">Curriculum Vitae</p>
          <p className="cv-updated">
            Updated <time dateTime={document.updated}>{updated}</time>
          </p>
        </div>
      </div>
      <p className="cv-profile-title">{personal.title}</p>
      <p className="cv-affiliation">{document.affiliation}</p>
      <ul className="cv-contact-line" aria-label="Contact information">
        <li>
          <Mail className="cv-contact-icon" aria-hidden="true" />
          <EmailContact address={personal.email} />
        </li>
        <li>
          <Globe className="cv-contact-icon" aria-hidden="true" />
          <a href="https://cs-giung.github.io">cs-giung.github.io</a>
        </li>
        <li>
          <MapPin className="cv-contact-icon" aria-hidden="true" />
          {personal.location}
        </li>
      </ul>
    </header>
  )
}
