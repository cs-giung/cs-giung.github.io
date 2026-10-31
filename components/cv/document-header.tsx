import type { DocumentInfo, PersonalInfo } from '@/lib/cv-data'
import { EmailContact } from '@/components/contact/email-contact'

interface DocumentHeaderProps {
  personal: PersonalInfo
  document: DocumentInfo
}

export function DocumentHeader({ personal, document }: DocumentHeaderProps) {
  const links = [
    {
      label: 'Google Scholar',
      href: `https://scholar.google.com/citations?user=${personal.google_scholar}`,
    },
    { label: 'DBLP', href: `https://dblp.org/pid/${personal.dblp}` },
    {
      label: 'Semantic Scholar',
      href: `https://www.semanticscholar.org/author/${personal.semantic_scholar}`,
    },
    { label: 'GitHub', href: `https://github.com/${personal.github}` },
    { label: 'HuggingFace', href: `https://huggingface.co/${personal.huggingface}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/in/${personal.linkedin}` },
  ]
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
        <p className="cv-document-label">Curriculum Vitae</p>
      </div>
      <p className="cv-profile-title">{personal.title}</p>
      <p className="cv-affiliation">{document.affiliation}</p>
      <ul className="cv-contact-line" aria-label="Contact information">
        <li>
          <EmailContact address={personal.email} />
        </li>
        <li>
          <a href="https://cs-giung.github.io">cs-giung.github.io</a>
        </li>
        <li>{personal.location}</li>
      </ul>
      <div className="cv-profile-meta">
        <p className="cv-profile-links">
          {links.map((link, index) => (
            <span key={link.label}>
              {index > 0 && <span aria-hidden="true"> · </span>}
              <a href={link.href} target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </span>
          ))}
        </p>
        <p className="cv-updated">
          Updated <time dateTime={document.updated}>{updated}</time>
        </p>
      </div>
    </header>
  )
}
