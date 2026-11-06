import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import test from 'node:test'
import {
  checkPublicRelease,
  inspectPublicEntry,
  inspectCommitIdentity,
} from '../../scripts/check-public-release.mjs'

const inspect = (file, text) => inspectPublicEntry(file, Buffer.from(text))

test('publication policy rejects local records, diagnostics, drafts, and unreviewed PDFs', () => {
  for (const file of [
    'AGENTS.md',
    'docs/process.md',
    '.env.local',
    '.local/notes.md',
    'public/report.log',
    'public/personal-notes.md',
    'public/AdviceToAYoungMathematician.pdf',
    'public/TheHardwareLottery.pdf',
    'public/YouAndYourResearch.pdf',
    'public/Box1976_Figure1.png',
    'public/Swift1726_Figure1.jpg',
    'data/notes.yaml',
    'assets/private-record.txt',
    'lib/implementation-notes.md',
    'app/dev-diagnostics.html/route.ts',
  ])
    assert(inspect(file, '').length > 0, file)
  assert(inspect('public/unreviewed.pdf', '%PDF-1.4').length > 0)
  assert(inspect('public/260608.pdf', '%PDF-1.4 /Encrypt 1 0 R').length > 0)
  assert(inspect('data/blog/example.md', '---\ntitle: Example\ndraft: true\n---\nDraft').length > 0)
  assert.deepEqual(
    inspect('tests/fixtures/blog/draft.md', '---\ndraft: true\n---\nSynthetic fixture'),
    [],
  )
  assert(inspect('README.md', 'ghp_' + 'x'.repeat(36)).length > 0)
  assert(inspect('README.md', ['10', '0', '0', '1'].join('.')).length > 0)
  assert.deepEqual(inspect('README.md', 'Open http://localhost:3000 with a published profile.'), [])
})

test('Node version files are public configuration and stay in sync', () => {
  const nodeVersion = fs.readFileSync(new URL('../../.node-version', import.meta.url), 'utf8')
  const nvmVersion = fs.readFileSync(new URL('../../.nvmrc', import.meta.url), 'utf8')
  assert.equal(nodeVersion.trim(), '24')
  assert.equal(nvmVersion.trim(), nodeVersion.trim())
  assert.deepEqual(inspect('.node-version', nodeVersion), [])
  assert.deepEqual(inspect('.nvmrc', nvmVersion), [])
})

test('commit metadata must not expose automatically detected local machine addresses', () => {
  assert(inspectCommitIdentity('Example <dev@workstation.local> 0 +0000').length > 0)
  assert.deepEqual(
    inspectCommitIdentity('Example <12345+example@users.noreply.github.com> 0 +0000'),
    [],
  )
})

test('publication policy checks staged blobs rather than trusting a cleaned working copy', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'publication-test-'))
  const git = (...args) => execFileSync('git', args, { cwd, stdio: 'pipe' })
  try {
    git('init', '--quiet', '--initial-branch=main')
    fs.writeFileSync(path.join(cwd, 'README.md'), 'Public project information')
    git('add', 'README.md')
    fs.writeFileSync(path.join(cwd, 'README.md'), 'ghp_' + 'x'.repeat(36))
    assert(checkPublicRelease({ cwd }).violations.length > 0)
    assert.deepEqual(checkPublicRelease({ cwd, staged: true }).violations, [])
    git('add', 'README.md')
    fs.writeFileSync(path.join(cwd, 'README.md'), 'Public project information')
    assert.deepEqual(checkPublicRelease({ cwd }).violations, [])
    assert(checkPublicRelease({ cwd, staged: true }).violations.length > 0)
    fs.mkdirSync(path.join(cwd, 'public'))
    fs.writeFileSync(path.join(cwd, '.gitignore'), '.env*\n')
    fs.writeFileSync(path.join(cwd, 'public', '.env.local'), 'PRIVATE=value')
    assert(
      checkPublicRelease({ cwd }).violations.some((entry) =>
        entry.startsWith('public/.env.local:'),
      ),
    )
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true })
  }
})
