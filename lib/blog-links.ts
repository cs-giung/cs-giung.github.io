import path from 'node:path'
import { readYamlFile } from './content-data.ts'

export interface BlogLink {
  title: string
  authors: string
  date: string
  url: string
  note?: string
}

export function getBlogLinks(): BlogLink[] {
  const data = readYamlFile<{ links?: BlogLink[] }>(
    path.join(process.cwd(), 'data', 'blog-links.yaml'),
  )
  return data.links || []
}
