import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { getCVData } from '../../lib/cv-data.ts'

test('CV header omits redundant profile links while About retains them', () => {
  const html = fs.readFileSync('out/cv/index.html', 'utf8')
  const header = html.match(/<header\b[^>]*class="cv-profile"[^>]*>([\s\S]*?)<\/header>/)?.[1]
  assert(header)
  assert(!header.includes('cv-profile-links'))
  assert(header.includes('cs-giung.github.io</a>'))
  assert(header.includes('aria-label="Contact information"'))
  assert(
    header.includes(
      '<a href="https://www.seoulaihub.kr/" target="_blank" rel="noopener noreferrer">Seoul AI Hub</a>',
    ),
  )
  assert(!header.includes('Seoul, South Korea'))
  assert(header.includes(`<time dateTime="${getCVData().document.updated}">`))
  assert.match(
    header,
    /class="cv-contact-row"[\s\S]*class="cv-contact-line"[\s\S]*<\/ul><p class="cv-updated">/,
  )

  const about = fs.readFileSync('out/index.html', 'utf8')
  for (const label of [
    'Google Scholar',
    'DBLP',
    'Semantic Scholar',
    'GitHub',
    'HuggingFace',
    'LinkedIn',
  ]) {
    assert(!header.includes(label), label)
    assert(about.includes(`>${label}</a>`), label)
  }
})

test('Teaching instructors link their names to Scholar while preserving course metadata', () => {
  const html = fs.readFileSync('out/cv/index.html', 'utf8')
  const teaching = html.match(
    /<section\b[^>]*aria-labelledby="teaching"[^>]*>([\s\S]*?)<\/section>/,
  )?.[1]
  assert(teaching)
  const records = [...teaching.matchAll(/<li\b[^>]*class="cv-record"[^>]*>([\s\S]*?)<\/li>/g)]
  const courses = getCVData().teaching
  assert.equal(records.length, courses.length)
  courses.forEach((course, index) => {
    const match = course.instructor.match(
      /^\[([^\]]+)\]\((https:\/\/scholar\.google\.com\/citations\?user=[\w-]+)\)$/,
    )
    assert(match, course.course)
    const [, name, url] = match
    const record = records[index][1]
    assert(record.includes(course.course))
    assert(record.includes(course.role))
    assert(record.includes(course.institution))
    assert(record.includes('Instructor:'))
    assert(record.includes(`href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`))
    assert(!record.includes(course.instructor))
  })
  assert(teaching.includes('citations?user=RqMLVzUAAAAJ'))
})
