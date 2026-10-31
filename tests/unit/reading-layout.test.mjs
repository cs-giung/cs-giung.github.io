import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { rehypeReadingLayout } from '../../lib/reading-layout.ts'

function render(content) {
  return renderToStaticMarkup(
    React.createElement(
      Markdown,
      {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeReadingLayout, rehypeKatex],
      },
      content,
    ),
  )
}

test('one syntax tree supplies stable unique headings and a left-hand contents list', () => {
  const html = render('# Introduction\n\n## Same\n\n### Nested\n\n## Same\n\n## 靑出於藍')
  assert(html.includes('aria-label="Table of contents"'))
  assert(html.includes('id="same"'))
  assert(html.includes('id="same-2"'))
  assert(html.includes('id="靑出於藍"'))
  assert(html.includes('post-toc-nested'))
  assert(!html.includes('<h1'))
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length)
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g))
    assert(ids.includes(decodeURIComponent(target)), target)
})

test('footnotes move to the right once, keeping IDs, references and backlinks', () => {
  const html = render(
    '## A heading\n\nReference[^one] and a repeated reference[^one].\n\n[^one]: A note with [a source](https://example.com).',
  )
  assert.equal((html.match(/<aside\b/g) || []).length, 1)
  assert.equal((html.match(/<section\b[^>]*data-footnotes/g) || []).length, 1)
  assert.equal((html.match(/A note with/g) || []).length, 1)
  assert(html.indexOf('data-post-main') < html.indexOf('post-footnotes'))
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
  assert.equal(new Set(ids).size, ids.length)
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g))
    assert(ids.includes(decodeURIComponent(target)), target)
  const toc = html.match(/<nav[\s\S]*?<\/nav>/)?.[0]
  assert(!toc.includes('Footnotes'))
  assert(!html.includes('sr-only'))
})

test('the licensed self-hosted CJK subset covers every Han character in the posts', () => {
  const manifest = JSON.parse(fs.readFileSync('public/fonts/noto-serif-tc/subset.json', 'utf8'))
  const characters = [
    ...new Set(
      fs
        .readdirSync('data/blog')
        .filter((file) => file.endsWith('.md'))
        .flatMap((file) =>
          [...fs.readFileSync(`data/blog/${file}`, 'utf8')].filter((char) =>
            /\p{Script=Han}/u.test(char),
          ),
        ),
    ),
  ]
    .sort()
    .join('')
  assert.equal(
    manifest.characters,
    characters,
    'Run npm run fonts:blog-cjk when adding Han characters',
  )
  const font = fs.readFileSync('public/fonts/noto-serif-tc/NotoSerifTC-Blog.woff2')
  assert.equal(font.subarray(0, 4).toString(), 'wOF2')
  assert.equal(createHash('sha256').update(font).digest('hex'), manifest.sha256)
  assert(
    fs.readFileSync('public/fonts/noto-serif-tc/OFL.txt', 'utf8').includes('SIL OPEN FONT LICENSE'),
  )
})

test('short articles omit empty sidebars and math/code still render', () => {
  const short = render('Just a paragraph.')
  assert(!short.includes('<nav'))
  assert(!short.includes('<aside'))
  const rich = render('## Formula\n\n$E=mc^2$\n\n```python\nprint("hello")\n```')
  assert(rich.includes('class="katex"'))
  assert(rich.includes('language-python'))
  assert(rich.includes('print('))
})
