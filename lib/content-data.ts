import fs from 'node:fs'
import { parse } from 'yaml'

export interface Frontmatter {
  metadata: Record<string, unknown>
  content: string
}

export function parseFrontmatter(source: string, name = 'document'): Frontmatter {
  const text = source.replace(/^\uFEFF/, '')
  const opening = /^---\r?\n/.exec(text)
  if (!opening) throw new Error(`Missing YAML frontmatter in ${name}`)
  const closing = /^---[ \t]*\r?$/m.exec(text.slice(opening[0].length))
  if (!closing) throw new Error(`Unclosed YAML frontmatter in ${name}`)
  const boundary = opening[0].length + closing.index
  const metadata: unknown = parse(text.slice(opening[0].length, boundary), { uniqueKeys: true })
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new Error(`Frontmatter must be a YAML mapping in ${name}`)
  }
  const end = boundary + closing[0].length
  // Remove only the delimiter's newline, never trim the article body.
  const content = text.slice(end).replace(/^\r?\n/, '')
  return { metadata: metadata as Record<string, unknown>, content }
}

export function readYamlFile<T>(file: string): T {
  return parse(fs.readFileSync(file, 'utf8'), { uniqueKeys: true }) as T
}
