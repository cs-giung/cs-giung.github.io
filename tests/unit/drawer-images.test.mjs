import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { drawerImages } from '../../lib/drawer-data.ts'
import { inspectPublicEntry } from '../../scripts/check-public-release.mjs'

test('Drawer records have valid dimensions, descriptions, and HTTPS sources', () => {
  for (const entry of drawerImages) {
    assert(Number.isInteger(entry.year) && entry.year > 0, entry.src)
    assert(Number.isInteger(entry.width) && entry.width > 0, entry.src)
    assert.equal(entry.height, 512, entry.src)
    for (const key of ['title', 'alt', 'credit']) assert(entry[key].trim(), `${entry.src}: ${key}`)
    assert.equal(new URL(entry.source).protocol, 'https:', entry.src)
  }
})

test('Drawer filenames combine their year with the final WebP content hash', () => {
  const sources = drawerImages.map((entry) => entry.src)
  assert.equal(new Set(sources).size, sources.length)
  for (const entry of drawerImages) {
    assert.match(entry.src, /^\/drawer\/\d{4}s?-[a-f0-9]{8}\.webp$/)
    const bytes = fs.readFileSync(`public${entry.src}`)
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8)
    const prefix = entry.yearLabel === `${entry.year}s` ? entry.yearLabel : String(entry.year)
    assert.equal(entry.src, `/drawer/${prefix}-${hash}.webp`)
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF')
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP')
  }
})

test('every Drawer image is documented and explicitly reviewed without leftover filenames', () => {
  const filenames = drawerImages.map((entry) => path.posix.basename(entry.src)).sort()
  assert.deepEqual(
    fs
      .readdirSync('public/drawer')
      .filter((file) => file.endsWith('.webp'))
      .sort(),
    filenames,
  )
  const notes = fs.readFileSync('public/drawer/README.md', 'utf8')
  assert.deepEqual(
    [...notes.matchAll(/^- `([^`]+\.webp)`:/gm)].map((match) => match[1]).sort(),
    filenames,
  )
  for (const filename of filenames) {
    const file = `public/drawer/${filename}`
    assert.deepEqual(inspectPublicEntry(file, fs.readFileSync(file)), [], file)
  }
})
