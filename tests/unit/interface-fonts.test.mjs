import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import test from 'node:test'

test('interface fonts are licensed local WOFF2 assets with recorded provenance', () => {
  const manifest = JSON.parse(fs.readFileSync('assets/fonts/geist/manifest.json', 'utf8'))
  assert.deepEqual(
    manifest.map((font) => font.family),
    ['Geist', 'Geist Mono'],
  )
  for (const font of manifest) {
    const bytes = fs.readFileSync(`assets/fonts/geist/${font.file}`)
    assert.equal(bytes.subarray(0, 4).toString(), 'wOF2')
    assert.equal(createHash('sha256').update(bytes).digest('hex'), font.sha256)
    assert.equal(new URL(font.source).protocol, 'https:')
  }
  for (const license of ['OFL.txt', 'OFL-Mono.txt']) {
    assert(
      fs.readFileSync(`public/fonts/geist/${license}`, 'utf8').includes('SIL OPEN FONT LICENSE'),
    )
  }
  assert(!fs.readFileSync('app/layout.tsx', 'utf8').includes('next/font/google'))
})
