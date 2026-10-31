import assert from 'node:assert/strict'
import test from 'node:test'
import { parseFrontmatter } from '../../lib/content-data.ts'
import { parseBlogPostData, getBlogPostData } from '../../lib/blog-posts.ts'

test('YAML frontmatter preserves the body, quoted dates, and literal separators', () => {
  const body = '\n## A heading\n\n```text\n---\n```\n\nFinal text.\n'
  const source = '\uFEFF---\ntitle: "An article"\ndate: "1934"\ndraft: true\n---\n' + body
  const result = parseFrontmatter(source)
  assert.equal(result.metadata.date, '1934')
  assert.equal(result.metadata.draft, true)
  assert.equal(result.content, body)
})

test('CRLF content and Markdown punctuation remain unchanged', () => {
  const result = parseFrontmatter('---\r\ntitle: Test\r\n---\r\n\r\nA *quote*; $x^2$.\r\n')
  assert.equal(result.content, '\r\nA *quote*; $x^2$.\r\n')
})

test('invalid or duplicate metadata fails with a useful authoring error', () => {
  assert.throws(() => parseFrontmatter('No frontmatter'), /Missing YAML/)
  assert.throws(() => parseFrontmatter('---\ntitle: Test'), /Unclosed YAML/)
  assert.throws(() => parseFrontmatter('---\n- one\n- two\n---\n'), /mapping/)
  assert.throws(() => parseFrontmatter('---\ntitle: A\ntitle: B\n---\n'), /unique|duplicate/i)
})

test('post validation rejects invalid dates, booleans, and source records', () => {
  const post = (metadata) => `---\ntitle: Test\ndate: "2026-03-07"\n${metadata}\n---\nBody.\n`
  assert.throws(() => parseBlogPostData('test', post('draft: "false"')), /boolean/)
  assert.throws(() => parseBlogPostData('test', post('type: unknown')), /Invalid post type/)
  assert.throws(() => parseBlogPostData('test', post('sources: [123]')), /source needs a title/i)
  assert.throws(
    () => parseBlogPostData('test', '---\ntitle: Test\ndate: "2026-02-30"\n---\nBody'),
    /Invalid post date/,
  )
  assert.throws(() => getBlogPostData('../package'), /Invalid article slug/)
  assert.equal(parseBlogPostData('test', post('type: note\ndescription: "A summary"')).type, 'note')
})
