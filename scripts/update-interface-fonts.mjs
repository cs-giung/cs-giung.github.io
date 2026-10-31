import fs from 'node:fs'
import { createHash } from 'node:crypto'

const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const directory = 'assets/fonts/geist'
const licenses = 'public/fonts/geist'
fs.mkdirSync(directory, { recursive: true })
fs.mkdirSync(licenses, { recursive: true })
const manifest = []

for (const [family, slug, filename] of [
  ['Geist', 'geist', 'Geist-Latin.woff2'],
  ['Geist Mono', 'geistmono', 'GeistMono-Latin.woff2'],
]) {
  const stylesheet = new URL('https://fonts.googleapis.com/css2')
  stylesheet.searchParams.set('family', `${family}:wght@100..900`)
  stylesheet.searchParams.set('display', 'swap')
  const response = await fetch(stylesheet, { headers: { 'User-Agent': userAgent } })
  if (!response.ok) throw new Error(`${family} stylesheet failed: ${response.status}`)
  const css = await response.text()
  const latin = css.match(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/)
  const source = latin?.[1].match(
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)\s*format\('woff2'\)/,
  )?.[1]
  if (!source) throw new Error(`No Latin variable WOFF2 found for ${family}`)
  const fontResponse = await fetch(source)
  if (!fontResponse.ok) throw new Error(`${family} download failed: ${fontResponse.status}`)
  const font = Buffer.from(await fontResponse.arrayBuffer())
  if (font.subarray(0, 4).toString() !== 'wOF2') throw new Error(`Invalid WOFF2 for ${family}`)
  const license = `https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`
  const licenseResponse = await fetch(license)
  if (!licenseResponse.ok) throw new Error(`${family} license failed: ${licenseResponse.status}`)
  fs.writeFileSync(`${directory}/${filename}`, font)
  fs.writeFileSync(
    `${licenses}/${family === 'Geist' ? 'OFL' : 'OFL-Mono'}.txt`,
    await licenseResponse.text(),
  )
  manifest.push({
    family,
    file: filename,
    stylesheet: stylesheet.href,
    source,
    license,
    sha256: createHash('sha256').update(font).digest('hex'),
  })
  console.log(`Saved ${family}: ${font.length} bytes`)
}
fs.writeFileSync(`${directory}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n')
