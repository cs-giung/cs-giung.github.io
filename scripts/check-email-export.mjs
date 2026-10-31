import fs from 'node:fs'
import path from 'node:path'
import { readYamlFile } from '../lib/content-data.ts'

// Run after npm run build. The public contact address in CV source data is
// intentional; this check prevents accidental plaintext copies in generated assets.
const cv = readYamlFile('data/cv.yaml')
const address = cv.personal.email
const root = path.resolve('out')
const extensions = new Set([
  '.html',
  '.txt',
  '.rsc',
  '.js',
  '.json',
  '.xml',
  '.map',
  '.css',
  '.svg',
])
const leaks = []
let checked = 0

function inspect(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      inspect(file)
    } else if (extensions.has(path.extname(file))) {
      const source = fs.readFileSync(file, 'utf8')
      // Include common serialization escapes and URL-encoded mail addresses.
      const normalized = source
        .replace(/\\u([0-9a-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
        .replace(/\\x([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      if (
        normalized.toLowerCase().includes(address.toLowerCase()) ||
        normalized.toLowerCase().includes(encodeURIComponent(address).toLowerCase())
      ) {
        leaks.push(path.relative(root, file))
      }
      checked++
    }
  }
}

if (!fs.existsSync(root))
  throw new Error('Build the site with npm run build before checking email exposure.')
inspect(root)
for (const route of ['index.html', 'cv/index.html']) {
  const html = fs.readFileSync(path.join(root, route), 'utf8')
  if (
    !html.includes('data-email-contact') ||
    !html.includes('[at]') ||
    html.includes('{first_name}')
  ) {
    throw new Error(`Missing readable email fallback in ${route}`)
  }
}
if (leaks.length) {
  console.error('Plain contact email found in exported text assets:\n' + leaks.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `PASS: ${checked} exported text assets contain no plain contact email; ABOUT and CV have readable fallbacks.`,
  )
}
