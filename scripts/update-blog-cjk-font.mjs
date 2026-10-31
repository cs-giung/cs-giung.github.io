import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

// Development-only: refresh the licensed CJK subset when a post adds new Han glyphs.
const characters = [
  ...new Set(
    fs
      .readdirSync('data/blog')
      .filter((file) => file.endsWith('.md'))
      .flatMap((file) =>
        [...fs.readFileSync(path.join('data/blog', file), 'utf8')].filter((char) =>
          /\p{Script=Han}/u.test(char),
        ),
      ),
  ),
]
  .sort()
  .join('')
if (!characters) throw new Error('No Han characters found in blog content.')
const url = new URL('https://fonts.googleapis.com/css2')
url.searchParams.set('family', 'Noto Serif TC:wght@400;600')
url.searchParams.set('text', characters)
url.searchParams.set('display', 'swap')
const response = await fetch(url, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  },
})
if (!response.ok) throw new Error(`Font stylesheet request failed: ${response.status}`)
const css = await response.text()
const sources = [
  ...new Set(
    [
      ...css.matchAll(/src:\s*url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)\s*format\('woff2'\)/g),
    ].map((match) => match[1]),
  ),
]
if (sources.length !== 1)
  throw new Error(
    'Expected one variable WOFF2 subset; inspect the stylesheet before changing the font.',
  )
const fontResponse = await fetch(sources[0])
if (!fontResponse.ok) throw new Error(`Font request failed: ${fontResponse.status}`)
const font = Buffer.from(await fontResponse.arrayBuffer())
if (font.subarray(0, 4).toString() !== 'wOF2') throw new Error('Downloaded file is not WOFF2.')
const licenseUrl = 'https://raw.githubusercontent.com/google/fonts/main/ofl/notoseriftc/OFL.txt'
const licenseResponse = await fetch(licenseUrl)
if (!licenseResponse.ok) throw new Error(`Font license request failed: ${licenseResponse.status}`)
const directory = 'public/fonts/noto-serif-tc'
fs.mkdirSync(directory, { recursive: true })
fs.writeFileSync(`${directory}/NotoSerifTC-Blog.woff2`, font)
fs.writeFileSync(`${directory}/OFL.txt`, await licenseResponse.text())
fs.writeFileSync(
  `${directory}/subset.json`,
  JSON.stringify(
    {
      characters,
      stylesheet: url.href,
      source: sources[0],
      license: licenseUrl,
      sha256: createHash('sha256').update(font).digest('hex'),
    },
    null,
    2,
  ) + '\n',
)
console.log(
  `Saved self-hosted Noto Serif TC subset: ${characters.length} Han characters, ${font.length} bytes.`,
)
