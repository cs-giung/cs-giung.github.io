import assert from 'node:assert/strict'
import test from 'node:test'
import { getCVData, getPublicationGroups } from '../../lib/cv-data.ts'

const cv = getCVData()

test('document metadata is explicit and both pages share one source email', () => {
  assert.match(cv.document.updated, /^\d{4}-\d{2}-\d{2}$/)
  assert.equal(new Date(cv.document.updated).toISOString().slice(0, 10), cv.document.updated)
  assert.match(cv.personal.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  assert(cv.document.affiliation)
  assert(cv.personal.about.length > 0)
  assert(!Object.hasOwn(cv.document, 'email'))
})

test('CV data contains published career records without unused research notes or hidden dates', () => {
  assert(!Object.hasOwn(cv, 'research'))
  for (const entry of [...cv.honors, ...cv.teaching, ...cv.talks])
    assert.match(entry.period, /^\d{4}$/)
  for (const entries of [
    cv.honors,
    cv.service.leadership,
    cv.service.reviewing,
    cv.service.recognition,
  ]) {
    assert(entries.length > 0)
    for (const entry of entries) assert(entry.title && entry.period)
  }
  for (const honor of cv.honors) assert(honor.organization && honor.description)
  assert(cv.teaching.length > 0)
  for (const course of cv.teaching) {
    assert(course.course && course.institution && course.instructor && course.role && course.period)
  }
  assert(cv.talks.length > 0)
  for (const talk of cv.talks) assert(talk.event && talk.location && talk.period)
})

test('academic service lists individual years and orders newer starts first without filling gaps', () => {
  for (const entries of Object.values(cv.service)) {
    for (const entry of entries) {
      const years = entry.period.split(', ')
      assert(
        years.every((year) => /^\d{4}$/.test(year)),
        entry.period,
      )
      assert.equal(new Set(years).size, years.length)
      assert.deepEqual(years, [...years].sort())
    }
    const starts = entries.map((entry) => Number(entry.period.split(', ')[0]))
    assert.deepEqual(
      starts,
      [...starts].sort((a, b) => b - a),
    )
  }
  assert.equal(cv.service.reviewing.find((entry) => entry.title === 'AAAI').period, '2025, 2027')
})

test('career and education entries have required fields and consistent date-range typography', () => {
  for (const entry of [...cv.position, ...cv.education]) {
    assert(entry.title && entry.subtitle && entry.period)
    assert(!/\d{4}\s+-\s+/.test(entry.period), `Use an en dash for the period: ${entry.period}`)
    assert(entry.details === undefined || Array.isArray(entry.details))
  }
})

test('every publication has an explicit category and is rendered exactly once', () => {
  const kinds = new Set(['conference', 'journal', 'workshop', 'preprint'])
  const titles = new Set()
  for (const paper of cv.publication) {
    assert(kinds.has(paper.kind), `Unknown category: ${paper.title}`)
    assert(paper.title && paper.authors && paper.venue)
    assert(Number.isInteger(paper.year))
    assert.equal(paper.kind === 'preprint', paper.status === 'preprint', paper.title)
    assert(!titles.has(paper.title), `Duplicate paper: ${paper.title}`)
    titles.add(paper.title)
  }
  const groups = getPublicationGroups(cv.publication)
  const grouped = groups.flatMap((group) => group.publications)
  assert.equal(grouped.length, cv.publication.length)
  assert.equal(new Set(grouped).size, cv.publication.length)
  assert.deepEqual(
    groups.map((group) => group.prefix),
    ['C', 'J', 'W', 'P'],
  )
})

test('grouping is newest-first, stable within a year, and does not mutate its input', () => {
  const paper = (title, year, kind = 'conference') => ({ title, year, kind })
  const input = [
    paper('old', 2021),
    paper('new-a', 2026),
    paper('new-b', 2026),
    paper('draft', 2027, 'preprint'),
  ]
  const original = [...input]
  const groups = getPublicationGroups(input)
  assert.deepEqual(input, original)
  assert.deepEqual(
    groups.map((group) => group.prefix),
    ['C', 'P'],
  )
  assert.deepEqual(
    groups[0].publications.map((item) => item.title),
    ['new-a', 'new-b', 'old'],
  )
  assert.deepEqual(getPublicationGroups([]), [])
})
