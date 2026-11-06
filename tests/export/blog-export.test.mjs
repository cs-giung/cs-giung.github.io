import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import { getAllBlogPosts, getBlogPostData } from '../../lib/blog-posts.ts'
import { getBlogLinks } from '../../lib/blog-links.ts'
import { blogRedirects, resolveBlogSlug } from '../../lib/blog-redirects.ts'

const read = (path) => fs.readFileSync(`out/${path}`, 'utf8')
const posts = getAllBlogPosts()
const baseUrl = 'https://cs-giung.github.io'
const escapeHtml = (text) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#x27;')
const groupsIn = (html) => [
  ...html.matchAll(/<ul\b[^>]*data-blog-group="([^"]+)"[^>]*>([\s\S]*?)<\/ul>/g),
]

// Run after npm run build; these inspect actual GitHub Pages artifacts.
test('Blog lists every published article/link, not drafts or legacy aliases', () => {
  const html = read('blog/index.html')
  for (const post of posts) assert(html.includes(`href="/blog/${post.slug}/"`), post.slug)
  for (const link of getBlogLinks()) assert(html.includes(`href="${link.url}"`), link.title)
  for (const slug of Object.keys(blogRedirects))
    assert(!html.includes(`href="/blog/${slug}/"`), slug)
  assert(!html.includes('href="/reading'))
  assert(!html.includes('testing-blog-post'))
  assert(!fs.existsSync('out/blog/testing-blog-post/index.html'))
  assert(!fs.existsSync('out/reading/testing-blog-post/index.html'))
})

