import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

test('the deployed export excludes local records, diagnostics, drafts, and retired private assets', () => {
  for (const file of [
    'AGENTS.md',
    'docs',
    '.local',
    '.env.development.local',
    'CV.pdf',
    '261002.pdf',
    '261006.pdf',
    '261020.pdf',
    'avatar_scholar_256.png',
    'dev-diagnostics.html',
    'blog/testing-blog-post',
  ])
    assert(!fs.existsSync(path.join('out', file)), file)
  for (const file of ['out/index.html', 'out/cv/index.html', 'out/blog/index.html']) {
    const html = fs.readFileSync(file, 'utf8')
    assert(!html.includes('development-error-capture'), file)
    assert(!html.includes('__siteDevelopmentErrors'), file)
  }
})
