import assert from 'node:assert/strict'
import test from 'node:test'
import { getBlogPostData } from '../../lib/blog-posts.ts'

const blocks = (slug) =>
  getBlogPostData(slug)
    .content.trim()
    .split(/\n\s*\n/)
const selections = (slug) =>
  blocks(slug).filter((block) => block !== '[…]' && !block.startsWith('*Selected excerpts'))

test('Dijkstra preserves the requested description and five complete paragraphs in source order', () => {
  const post = getBlogPostData('the-threats-to-computing-science')
  const description =
    'The question of whether Machines Can Think, a question of which we now know that it is about as relevant as the question of whether Submarines Can Swim.'
  assert.equal(post.title, 'The threats to computing science')
  assert.equal(post.author, 'Edsger W. Dijkstra')
  assert.equal(post.date, '1984')
  assert.equal(post.type, 'excerpt')
  assert.equal(post.description, description)
  assert.deepEqual(post.sources, [
    {
      title: 'EWD898: The threats to computing science (transcribed by Michael Lugo)',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD898.html',
    },
  ])
  const paragraphs = selections(post.slug)
  const sourceQuote = description.replace(/^The /, 'the ')
  const boundaries = [
    ['The Fathers of the field had been pretty confusing:', sourceQuote, 67],
    [
      'I called this focus on hardware a distortion',
      'the key challenge computing science has to meet.',
      108,
    ],
    [
      'Since the Romans have taught us',
      'the bugs he should not have introduced in the first place.',
      200,
    ],
    ['The major attraction of the modern elixirs', 'they create an illusion of power.', 41],
    [
      'As I said earlier, the programmable computer',
      'this challenge is exciting and we are ready for it.',
      65,
    ],
  ]
  assert.equal(paragraphs.length, boundaries.length)
  paragraphs.forEach((paragraph, index) => {
    const [start, end, words] = boundaries[index]
    assert(paragraph.startsWith(start), start)
    assert(paragraph.endsWith(end), end)
    assert.equal(paragraph.split(/\s+/).length, words, start)
  })
  assert.equal((post.content.match(/^\[…\]$/gm) ?? []).length, 5)
})

test('Vygotsky retains four source paragraph selections and marks omitted passages', () => {
  const paragraphs = selections('a-cloud-shedding-a-shower-of-words')
  assert.equal(paragraphs.length, 4)
  const starts = [
    'Thought is characterized by a movement, an unfolding.',
    'This leads us to the conclusion that thought does not immediately coincide',
    'Therefore, the transition from thought to speech is an extremely complex process',
    'Thought is not only mediated externally by signs.',
  ]
  paragraphs.forEach((paragraph, index) => assert(paragraph.startsWith(starts[index])))
  assert(paragraphs[1].includes('a barefoot boy in a blue shirt'))
  assert(paragraphs[1].endsWith('a hovering cloud which gushes a shower of words.'))
  assert(paragraphs[3].includes('through a mediated path. […] Meaning mediates thought'))
  assert(
    paragraphs[3].endsWith('The path from thought to word is indirect and internally mediated.'),
  )
  const content = getBlogPostData('a-cloud-shedding-a-shower-of-words').content
  assert.equal((content.match(/^\[…\]$/gm) || []).length, 2)
  assert(!content.includes('We can now return to the definition'))
  assert(!content.includes('Therefore, ore'))
})

test('Hamming selections do not split paragraphs from the lecture transcript', () => {
  const paragraphs = selections('you-and-your-research')
  assert.equal(paragraphs.length, 10)
  for (const [start, continuation] of [
    ["There's another trait", 'Darwin writes in his autobiography'],
    ['If you do not work on an important problem', "It's not the consequence"],
    ['Along those lines', 'I saw that computers were transforming science'],
    ['Another trait, it took me a while to notice.', 'He who works with the door open'],
    ['I have now come down to a topic', 'I suggest that when you open a journal'],
  ]) {
    const paragraph = paragraphs.find((block) => block.startsWith(start))
    assert(paragraph?.includes(continuation), start)
  }
})

