import assert from 'node:assert/strict'
import test from 'node:test'
import { drawerImages } from '../../lib/drawer-data.ts'

function image(hash) {
  const entry = drawerImages.find((item) => item.src.endsWith(`-${hash}.webp`))
  assert(entry, hash)
  return entry
}

test('the Luddite print uses its 1812 publication year and distinguishes artist from publishers', () => {
  const entry = image('48470d9c')
  assert.equal(entry.year, 1812)
  assert.equal(entry.src, '/drawer/1812-48470d9c.webp')
  assert.equal(entry.width, 388)
  assert.equal(entry.height, 512)
  assert.match(entry.title, /The Leader of the Luddites.*May 1812/)
  assert.match(entry.alt, /colored print/)
  assert.equal(entry.credit, 'Unknown artist · Walker and Knight (publishers)')
  assert.equal(entry.source, 'https://commons.wikimedia.org/wiki/File:Luddite.jpg')
})

test('Edison uses the requested 1878 display year while retaining approximate source dating', () => {
  const entry = image('13c1acd5')
  assert.equal(entry.year, 1878)
  assert.equal(entry.src, '/drawer/1878-13c1acd5.webp')
  assert.match(entry.title, /around 1877–1878/)
  assert.equal(
    entry.source,
    'https://commons.wikimedia.org/wiki/File:Edison_and_phonograph_edit1.jpg',
  )
})

test('the South Pole photograph uses its 1911 event date rather than the book edition year', () => {
  const entry = image('08aae1c3')
  assert.equal(entry.year, 1911)
  assert.equal(entry.src, '/drawer/1911-08aae1c3.webp')
  assert.equal(entry.credit, 'Olav Bjaaland · The South Pole, Vol. II')
  assert.equal(
    entry.source,
    'https://en.wikipedia.org/wiki/File:At_the_South_Pole,_December_1911.jpg',
  )
})

test('Colossus uses the requested 1944 display year with its source range retained', () => {
  const entry = image('15bd6f39')
  assert.equal(entry.year, 1944)
  assert.equal(entry.yearLabel, undefined)
  assert.equal(entry.src, '/drawer/1944-15bd6f39.webp')
  assert.match(entry.source, /colossus-in-1944-5/)
})

test('Sketchpad uses the television program year rather than the system thesis year', () => {
  const entry = image('c9f2d70c')
  assert.equal(entry.year, 1964)
  assert.equal(entry.src, '/drawer/1964-c9f2d70c.webp')
  assert.match(entry.source, /cpb-aacip_15-40xpq2xm/)
  assert.match(entry.title, /television program/)
})

test('the Dirac and Feynman photograph retains its 1962 date and licensed attribution', () => {
  const entry = image('ce62a2e5')
  assert.equal(entry.year, 1962)
  assert.equal(entry.credit, 'Marek Holzman · CC BY 4.0')
  assert.equal(
    entry.source,
    'https://commons.wikimedia.org/wiki/File:Paul_Dirac_and_Richard_Feynman_at_Jab%C5%82onna_1962.png',
  )
})

test('approximate and reproduced dates keep their explicit qualifications', () => {
  const rosenblatt = image('3bc6d7e4')
  assert.equal(rosenblatt.year, 1959)
  assert.equal(rosenblatt.yearLabel, undefined)
  assert.match(rosenblatt.title, /around 1959/)
  assert.match(image('3d605253').title, /reproduction.*1888/)
  for (const [hash, year] of [
    ['b21dc2da', 1939],
    ['d3a42890', 1952],
    ['f2d6dc61', 1965],
    ['fee80443', 1979],
    ['0209c2c9', 1989],
    ['0f4046c2', 1993],
    ['ae39136c', 1995],
    ['5a015f87', 1997],
  ]) {
    const entry = image(hash)
    assert.equal(entry.year, year, hash)
    assert.equal(entry.yearLabel, undefined, hash)
  }
})

test('historical sources retain their reviewed links and credits', () => {
  for (const [hash, source, credit] of [
    [
      'f2d6dc61',
      'https://science.nasa.gov/resource/first-tv-image-of-mars-hand-colored/',
      'NASA/JPL-Caltech/Dan Goods',
    ],
    [
      'a01725f5',
      'https://carnegiescience.edu/about/history/archives/plate-archives/m31var',
      'Edwin P. Hubble · Carnegie Science',
    ],
    [
      '0f4046c2',
      'https://plus.maths.org/very-old-problem-turns-30',
      'Isaac Newton Institute · via Plus',
    ],
    ['cfd6240d', 'https://feynman.com/science/the-challenger-disaster/'],
  ]) {
    const entry = image(hash)
    assert.equal(entry.source, source, hash)
    if (credit) assert.equal(entry.credit, credit, hash)
  }
})

