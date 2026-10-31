import path from 'node:path'
import { readYamlFile } from './content-data.ts'

export interface PersonalInfo {
  name: string
  title: string
  email: string
  github: string
  huggingface: string
  google_scholar: string
  semantic_scholar: string
  dblp: string
  linkedin: string
  location: string
  profile_image: string
  about: string[]
}

export interface DocumentInfo {
  updated: string
  affiliation: string
}

export interface CareerEntry {
  title: string
  subtitle: string
  period: string
  location?: string
  mentors?: string
  collaborators?: string
  facilitators?: string
  details?: string[]
}

export interface Education extends CareerEntry {
  gpa?: string
}

export type Position = CareerEntry

export interface DatedRecord {
  title: string
  period: string
}

export interface Honor extends DatedRecord {
  organization: string
  description: string
}

export interface Teaching {
  course: string
  institution: string
  instructor: string
  role: string
  period: string
}

export interface Talk {
  event: string
  location: string
  period: string
}

export interface Publication {
  title: string
  authors: string
  venue: string
  kind: 'conference' | 'journal' | 'workshop' | 'preprint'
  status?: 'preprint' | 'published'
  year: number
  url?: string
  note?: string
}

export interface CVData {
  document: DocumentInfo
  personal: PersonalInfo
  honors: Honor[]
  service: {
    leadership: DatedRecord[]
    reviewing: DatedRecord[]
    recognition: DatedRecord[]
  }
  teaching: Teaching[]
  talks: Talk[]
  education: Education[]
  position: Position[]
  publication: Publication[]
}

export function getPublicationGroups(publications: Publication[]) {
  const categories = [
    { kind: 'conference', title: 'Conference Papers', prefix: 'C' },
    { kind: 'journal', title: 'Journal Articles', prefix: 'J' },
    { kind: 'workshop', title: 'Workshop Contributions', prefix: 'W' },
    { kind: 'preprint', title: 'Preprints', prefix: 'P' },
  ] as const

  return categories
    .map((category) => ({
      ...category,
      // A stable sort preserves the source order within each year.
      publications: publications
        .filter((paper) => paper.kind === category.kind)
        .sort((a, b) => b.year - a.year),
    }))
    .filter((category) => category.publications.length > 0)
}

export function getCVData(): CVData {
  return readYamlFile<CVData>(path.join(process.cwd(), 'data', 'cv.yaml'))
}
