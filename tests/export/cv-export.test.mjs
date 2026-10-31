import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { getCVData } from '../../lib/cv-data.ts'

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