test('the Erdős and Tao photograph retains its 1985 date and licensed attribution', () => {
  const entry = image('7bc2a7a6')
  assert.equal(entry.year, 1985)
  assert.equal(entry.src, '/drawer/1985-7bc2a7a6.webp')
  assert.equal(entry.credit, 'Billy or Grace Tao · CC BY-SA 2.0')
  assert.equal(
    entry.source,
    'https://commons.wikimedia.org/wiki/File:Paul_Erdos_with_Terence_Tao.jpg',
  )
})

test('the IAS computer dedication uses 1952 rather than the modern file timestamp', () => {
  const entry = image('0eddee41')
  assert.equal(entry.year, 1952)
  assert.equal(entry.src, '/drawer/1952-0eddee41.webp')
  assert.match(entry.title, /IAS computer’s dedication/)
  assert.equal(entry.source, 'https://commons.wikimedia.org/wiki/File:Oppenheimer_%26_Neumann.jpg')
})

test('the Goddard photograph retains its 1926 capture year and photographer credit', () => {
  const entry = image('0b2c1295')
  assert.equal(entry.year, 1926)
  assert.equal(entry.src, '/drawer/1926-0b2c1295.webp')
  assert.equal(entry.credit, 'Esther C. Goddard · NASA')
  assert.equal(entry.source, 'https://commons.wikimedia.org/wiki/File:Goddard_and_Rocket.jpg')
})

test('the Lakeside photograph uses 1970 rather than the later Microsoft founding year', () => {
  const entry = image('f09dd652')
  assert.equal(entry.year, 1970)
  assert.equal(entry.src, '/drawer/1970-f09dd652.webp')
  assert.equal(entry.credit, 'Bruce Burgess · Lakeside School')
  assert.equal(
    entry.source,
    'https://commons.wikimedia.org/wiki/File:Paul_Allen_and_Bill_Gates_at_Lakeside_School_in_1970.jpg',
  )
})

test('the Linux announcement uses its 1991 message date rather than the rendering date', () => {
  const entry = image('ed14b0c9')
  assert.equal(entry.year, 1991)
  assert.match(entry.title, /Usenet/)
  assert.match(entry.alt, /25 August 1991 comp\.os\.minix/)
  assert.equal(entry.credit, 'Janiara1 (image) · Linus Torvalds (text) · CC BY-SA 4.0')
  assert.equal(entry.source, 'https://commons.wikimedia.org/wiki/File:Linus_eka_email.png')
})

test('the Nobel ceremony frame retains its 2024 event year and official source credit', () => {
  const entry = image('c539b3fe')
  assert.equal(entry.year, 2024)
  assert.equal(entry.src, '/drawer/2024-c539b3fe.webp')
  assert.equal(entry.width, 910)
  assert.equal(entry.height, 512)
  assert.equal(entry.credit, '© Nobel Prize Outreach')
  assert.equal(entry.source, 'https://www.youtube.com/watch?v=6-A4dUowT4Q')
  assert.match(entry.title, /2024 Nobel Prize award ceremony in Stockholm/)
})

test('the machine-assisted proofs panel retains its 2018 event year and rights credit', () => {
  const entry = image('dcea580d')
  assert.equal(entry.year, 2018)
  assert.equal(entry.src, '/drawer/2018-dcea580d.webp')
  assert.equal(entry.width, 910)
  assert.equal(entry.height, 512)
  assert.match(entry.title, /Machine-Assisted Proofs.*ICM 2018/)
  assert.equal(entry.credit, '© ICM 2018 · IMPA')
  assert.equal(entry.source, 'https://www.youtube.com/watch?v=T9ZqbQh-t9E')
})

test('the ICM lecture frame retains its 2026 event date and supplied video source', () => {
  const entry = image('7634ba0a')
  assert.equal(entry.year, 2026)
  assert.equal(entry.src, '/drawer/2026-7634ba0a.webp')
  assert.equal(entry.width, 910)
  assert.equal(entry.height, 512)
  assert.match(entry.title, /Terence Tao.*Mathematics in the age of AI.*ICM 2026/)
  assert.match(entry.alt, /July 24, 2026/)
  assert.equal(entry.credit, 'Terence Tao · video via Alvaro Lozano-Robledo')
  assert.equal(entry.source, 'https://www.youtube.com/watch?v=sxAe4HJceFQ')
})

test('1969 images retain their requested editorial order within newest-first years', () => {
  assert.deepEqual(
    drawerImages
      .toSorted((a, b) => b.year - a.year)
      .filter((entry) => entry.year === 1969)
      .map((entry) => entry.src),
    ['/drawer/1969-4f1ead2e.webp', '/drawer/1969-52b68d20.webp', '/drawer/1969-e13ba13b.webp'],
  )
})

test('the Einstein–Szilárd record depicts the signed two-page letter, not a reenactment', () => {
  const entry = image('b21dc2da')
  assert.equal(entry.year, 1939)
  assert.match(entry.alt, /Both pages.*August 2, 1939.*signature/)
  assert.equal(
    entry.source,
    'https://commons.wikimedia.org/wiki/File:Einstein-Roosevelt-letter.png',
  )
})
