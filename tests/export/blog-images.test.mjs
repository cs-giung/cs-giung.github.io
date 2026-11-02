import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const figures = [
  ['aspects-of-scientific-method', 'png'],
  ['the-machine-of-speculative-knowledge', 'jpg'],
]

test('exported articles use canonical figure names and preserve the original bytes', () => {
  for (const [slug, extension] of figures) {
    const filename = `${slug}-figure-1.${extension}`
    const html = fs.readFileSync(`out/blog/${slug}/index.html`, 'utf8')
    assert(html.includes(`src="/${filename}"`), slug)
    const original = fs.readFileSync(`public/${filename}`)
    assert.deepEqual(fs.readFileSync(`out/${filename}`), original)
  }
})
