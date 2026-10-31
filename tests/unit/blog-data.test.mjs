import assert from 'node:assert/strict'
import fs from 'node:fs'
import { parseFrontmatter } from '../../lib/content-data.ts'
import test from 'node:test'
import {
  getAllBlogPosts,
  getBlogPostData,
  getAllBlogPostSlugs,
  getAdjacentBlogPosts,
  parseBlogPostData,
} from '../../lib/blog-posts.ts'
import { getBlogLinks } from '../../lib/blog-links.ts'
import { blogRedirects, resolveBlogSlug } from '../../lib/blog-redirects.ts'

const legacySlugs = [
  'Swift1726',
  'Galton1907',
  'Vygotsky1934',
  'Orwell1937',
  'Box1976',
  'Rubin1984',
  'Hawking1988',
  'Spolsky2001',
  'James2013',
  'LaFrance2015',
  'Katz2016',
  'Karpathy2017',
  'Chollet2017',
  'Sutton2019',
]

const posts = getAllBlogPosts()

test('all former Reading notes live in Blog with their excerpts and content', () => {
  for (const legacySlug of legacySlugs) {
    const slug = resolveBlogSlug(legacySlug)
    assert.equal(posts.filter((post) => post.slug === slug).length, 1, slug)
    const post = getBlogPostData(slug)
    assert.equal(post.category, 'Notes & Scribbles')
    assert(post.title && post.author && post.date && post.description && post.content.trim(), slug)
  }
  assert(!fs.existsSync('data/posts'))
  assert(!fs.existsSync('data/reading.yaml'))
})

test('every article has one static Blog route and is sorted newest-first', () => {
  const slugs = getAllBlogPostSlugs().map((path) => path.params.slug)
  assert.equal(new Set(slugs).size, posts.length)
  assert.deepEqual([...slugs].sort(), posts.map((post) => post.slug).sort())
  for (let index = 0; index < posts.length; index++) {
    const post = posts[index]
    assert(['Posts', 'Notes & Scribbles'].includes(post.category), post.slug)
    if (index > 0) assert(posts[index - 1].date >= post.date)
    const adjacent = getAdjacentBlogPosts(post.slug)
    assert.equal(adjacent.previous?.slug, posts[index + 1]?.slug)
    assert.equal(adjacent.next?.slug, posts[index - 1]?.slug)
  }
})

test('post types are explicit and drafts stay out of lists, routes and adjacent navigation', () => {
  const all = getAllBlogPosts({ includeDrafts: true })
  for (const post of all) {
    const { metadata: data } = parseFrontmatter(
      fs.readFileSync(`data/blog/${post.slug}.md`, 'utf8'),
    )
    assert(['article', 'note', 'excerpt'].includes(data.type), post.slug)
    assert.equal(post.type, data.type)
  }
  const draft = parseBlogPostData(
    'example-draft',
    fs.readFileSync('tests/fixtures/blog/draft.md', 'utf8'),
  )
  assert.equal(draft.draft, true)
  assert(!posts.some((post) => post.draft || post.slug === draft.slug))
  assert(!getAllBlogPostSlugs().some((path) => path.params.slug === draft.slug))
  assert.deepEqual(getAdjacentBlogPosts(draft.slug), { previous: null, next: null })
  assert(!all.some((post) => post.slug === draft.slug))
  assert(!fs.existsSync(`data/blog/${draft.slug}.md`))
  assert.equal(getBlogPostData('blue-from-indigo').type, 'article')
  assert.equal(getBlogPostData('notes-on-diffusion-models').type, 'note')
  assert.equal(getBlogPostData('the-bitter-lesson').type, 'excerpt')
})

test('canonical slugs use lowercase kebab-case and old slugs resolve without redirect chains', () => {
  const slugs = new Set(posts.map((post) => post.slug))
  for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  for (const [oldSlug, target] of Object.entries(blogRedirects)) {
    assert(!slugs.has(oldSlug), oldSlug)
    assert(slugs.has(target), target)
    assert(!Object.hasOwn(blogRedirects, target), target)
    assert.equal(resolveBlogSlug(oldSlug), target)
    assert.equal(resolveBlogSlug(target), target)
  }
  assert.equal(resolveBlogSlug('pppp'), 'programming-by-prompting-prompting-by-poking')
})

test('source lists are separate from the body and omitted for own posts', () => {
  for (const post of posts) {
    const detail = getBlogPostData(post.slug)
    assert.deepEqual(detail.sources, post.sources, post.slug)
    assert(Array.isArray(post.sources), post.slug)
    if (post.author === 'Giung Nam') {
      assert.equal(post.sources.length, 0, post.slug)
      continue
    }
    assert(post.sources.length > 0, post.slug)
    assert(!/^[^\n]+\n---(?:\n|$)/.test(detail.content.trimStart()), post.slug)
    assert(!/^\[.+\]\(.+\)\n---$/m.test(detail.content), post.slug)
    for (const source of post.sources) {
      assert(source.title.trim(), post.slug)
      if (source.url) assert(['http:', 'https:'].includes(new URL(source.url).protocol), post.slug)
    }
  }
  assert.deepEqual(getBlogPostData('aspects-of-scientific-method').sources, [
    {
      title: 'Science and Statistics',
      url: 'https://doi.org/10.1080/01621459.1976.10480949',
    },
  ])
  assert.deepEqual(getBlogPostData('what-a-scientific-theory-is').sources, [
    { title: 'A Brief History of Time' },
  ])
})