test('Hardware Lottery preserves four source paragraphs in essay order with the full PDF', () => {
  const post = getBlogPostData('the-hardware-lottery')
  assert.equal(post.title, 'The hardware lottery')
  assert.equal(post.author, 'Sara Hooker')
  assert.equal(post.date, '2020')
  assert.equal(post.type, 'excerpt')
  assert.deepEqual(post.sources, [
    {
      title: 'The Hardware Lottery (2020, arXiv:2009.06489v2)',
      url: 'https://cs-giung.github.io/the-hardware-lottery.pdf',
    },
  ])
  const paragraphs = selections(post.slug)
  const starts = [
    'What follows is part position paper and part historical review.',
    'In many ways, hardware is catching up to the present state of machine learning research.',
    'While specialization makes deep neural networks more efficient,',
    'Scientific progress occurs when there is a confluence of factors',
  ]
  assert.equal(paragraphs.length, 4)
  paragraphs.forEach((paragraph, index) => assert(paragraph.startsWith(starts[index])))
  assert(paragraphs[1].includes('(Dean, 2020)'))
  assert(paragraphs[1].endsWith('these will enable higher levels of compression.'))
  assert(paragraphs[2].endsWith('the hardware and software to see as a success?'))
  assert(paragraphs[3].endsWith('different hardware-software-algorithm combinations.'))
  assert.equal((post.content.match(/^\[…\]$/gm) || []).length, 3)
  assert(!/^#{1,6}\s/m.test(post.content))
})

test('Advice preserves five contributors, source paragraphs, and Roman-numbered items', () => {
  const post = getBlogPostData('advice-to-a-young-mathematician')
  assert.equal(post.title, 'Advice to a young mathematician')
  assert.equal(post.author, 'Michael Atiyah et al.')
  assert.equal(post.date, '2008')
  assert.equal(post.type, 'excerpt')
  assert.deepEqual(post.sources, [
    {
      title: 'The Princeton Companion to Mathematics, VIII.6: Advice to a Young Mathematician',
      url: 'https://cs-giung.github.io/advice-to-a-young-mathematician.pdf',
    },
  ])
  const sections = post.content.split('\n\n---\n\n')
  assert.equal(sections.length, 5)
  const contributors = [
    'I. Sir Michael Atiyah',
    'II. Béla Bollobás',
    'III. Alain Connes',
    'IV. Dusa McDuff',
    'V. Peter Sarnak',
  ]
  sections.forEach((section, index) => assert(section.includes(`__${contributors[index]}__`)))
  const paragraphs = selections(post.slug).filter(
    (block) => block !== '---' && !/^__[^\n]+__$/.test(block),
  )
  assert.equal(paragraphs.length, 13)
  const counts = sections.map(
    (section) =>
      section
        .trim()
        .split(/\n\s*\n/)
        .filter(
          (block) =>
            block !== '[…]' &&
            !block.startsWith('*Selected excerpts') &&
            !/^__[^\n]+__$/.test(block),
        ).length,
  )
  assert.deepEqual(counts, [4, 4, 2, 2, 1])
  assert(sections[0].includes('__Warning__'))
  assert(sections[0].includes('__The Role of Curiosity__'))
  assert(sections[1].includes('(i) A “dream”:'))
  assert(sections[1].includes('(ii) Some very worthwhile problems'))
  assert(sections[1].includes('Do not be afraid to make mistakes.'))
  assert(sections[2].includes('__Being brave.__ There are several phases'))
  assert(sections[2].includes('__Grudging approbation.__ A colleague'))
  assert(sections[3].includes('Gromov’s nonsqueezing theorem'))
  assert(sections[3].includes('mathematics is a communal endeavor'))
  assert(sections[4].includes('(i) When learning an area'))
  assert(sections[4].includes('*The Concept of a Riemann Surface*'))
  assert(sections[4].includes('This can be very inspiring.'))
  assert.equal((post.content.match(/^\[…\]$/gm) || []).length, 7)
})

test('Monadology preserves ten complete sections, original numbering, and translation attribution', () => {
  const post = getBlogPostData('monadology')
  assert.equal(post.title, 'Monadology')
  assert.equal(post.author, 'Gottfried Wilhelm Leibniz')
  assert.equal(post.date, '1714')
  assert.equal(post.type, 'excerpt')
  assert.deepEqual(post.sources, [
    {
      title: 'Monadology, translated by Robert Latta (1898)',
      url: 'https://en.wikisource.org/wiki/Monadology_%28Leibniz%2C_tr._Latta%29',
    },
  ])
  assert(post.content.includes('translated by Robert Latta (1898)'))
  const paragraphs = selections(post.slug)
  assert.equal(paragraphs.length, 10)
  assert.deepEqual(
    paragraphs.map((paragraph) => Number(paragraph.match(/^(\d+)\\\./)?.[1])),
    [17, 26, 27, 28, 29, 31, 32, 33, 34, 35],
  )
  const endings = [
    '(Theodicy, Préf. [E. 474; G. vi. 37].)',
    '(Theodicy "Discours de la Conformité", &c., § 65.)',
    'as many and oft-repeated ordinary perceptions.',
    'It is only the astronomer who thinks it on rational grounds.',
    'the rational soul or mind [esprit].',
    '(Theodicy 44, 169.)',
    '(Theodicy 44, 196.)',
    '(Theodicy 170, 174, 189, 280-282, 367. Abrégé, Object. 3.)',
    'Definitions, Axioms and Postulates.',
    '(Theodicy 36, 37, 44, 45, 49, 52, 121-122, 337, 340-344.)',
  ]
  paragraphs.forEach((paragraph, index) => assert(paragraph.endsWith(endings[index])))
  assert(paragraphs[0].includes('Thus it is in a simple substance, and not in a compound'))
  assert(paragraphs[1].includes('which resembles [imite] reason'))
  assert(paragraphs[4].includes('the knowledge of ourselves and of God'))
  assert.equal((post.content.match(/^\[…\]$/gm) ?? []).length, 2)
  assert(!/^#{1,6}\s/m.test(post.content))
})

test('Orwell and Swift retain their existing source paragraph structure', () => {
  const orwell = blocks('the-function-of-the-machine')
  assert.equal(orwell.length, 1)
  assert(orwell[0].startsWith('The function of the machine is to save work.'))
  assert(orwell[0].endsWith('the chance of working--that is, of living.'))

  const swift = blocks('the-machine-of-speculative-knowledge')
  const paragraphs = swift.filter((block) => !block.startsWith('!['))
  assert.equal(paragraphs.length, 5)
  assert(paragraphs[1].startsWith('The first professor I saw'))
  assert(paragraphs[1].includes('The superficies was composed'))
  assert(paragraphs[1].includes('The pupils, at his command'))
  assert(swift.includes('![Image](/the-machine-of-speculative-knowledge-figure-1.jpg)'))
})

test('Box retains its five sections, ten prose paragraphs, and explanatory figure', () => {
  const post = getBlogPostData('aspects-of-scientific-method')
  assert.deepEqual(
    [...post.content.matchAll(/^### (.+)$/gm)].map((match) => match[1]),
    [
      'Iteration between theory and practice',
      'Flexibility',
      'Parsimony',
      'Worrying selectively',
      'Role of mathematics in science',
    ],
  )
  const paragraphs = blocks(post.slug).filter(
    (block) => !block.startsWith('### ') && !block.startsWith('!['),
  )
  assert.equal(paragraphs.length, 10)
  assert(post.content.includes('Figure A(1)'))
  assert(post.content.includes('Figure A(2)'))
  assert(post.content.includes('](/aspects-of-scientific-method-figure-1.png)'))
  assert(post.content.includes('Pure mathematics is concerned with propositions'))
  assert(post.content.includes('in nature there never was a normal distribution'))
})

test('Chollet retains separate historical excerpts, original paragraphs, and all five list items', () => {
  const post = getBlogPostData('the-limitations-of-deep-learning-and-its-future')
  assert(post.description.includes('2017'))
  const [limitations, future] = post.content.split('\n\n---\n\n')
  assert(limitations.includes('Two excerpts published in May 2017'))
  assert(limitations.includes('__The limitations of deep learning:__'))
  assert(future.includes('__The future of deep learning:__'))
  const paragraphs = limitations
    .trim()
    .split(/\n\s*\n/)
    .filter((block) => !block.startsWith('*') && !block.startsWith('__'))
  assert.equal(paragraphs.length, 3)
  assert(paragraphs[0].includes('you could *not* train a deep learning model'))
  assert(paragraphs[1].includes('*a chain of simple, continuous geometric transformations*'))
  assert.equal((future.match(/^- /gm) || []).length, 5)
  assert(future.includes('This critique, however, does not belong here.'))
})

test('SICP excerpts retain both speakers, source links, and the coherence qualification', () => {
  const post = getBlogPostData('why-mit-stopped-teaching-sicp')
  assert(post.content.includes('__Yarden Katz:__'))
  assert(post.content.includes('__Ron Garret:__'))
  assert(post.content.includes('Nowadays, we do programming by poking.'))
  assert(post.content.includes('the SICP curriculum was "more coherent"'))
  assert(post.content.includes('computer programs are mathematical objects'))
  assert(post.content.includes('You need some programming language theory.'))
  assert.equal((post.content.match(/^\[…\]$/gm) || []).length, 5)
  for (const url of [
    'https://vimeo.com/151465912#t=59m36s',
    'https://mitpress.mit.edu/sicp',
    'https://mitp-content-server.mit.edu/books/content/sectbyfn/books_pres_0/6515/sicp.zip/index.html',
    'https://ocw.mit.edu/courses/6-001-structure-and-interpretation-of-computer-programs-spring-2005/video_galleries/video-lectures/',
  ])
    assert(post.content.includes(url), url)
  assert(!post.content.includes('You can safely skip category theory.'))
  assert(!post.content.includes('PDAs can to things'))
})

test('statistical excerpts correct transcription errors without replacing their arguments', () => {
  const history = getBlogPostData('a-brief-history-of-statistical-learning')
  assert(history.description.includes('concepts that underlie the field'))
  assert(history.content.includes('Legendre and Gauss published papers'))
  assert.equal(blocks(history.slug).length, 3)
  const rubin = getBlogPostData('bayesian-inference-for-the-applied-statistician')
  assert(rubin.content.includes('more than one Bayesian inference is being entertained.'))
  assert(rubin.content.includes('In many practical problems'))
  assert(rubin.content.includes('Thus, for example, in a completely randomized experiment'))
  assert.equal(blocks(rubin.slug).length, 4)
  for (const [post, errors] of [
    [history, ['publisehd', 'concepts that underline']],
    [rubin, ['Bayeisna', 'In may practical', 'for examples,']],
    [getBlogPostData('aspects-of-scientific-method'), ['is concerns', 'nautre']],
  ])
    for (const error of errors) assert(!post.content.includes(error), error)
})
