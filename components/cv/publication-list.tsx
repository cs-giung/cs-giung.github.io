import { getPublicationGroups, type Publication } from '@/lib/cv-data'
import { AuthorList } from './inline-markdown'

export function PublicationList({ publications }: { publications: Publication[] }) {
  return getPublicationGroups(publications).map((group) => (
    <div className="cv-publication-category" key={group.kind} data-kind={group.kind}>
      <h3 className="cv-subheading">{group.title}</h3>
      <ol className="cv-publications" reversed start={group.publications.length} role="list">
        {group.publications.map((paper, index) => {
          const reference = `${group.prefix}${group.publications.length - index}`
          return (
            <li
              className="cv-publication"
              id={`publication-${reference.toLowerCase()}`}
              key={paper.title}
            >
              <span className="cv-publication-reference">[{reference}]</span>
              <div>
                <h4 className="cv-publication-title">
                  {paper.url ? (
                    <a href={paper.url} target="_blank" rel="noopener noreferrer">
                      {paper.title}
                    </a>
                  ) : (
                    paper.title
                  )}
                </h4>
                <p className="cv-authors">
                  <AuthorList>{paper.authors}</AuthorList>
                </p>
                <p className="cv-citation">{paper.note || `${paper.venue}, ${paper.year}.`}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  ))
}
