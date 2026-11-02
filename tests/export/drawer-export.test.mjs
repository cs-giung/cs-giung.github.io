import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { drawerImages } from '../../lib/drawer-data.ts'
import { INITIAL_EAGER_IMAGE_COUNT } from '../../lib/drawer-loading.ts'

const read = (file) => fs.readFileSync(path.join('out', file), 'utf8')
const images = drawerImages.toSorted((a, b) => b.year - a.year)

test('Drawer exports ordered local images with unique captions and safe source links', () => {
  const html = read('drawer/index.html')
  assert.match(html, /<title>Drawer \| Giung Nam<\/title>/)
  assert.match(html, /<h1 class="sr-only">Drawer<\/h1>/)
  assert.equal((html.match(/<figure\b/g) ?? []).length, images.length)
  const captionIds = [...html.matchAll(/<figcaption\b[^>]*id="([^"]+)"/g)].map((match) => match[1])
  assert.equal(captionIds.length, images.length)
  assert.equal(new Set(captionIds).size, images.length)
  assert.deepEqual(
    [...html.matchAll(/<li\b[^>]*data-year="(\d{4})"/g)].map((match) => Number(match[1])),
    images.map((entry) => entry.year),
  )
  const links = new Map(
    [...html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>/g)].map(([tag, href]) => [href, tag]),
  )
  let previous = -1
  for (const entry of images) {
    const position = html.indexOf(`src="${entry.src}"`)
    assert(position > previous)
    previous = position
    const image = html.match(new RegExp(`<img[^>]*src="${entry.src}"[^>]*>`))?.[0]
    assert(image)
    assert(image.includes(`width="${entry.width}"`))
    assert(image.includes(`height="${entry.height}"`))
    assert(image.includes('alt="'))
    const captionId = `drawer-caption-${path.basename(entry.src, '.webp')}`
    assert(html.includes(`aria-describedby="${captionId}"`))
    const caption = html.match(
      new RegExp(`<figcaption\\b[^>]*id="${captionId}"[^>]*>([\\s\\S]*?)<\\/figcaption>`),
    )?.[1]
    assert(caption)
    assert.equal(
      caption
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
      `${entry.yearLabel ?? entry.year} · Source`,
    )
    const sourceLink = links.get(entry.source.replaceAll('&', '&amp;'))
    assert(sourceLink)
    assert(sourceLink.includes('target="_blank"'))
    assert(sourceLink.includes('rel="noopener noreferrer"'))
    const file = entry.src.slice(1)
    assert.deepEqual(
      fs.readFileSync(path.join('out', file)),
      fs.readFileSync(path.join('public', file)),
    )
  }
  assert.deepEqual(
    fs
      .readdirSync('out/drawer')
      .filter((file) => file.endsWith('.webp'))
      .sort(),
    images.map((entry) => path.posix.basename(entry.src)).sort(),
  )
  assert(html.includes('<noscript>'))
  assert(!html.includes('<iframe'))
  assert(!html.includes('img.youtube.com'))
  assert(read('sitemap.xml').includes('<loc>https://cs-giung.github.io/drawer/</loc>'))
})

test('Drawer static HTML eagerly starts a leading group and leaves the rest lazy', () => {
  const html = read('drawer/index.html')
  for (const [index, entry] of images.entries()) {
    const image = html.match(new RegExp(`<img[^>]*src="${entry.src}"[^>]*>`))?.[0]
    assert(image)
    const loading = index < INITIAL_EAGER_IMAGE_COUNT ? 'eager' : 'lazy'
    assert(image.includes(`loading="${loading}"`), entry.src)
  }
})

test('main navigation keeps About, Blog, CV, and Drawer in that order', () => {
  for (const route of ['index.html', 'blog/index.html', 'cv/index.html', 'drawer/index.html']) {
    const html = read(route)
    const navigation = html.match(
      /<nav\b[^>]*aria-label="Main navigation"[^>]*>([\s\S]*?)<\/nav>/,
    )?.[1]
    assert(navigation, route)
    assert.deepEqual(
      [...navigation.matchAll(/>(ABOUT|BLOG|CV|DRAWER)<\/a>/g)].map((match) => match[1]),
      ['ABOUT', 'BLOG', 'CV', 'DRAWER'],
    )
  }
})
