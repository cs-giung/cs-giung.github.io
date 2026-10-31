import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { getCVData } from '../../lib/cv-data.ts'

test('the portrait is a server-rendered image rather than a hydration-only avatar', () => {
  const personal = getCVData().personal
  const html = fs.readFileSync('out/index.html', 'utf8')
  const portrait = [...html.matchAll(/<img\b[^>]*>/g)].find(([tag]) =>
    tag.includes('data-slot="avatar"'),
  )?.[0]
  assert(portrait, 'The initial HTML must contain the profile image')
  assert(portrait.includes(`src="${personal.profile_image}"`))
  assert(portrait.includes('loading="eager"'))
  assert(!portrait.includes('/_next/image'))
  const relative = personal.profile_image.replace(/^\//, '')
  const source = fs.readFileSync(path.join('public', relative))
  const exported = fs.readFileSync(path.join('out', relative))
  assert(source.equals(exported), 'The original portrait must be available in the static export')
})