test('two rounded frames each separate their two lists with one matching rule', () => {
  const html = read('blog/index.html')
  assert.equal((html.match(/data-blog-panel="/g) || []).length, 2)
  const own = html.match(/<section\b[^>]*data-blog-panel="own"[^>]*>([\s\S]*?)<\/section>/)?.[1]
  const reading = html.match(
    /<section\b[^>]*data-blog-panel="reading"[^>]*>([\s\S]*?)<\/section>/,
  )?.[1]
  assert(own && reading)
  assert.equal((own.match(/<hr\b/g) || []).length, 1)
  assert.equal((reading.match(/<hr\b/g) || []).length, 1)
  assert(own.indexOf('data-blog-group="articles"') < own.indexOf('<hr'))
  assert(own.indexOf('<hr') < own.indexOf('data-blog-group="notes"'))
  assert(reading.indexOf('data-blog-group="reading"') < reading.indexOf('<hr'))
  assert(reading.indexOf('<hr') < reading.indexOf('data-blog-group="links"'))
  assert.equal(
    own.match(/<hr\b[^>]*class="([^"]+)"/)?.[1],
    reading.match(/<hr\b[^>]*class="([^"]+)"/)?.[1],
  )
  assert.deepEqual(
    groupsIn(html).map(([, id]) => id),
    ['articles', 'notes', 'reading', 'links'],
  )
  assert.equal((html.match(/<h2\b/g) || []).length, posts.length + getBlogLinks().length)
  assert(!html.includes('data-mailbox'))
  assert(!html.includes('data-post-reference'))
  assert(!html.includes('type="checkbox"'))
  assert(html.includes('p-[var(--card-padding)]'))
})

test('all articles and notes remain discoverable without visible category headings', () => {
  const groups = groupsIn(read('blog/index.html'))
  for (const post of posts) {
    const expected = { article: 'articles', note: 'notes', excerpt: 'reading' }[post.type]
    for (const [, id, content] of groups)
      assert.equal(content.includes(`href="/blog/${post.slug}/"`), id === expected, post.slug)
  }
  for (const link of getBlogLinks())
    for (const [, id, content] of groups)
      assert.equal(content.includes(`href="${link.url}"`), id === 'links', link.title)
})

test('every entry has a title, date and unabridged wrapping description', () => {
  const html = read('blog/index.html')
  for (const post of posts)
    if (post.description?.trim())
      assert(html.includes(escapeHtml(post.description.trim())), post.slug)
  for (const link of getBlogLinks())
    if (link.note) assert(html.includes(escapeHtml(link.note)), link.title)
  assert.equal((html.match(/<time\b/g) || []).length, posts.length + getBlogLinks().length)
  assert(html.includes('whitespace-normal break-words'))
  assert(!/truncate|line-clamp-|text-ellipsis|mailbox-/.test(html))
  const rows = [...html.matchAll(/<li\b[^>]*data-blog-entry=""[^>]*>([\s\S]*?)<\/li>/g)]
  for (const [, row] of rows) assert(row.includes('<h2') && row.includes('<time'))
})

test('entry headings read title · author · date, omitting the repeated site author', () => {
  const groups = groupsIn(read('blog/index.html'))
  assert(!groups[0][2].includes('data-post-author'))
  assert(!groups[1][2].includes('data-post-author'))
  const readingRows = groups
    .slice(2)
    .flatMap(([, , content]) => [
      ...content.matchAll(/<li\b[^>]*data-blog-entry=""[^>]*>([\s\S]*?)<\/li>/g),
    ])
  for (const [, row] of readingRows) {
    assert(row.includes('post-list-meta'))
    assert(row.includes('data-post-author=""'))
    assert(row.includes('·'))
    assert(row.indexOf('</h2>') < row.indexOf('data-post-author'))
    assert(row.indexOf('data-post-author') < row.indexOf('<time'))
  }
  const orwell = readingRows.find(([, row]) => row.includes('the-function-of-the-machine'))?.[1]
  assert(orwell?.includes('George Orwell'))
  assert(orwell.includes('dateTime="1937"') || orwell.includes('datetime="1937"'))
})

test('only blue titles link to articles, preserving native link behavior', () => {
  const html = read('blog/index.html')
  const rows = [...html.matchAll(/<li\b[^>]*data-link-kind="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)]
  assert.equal(rows.length, posts.length + getBlogLinks().length)
  for (const [, kind, row] of rows) {
    assert(!row.includes('<svg'))
    const heading = row.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1]
    assert(heading?.includes('<a'))
    assert(heading.includes('text-link'))
    assert(heading.includes('blog-title-link'))
    assert(row.indexOf('</a>') < row.indexOf('post-list-meta'))
    const description = row.match(/<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1]
    if (description) assert(!description.includes('<a'))
    if (kind === 'internal') {
      assert(!row.includes('target="_blank"'))
      assert(row.includes('href="/blog/'))
    } else {
      assert(row.includes('target="_blank"'))
      assert(row.includes('rel="noopener noreferrer"'))
      assert(row.includes('opens in a new tab'))
    }
  }
  assert.equal(rows.filter(([, kind]) => kind === 'external').length, 2)
  assert.equal(rows.filter(([, kind]) => kind === 'pdf').length, 0)
})

test('essays precede notes, then excerpts precede external links with each list newest-first', () => {
  const groups = groupsIn(read('blog/index.html'))
  const hrefsIn = (content) =>
    [...content.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((match) => match[1])
  assert.deepEqual(
    hrefsIn(groups[0][2]),
    posts.filter((post) => post.type === 'article').map((post) => `/blog/${post.slug}/`),
  )
  assert.deepEqual(
    hrefsIn(groups[1][2]),
    posts.filter((post) => post.type === 'note').map((post) => `/blog/${post.slug}/`),
  )
  const dates = new Map([
    ...posts.map((post) => [`/blog/${post.slug}/`, new Date(post.date).getTime()]),
    ...getBlogLinks().map((link) => [link.url, new Date(link.date).getTime()]),
  ])
  assert.deepEqual(
    hrefsIn(groups[2][2]),
    posts.filter((post) => post.type === 'excerpt').map((post) => `/blog/${post.slug}/`),
  )
  assert.deepEqual(
    hrefsIn(groups[3][2]),
    [...getBlogLinks()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((link) => link.url),
  )
  for (const [, id, content] of groups.slice(2)) {
    const timestamps = hrefsIn(content).map((href) => dates.get(href))
    assert(timestamps.every(Number.isFinite), id)
    assert.deepEqual(
      timestamps,
      [...timestamps].sort((a, b) => b - a),
      id,
    )
  }
})

test('canonical PDFs retain their reviewed content and kebab-case filenames', () => {
  const canonical = new Set([
    '/you-and-your-research.pdf',
    '/advice-to-a-young-mathematician.pdf',
    '/the-hardware-lottery.pdf',
  ])
  for (const url of canonical) {
    assert.match(url, /^\/[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/)
    assert(fs.lstatSync(`public${url}`).isFile(), url)
    assert.equal(fs.readFileSync(`out${url}`).subarray(0, 5).toString(), '%PDF-')
    assert(fs.readFileSync(`out${url}`).equals(fs.readFileSync(`public${url}`)))
  }
})

test('Hamming opens as an internal excerpt while its complete PDF remains a source', () => {
  const listing = read('blog/index.html')
  const rows = [...listing.matchAll(/<li\b[^>]*data-link-kind="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)]
  const matching = rows.filter(([, , row]) => row.includes('You and your research'))
  assert.equal(matching.length, 1)
  assert.equal(matching[0][1], 'internal')
  assert(matching[0][2].includes('href="/blog/you-and-your-research/"'))
  assert(matching[0][2].includes('Richard Hamming'))
  assert(!listing.includes('href="/you-and-your-research.pdf"'))

  const html = read('blog/you-and-your-research/index.html')
  assert(html.includes('href="https://cs-giung.github.io/you-and-your-research.pdf"'))
  assert(html.includes('transcript edited by J. F. Kaiser'))
  assert.equal((html.match(/<p>\[…\]<\/p>/g) || []).length, 7)
  assert(!html.includes('aria-label="Table of contents"'))
  assert(read('sitemap.xml').includes(`${baseUrl}/blog/you-and-your-research/`))
})

test('Hardware Lottery opens as an internal excerpt with its source PDF preserved', () => {
  const listing = read('blog/index.html')
  const rows = [...listing.matchAll(/<li\b[^>]*data-link-kind="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)]
  const matching = rows.filter(([, , row]) => row.includes('The hardware lottery'))
  assert.equal(matching.length, 1)
  assert.equal(matching[0][1], 'internal')
  assert(matching[0][2].includes('href="/blog/the-hardware-lottery/"'))
  assert(matching[0][2].includes('Sara Hooker'))
  assert(!listing.includes('href="/the-hardware-lottery.pdf"'))

  const html = read('blog/the-hardware-lottery/index.html')
  assert(html.includes('href="https://cs-giung.github.io/the-hardware-lottery.pdf"'))
  assert(html.includes('arXiv:2009.06489v2'))
  assert.equal((html.match(/<p>\[…\]<\/p>/g) || []).length, 3)
  assert(!html.includes('aria-label="Table of contents"'))
  assert(read('sitemap.xml').includes(`${baseUrl}/blog/the-hardware-lottery/`))
})

test('Advice opens as a five-contributor excerpt with its complete PDF available', () => {
  const listing = read('blog/index.html')
  const rows = [...listing.matchAll(/<li\b[^>]*data-link-kind="([^"]+)"[^>]*>([\s\S]*?)<\/li>/g)]
  const matching = rows.filter(([, , row]) => row.includes('Advice to a young mathematician'))
  assert.equal(matching.length, 1)
  assert.equal(matching[0][1], 'internal')
  assert(matching[0][2].includes('href="/blog/advice-to-a-young-mathematician/"'))
  assert(!listing.includes('href="/advice-to-a-young-mathematician.pdf"'))

  const html = read('blog/advice-to-a-young-mathematician/index.html')
  assert(html.includes('href="https://cs-giung.github.io/advice-to-a-young-mathematician.pdf"'))
  for (const contributor of [
    'I. Sir Michael Atiyah',
    'II. Béla Bollobás',
    'III. Alain Connes',
    'IV. Dusa McDuff',
    'V. Peter Sarnak',
  ])
    assert(html.includes(`<strong>${contributor}</strong>`), contributor)
  assert(html.includes('(i) A “dream”:'))
  assert(html.includes('(ii) Some very worthwhile problems'))
  assert(html.includes('(i) When learning an area'))
  assert.equal((html.match(/<p>\[…\]<\/p>/g) || []).length, 7)
  assert(!html.includes('aria-label="Table of contents"'))
  assert(read('sitemap.xml').includes(`${baseUrl}/blog/advice-to-a-young-mathematician/`))
})

test('article envelopes retain authors, recipients, citations and one page h1', () => {
  for (const post of posts) {
    const html = read(`blog/${post.slug}/index.html`)
    assert(html.includes(`rel="canonical" href="${baseUrl}/blog/${post.slug}/"`), post.slug)
    assert(html.includes('data-post-letter=""'), post.slug)
    const envelope = html.match(/<dl\b[^>]*data-post-envelope=""[^>]*>([\s\S]*?)<\/dl>/)?.[1]
    assert(envelope, post.slug)
    assert(envelope.includes(escapeHtml(post.title)), post.slug)
    assert(envelope.includes(post.date), post.slug)
    assert(envelope.includes(`<dt>From:</dt><dd>${escapeHtml(post.author)}</dd>`), post.slug)
    assert(
      envelope.includes(
        `<dt>To:</dt><dd>${post.author === 'Giung Nam' ? 'You' : 'Giung Nam'}</dd>`,
      ),
      post.slug,
    )
    assert.equal(envelope.includes('<dt>CC:</dt>'), post.author !== 'Giung Nam', post.slug)
    assert.equal((html.match(/<h1\b/g) || []).length, 1, post.slug)
    const article = html.match(/<article\b[^>]*data-post-letter=""[^>]*>([\s\S]*?)<\/article>/)?.[1]
    assert(article?.includes('Back to blog'), post.slug)
    assert.equal((html.match(/Back to blog<\/a>/g) || []).length, 1, post.slug)
    const sources = [...envelope.matchAll(/<li data-post-source="">([\s\S]*?)<\/li>/g)]
    assert.equal(sources.length, post.sources.length)
    post.sources.forEach((source, index) => {
      assert(sources[index][1].includes(escapeHtml(source.title)), post.slug)
      if (source.url)
        assert(sources[index][1].includes(`href="${escapeHtml(source.url)}"`), post.slug)
      else assert(!sources[index][1].includes('<a'), post.slug)
    })
  }
})

test('contents and footnotes have unique working fragment targets and no duplicated notes', () => {
  for (const post of posts) {
    const html = read(`blog/${post.slug}/index.html`)
    assert(!html.includes('class="katex-error"'), `Invalid math in ${post.slug}`)
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    assert.equal(new Set(ids).size, ids.length, post.slug)
    for (const [, target] of html.matchAll(/href="#([^"]+)"/g))
      assert(ids.includes(decodeURIComponent(target)), `${post.slug}: ${target}`)
    const body = html.match(/<div\b[^>]*data-post-body=""[^>]*>([\s\S]*?)<\/article>/)?.[1]
    assert(body, post.slug)
    assert.equal(html.includes('aria-label="Table of contents"'), /<h[23]\b/.test(body), post.slug)
    const hasNotes = /^\[\^[^\]]+\]:/m.test(getBlogPostData(post.slug).content)
    assert.equal(
      (html.match(/<section\b[^>]*data-footnotes/g) || []).length,
      hasNotes ? 1 : 0,
      post.slug,
    )
    assert.equal(html.includes('class="post-footnotes"'), hasNotes, post.slug)
    assert(!body.includes('data-footnotes'), post.slug)
    if (hasNotes) {
      assert(html.includes('data-footnote-ref="true"'), post.slug)
      assert(
        html.includes('data-footnote-backref=""') || html.includes('data-footnote-backref="true"'),
        post.slug,
      )
    }
    assert(!html.includes('testing-blog-post'), post.slug)
  }
  assert(read('blog/notes-on-diffusion-models/index.html').includes('class="katex"'))
})

test('fonts and licenses are self-hosted, including interface faces and the CJK subset', () => {
  const css = fs
    .readdirSync('out/_next/static', { recursive: true })
    .filter((name) => name.endsWith('.css'))
    .map((name) => read(`_next/static/${name}`))
    .join('\n')
  for (const file of [
    'departure-mono/DepartureMono-Regular.woff2',
    'source-serif-4/SourceSerif4-Latin.woff2',
    'source-serif-4/SourceSerif4-Latin-Italic.woff2',
    'noto-serif-tc/NotoSerifTC-Blog.woff2',
  ]) {
    assert.equal(fs.readFileSync(`out/fonts/${file}`).subarray(0, 4).toString(), 'wOF2', file)
    assert(css.includes(`/fonts/${file}`), file)
  }
  for (const directory of ['departure-mono', 'source-serif-4', 'noto-serif-tc'])
    assert(read(`fonts/${directory}/OFL.txt`).includes('SIL OPEN FONT LICENSE'))
  for (const post of posts)
    assert(
      read(`blog/${post.slug}/index.html`).includes('data-post-body="" class="post-letter-body"'),
      post.slug,
    )
  assert(css.includes('Source Serif 4'))
  assert(css.includes('Blog CJK'))
  for (const license of ['OFL.txt', 'OFL-Mono.txt']) {
    assert(read(`fonts/geist/${license}`).includes('SIL OPEN FONT LICENSE'))
  }
  assert(!fs.existsSync('out/fonts/geist/Geist-Latin.woff2'))
  assert(!fs.existsSync('out/fonts/geist/GeistMono-Latin.woff2'))
})

test('legacy Reading/Blog URLs export direct no-JS redirects with fallback links', () => {
  for (const slug of ['', ...posts.map((post) => post.slug), ...Object.keys(blogRedirects)]) {
    const file = slug ? `reading/${slug}/index.html` : 'reading/index.html'
    const target = slug ? `/blog/${resolveBlogSlug(slug)}/` : '/blog/'
    const html = read(file)
    assert(html.includes(`http-equiv="refresh" content="0;url=${target}"`), file)
    assert(html.includes(`href="${target}"`), file)
    assert(html.includes(`rel="canonical" href="${baseUrl}${target}"`), file)
    assert(html.includes('content="noindex, follow"'), file)
  }
  for (const [oldSlug, target] of Object.entries(blogRedirects)) {
    const html = read(`blog/${oldSlug}/index.html`)
    assert(html.includes(`http-equiv="refresh" content="0;url=/blog/${target}/"`), oldSlug)
    assert(html.includes('content="noindex, follow"'), oldSlug)
    assert(!html.includes('data-post-letter'), oldSlug)
  }
})

test('the sitemap contains canonical published articles, not drafts or legacy URLs', () => {
  const xml = read('sitemap.xml')
  for (const post of posts)
    assert(xml.includes(`<loc>${baseUrl}/blog/${post.slug}/</loc>`), post.slug)
  for (const slug of Object.keys(blogRedirects))
    assert(!xml.includes(`<loc>${baseUrl}/blog/${slug}/</loc>`), slug)
  assert(!xml.includes('testing-blog-post'))
  assert(!xml.includes('/reading'))
  assert(read('sitemap_index.xml').includes(`<loc>${baseUrl}/sitemap.xml</loc>`))
})