test('the Vygotsky excerpt uses the linked Thinking and Speech chapter translation', () => {
  const post = getBlogPostData('a-cloud-shedding-a-shower-of-words')
  assert.equal(post.date, '1934')
  assert.equal(post.author, 'Lev Vygotsky')
  assert.equal(post.type, 'excerpt')
  assert.deepEqual(post.sources, [
    {
      title: 'Thinking and Speech, Chapter 7: Thought and Word',
      url: 'https://www.marxists.org/archive/vygotsky/works/words/ch07.htm',
    },
  ])
  assert.equal(
    post.description,
    'What is contained simultaneously in thought unfolds sequentially in speech.',
  )
  assert(post.content.includes('a hovering cloud which gushes a shower of words'))
  assert(
    post.content.includes('The path from thought to word is indirect and internally mediated.'),
  )
  assert(!post.content.includes('In his mind the whole thought is present at once'))
  assert.equal(resolveBlogSlug('Vygotsky1934'), post.slug)
})

test('Hamming excerpts preserve lecture order, omissions, and transcript attribution', () => {
  const post = getBlogPostData('you-and-your-research')
  assert.equal(post.title, 'You and your research')
  assert.equal(post.author, 'Richard Hamming')
  assert.equal(post.date, '1986-03-07')
  assert.equal(post.type, 'excerpt')
  assert.deepEqual(post.sources, [
    {
      title: 'You and Your Research (lecture transcript edited by J. F. Kaiser)',
      url: 'https://cs-giung.github.io/you-and-your-research.pdf',
    },
  ])
  const passages = [
    'Knowledge and productivity are like compound interest.',
    'Great scientists tolerate ambiguity very well.',
    "If you do not work on an important problem, it's unlikely you'll do important work.",
    'Great Thoughts Time.',
    'if you have the door to your office closed',
    'The essence of science is cumulative.',
    'it is not sufficient to do a job, you have to sell it.',
  ]
  let previous = -1
  for (const passage of passages) {
    const index = post.content.indexOf(passage)
    assert(index > previous, passage)
    previous = index
  }
  assert(post.content.includes('Just hard work is not enough - it must be applied sensibly.'))
  assert(post.content.includes('it is that you have a reasonable attack.'))
  assert(post.content.includes('Now I cannot prove the cause and effect sequence'))
  assert(post.content.includes('you also must learn to give informal talks.'))
  assert.equal((post.content.match(/^\[…\]$/gm) || []).length, 7)
  assert(!/^#{1,6}\s/m.test(post.content))
  assert(!getBlogLinks().some((link) => link.url === '/you-and-your-research.pdf'))
})

test('multi-source articles retain every original URL in reading order', () => {
  const expected = {
    'not-a-vox-populi-but-a-vox-expertorum': [
      'https://doi.org/10.1038/075450a0',
      'https://doi.org/10.1038/075509e0',
    ],
    'discussion-of-software-2-0': [
      'https://medium.com/@karpathy/software-2-0-a64152b37c35',
      'https://medium.com/@doganulus/i-think-this-post-makes-an-old-mistake-7b26519c0742',
    ],
    'why-mit-stopped-teaching-sicp': [
      'https://web.archive.org/web/20160504164044/http://www.posteriorscience.net/?p=206',
      'https://news.ycombinator.com/item?id=11628080',
    ],
    'the-limitations-of-deep-learning-and-its-future': [
      'https://blog.keras.io/the-limitations-of-deep-learning.html',
      'https://blog.keras.io/the-future-of-deep-learning.html',
    ],
  }
  for (const [slug, urls] of Object.entries(expected)) {
    assert.deepEqual(
      getBlogPostData(slug).sources.map((source) => source.url),
      urls,
      slug,
    )
  }
})

test('curated links are preserved separately from article metadata', () => {
  const links = getBlogLinks()
  assert.equal(links.length, 2)
  assert(!links.some((link) => link.url === 'https://dwest.web.illinois.edu/grammar.html'))
  assert.equal(new Set(links.map((link) => link.url)).size, links.length)
  for (const link of links) {
    assert(link.title && link.authors && link.url && link.note)
    assert.match(link.authors, /, \d{4}$/)
    assert.equal(typeof link.date, 'string')
    assert(Number.isFinite(new Date(link.date).getTime()), link.title)
    assert.equal(link.date.slice(0, 4), link.authors.slice(-4), link.title)
    assert(!link.url.startsWith('/reading'))
    if (link.url.startsWith('/')) {
      assert.match(link.url, /^\/[a-z0-9]+(?:-[a-z0-9]+)*\.pdf$/)
      assert(fs.existsSync(`public${link.url}`), link.url)
      assert.equal(
        fs.readFileSync(`public${link.url}`).subarray(0, 5).toString(),
        '%PDF-',
        link.url,
      )
    } else assert.equal(new URL(link.url).protocol, 'https:')
  }
})
