import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

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

export interface Education {
  title: string
  subtitle: string
  period: string
  location: string
  details: string[]
}

export interface Position {
  title: string
  subtitle: string
  period: string
  location: string
  details: string[]
}

export interface Publication {
  title: string
  authors: string
  venue: string
  year: number
  url?: string
  note?: string
}


export interface CVData {
  personal: PersonalInfo
  education: Education[]
  position: Position[]
  publication: Publication[]
}

export function getCVData(): CVData {
  const filePath = path.join(process.cwd(), 'data', 'cv.yaml')
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const cvData = yaml.load(fileContents) as CVData
  return cvData
}
