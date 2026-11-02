import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { getAllBlogPosts, getBlogPostData } from '../../lib/blog-posts.ts'
import { inspectPublicEntry } from '../../scripts/check-public-release.mjs'

const figures = [
  ['aspects-of-scientific-method', 'png'],
  ['the-machine-of-speculative-knowledge', 'jpg'],
]

test('local Blog figure filenames use their post slug and a figure number', () => {
  for (const post of getAllBlogPosts()) {
    const { content } = getBlogPostData(post.slug)
    for (const [, url] of content.matchAll(/!\[[^\]]*\]\((\/[^)\s]+)/g)) {
      const filename = path.posix.basename(url)
      assert.match(
        filename,
        new RegExp(`^${post.slug}-figure-[1-9]\\d*\\.(?:png|jpe?g|gif|webp|svg|avif)$`),
      )
      assert(fs.existsSync(`public${url}`), url)
    }
  }
})

test('Blog figures are reviewed regular files referenced by their canonical URLs', () => {
  for (const [slug, extension] of figures) {
    const filename = `${slug}-figure-1.${extension}`
    const file = `public/${filename}`
    assert(fs.lstatSync(file).isFile(), file)
    assert.deepEqual(inspectPublicEntry(file, fs.readFileSync(file)), [])
    const { content } = getBlogPostData(slug)
    assert(content.includes(`](/${filename})`), slug)
  }
})
