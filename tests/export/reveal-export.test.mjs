import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { getAllBlogPosts } from '../../lib/blog-posts.ts'
import { drawerImages } from '../../lib/drawer-data.ts'

const read = (file) => fs.readFileSync(`out/${file}`, 'utf8')
const targets = (html) => html.match(/<(?:div|section|article|li)\b[^>]*\bdata-reveal=""/g) || []

test('reveal targets are server-rendered without adding layout wrappers', () => {
  for (const [file, count] of [
    ['index.html', 2],
    ['blog/index.html', 2],
    ['cv/index.html', 1],
    ['drawer/index.html', drawerImages.length],
  ])
    assert.equal(targets(read(file)).length, count, file)
  for (const post of getAllBlogPosts()) {
    const html = read(`blog/${post.slug}/index.html`)
    assert.equal(targets(html).length, 1, post.slug)
    assert(html.includes('data-post-letter="" data-reveal=""'), post.slug)
  }
})
