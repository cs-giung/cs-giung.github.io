import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { parse } from 'yaml'
import { parseFrontmatter } from '../lib/content-data.ts'

const rootFiles = new Set([
  '.gitignore',
  '.node-version',
  '.prettierignore',
  'LICENSE',
  'README.md',
  'components.json',
  'eslint.config.mjs',
  'next.config.ts',
  'package-lock.json',
  'package.json',
  'playwright.config.ts',
  'postcss.config.mjs',
  'prettier.config.mjs',
  'tsconfig.json',
])
const sourceDirectories = new Set([
  '.github',
  'app',
  'assets',
  'components',
  'data',
  'lib',
  'public',
  'scripts',
  'tests',
])
const reviewedPDFs = new Set([
  'public/260608.pdf',
  'public/260702.pdf',
  'public/advice-to-a-young-mathematician.pdf',
  'public/AdviceToAYoungMathematician.pdf',
  'public/the-hardware-lottery.pdf',
  'public/TheHardwareLottery.pdf',
  'public/you-and-your-research.pdf',
  'public/YouAndYourResearch.pdf',
])
const reviewedAssets = new Set([
  ...reviewedPDFs,
  'public/profile.jpg',
  'public/Box1976_Figure1.png',
  'public/Swift1726_Figure1.jpg',
  'public/google08a4171fdeccc94c.html',
  'public/sitemap_index.xml',
  'public/fonts/README.md',
])
const fontAsset =
  /^public\/fonts\/(?:geist|departure-mono|source-serif-4|noto-serif-tc)\/(?:[\w-]+\.woff2|OFL(?:-Mono)?\.txt|README\.md|subset\.json)$/
const forbiddenPath =
  /(?:^|\/)(?:\.env[^/]*|AGENTS\.md|CLAUDE\.md|\.local|docs|node_modules|\.next[^/]*|out|playwright-report|test-results|coverage)(?:\/|$)|dev(?:elopment)?-diagnostics/i
const sensitiveExtension = /\.(?:pem|key|p12|pfx|log|har|trace|sqlite\d?|db|bak|patch|zip)$/i
const secretPatterns = [
  /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /(?:\/Users\/|\/home\/)[^/\s]+\//,
  /[A-Z]:\\Users\\[^\\\s]+\\/,
]

export function inspectPublicEntry(file, buffer, { symlink = false } = {}) {
  const reasons = []
  const directory = file.split('/')[0]
  if (forbiddenPath.test(file) || sensitiveExtension.test(file))
    reasons.push('local, generated, or private path')
  if (!file.includes('/') ? !rootFiles.has(file) : !sourceDirectories.has(directory))
    reasons.push('path is outside the reviewed publication directories')
  if (directory === 'public' && !reviewedAssets.has(file) && !fontAsset.test(file))
    reasons.push('public asset has not been reviewed for publication')
  if (
    directory === 'data' &&
    !/^data\/(?:cv\.yaml|blog-links\.yaml|blog-redirects\.json|blog\/[a-z0-9-]+\.md)$/.test(file)
  )
    reasons.push('data file is not a published content source')
  if (
    directory === 'assets' &&
    !/^assets\/fonts\/geist\/(?:[\w-]+\.woff2|manifest\.json)$/.test(file)
  )
    reasons.push('bundled asset has not been reviewed for publication')
  if (
    ['app', 'components', 'lib', 'scripts'].includes(directory) &&
    !/\.(?:css|[cm]?[jt]sx?)$/.test(file)
  )
    reasons.push('non-source record inside a code directory')
  if (/\.pdf$/i.test(file)) {
    if (!reviewedPDFs.has(file)) reasons.push('PDF is not in the reviewed public asset list')
    if (!symlink && /\/Encrypt\b/.test(buffer.toString('latin1')))
      reasons.push('encrypted PDF cannot be reviewed')
  }
  if (symlink) {
    const target = buffer.toString('utf8')
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file), target))
    if (
      path.isAbsolute(target) ||
      resolved.startsWith('../') ||
      resolved === '..' ||
      !resolved.startsWith('public/')
    )
      reasons.push('symlink escapes the public asset directory')
    return reasons
  }
  if (buffer.includes(0) || /\.(?:pdf|woff2?|png|jpe?g|gif|webp|ico)$/i.test(file)) return reasons
  const source = buffer.toString('utf8')
  if (secretPatterns.some((pattern) => pattern.test(source)))
    reasons.push('credential-shaped text or local machine path')
  for (const match of source.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)) {
    const [a, b, c, d] = match[0].split('.').map(Number)
    if ([a, b, c, d].some((part) => part > 255)) continue
    if (
      a === 10 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    ) {
      reasons.push('private LAN or tailnet address')
      break
    }
  }
  if (file.startsWith('data/blog/') && file.endsWith('.md')) {
    try {
      if (parseFrontmatter(source, file).metadata.draft === true)
        reasons.push('unpublished draft in public content')
    } catch {
      reasons.push('invalid article metadata')
    }
  }
  if (file === 'data/cv.yaml') {
    try {
      const cv = parse(source)
      const allowed = new Set([
        'document',
        'personal',
        'honors',
        'service',
        'teaching',
        'talks',
        'education',
        'position',
        'publication',
      ])
      if (Object.keys(cv).some((key) => !allowed.has(key)))
        reasons.push('unused or private CV section')
      for (const entry of [...cv.honors, ...cv.teaching, ...cv.talks])
        if (!/^\d{4}$/.test(entry.period))
          reasons.push('CV date contains detail not displayed publicly')
    } catch {
      reasons.push('invalid CV data')
    }
  }
  return [...new Set(reasons)]
}

export function inspectCommitIdentity(identity) {
  return /<[^>]*@[^>]*\.(?:local|localhost)>/i.test(identity)
    ? [
        'commit identity exposes a local machine address; configure an explicit email, preferably GitHub noreply',
      ]
    : []
}

export function checkPublicRelease({ staged = false, cwd = process.cwd() } = {}) {
  const git = (args) => execFileSync('git', args, { cwd, maxBuffer: 32 * 1024 * 1024 })
  const files = new Map()
  if (staged) {
    for (const entry of git(['ls-files', '--stage', '-z']).toString().split('\0').filter(Boolean)) {
      const [metadata, file] = entry.split('\t')
      const [mode, hash, stage] = metadata.split(' ')
      if (stage !== '0') throw new Error('Resolve merge conflicts before checking publication.')
      files.set(file, { mode, hash })
    }
  } else {
    for (const file of git(['ls-files', '--cached', '--others', '--exclude-standard', '-z'])
      .toString()
      .split('\0')
      .filter(Boolean)) {
      if (fs.existsSync(path.join(cwd, file))) files.set(file, null)
    }
    // Ignored files inside public/ are still copied into the deployed export.
    function publicFiles(directory) {
      for (const entry of fs.readdirSync(path.join(cwd, directory), { withFileTypes: true })) {
        const file = `${directory}/${entry.name}`
        if (entry.isDirectory()) publicFiles(file)
        else files.set(file, null)
      }
    }
    if (fs.existsSync(path.join(cwd, 'public'))) publicFiles('public')
  }
  const violations = []
  for (const [file, index] of files) {
    const fullPath = path.join(cwd, file)
    const symlink = staged ? index.mode === '120000' : fs.lstatSync(fullPath).isSymbolicLink()
    const buffer = staged
      ? git(['cat-file', 'blob', index.hash])
      : symlink
        ? Buffer.from(fs.readlinkSync(fullPath))
        : fs.readFileSync(fullPath)
    for (const reason of inspectPublicEntry(file, buffer, { symlink }))
      violations.push(`${file}: ${reason}`)
  }
  return { checked: files.size, violations }
}

if (import.meta.main) {
  const staged = process.argv.includes('--staged')
  const result = checkPublicRelease({ staged })
  if (staged) {
    for (const variable of ['GIT_AUTHOR_IDENT', 'GIT_COMMITTER_IDENT']) {
      try {
        const identity = execFileSync('git', ['var', variable], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'pipe'],
        })
        for (const reason of inspectCommitIdentity(identity))
          result.violations.push(`${variable}: ${reason}`)
      } catch {
        result.violations.push(`${variable}: configure a commit identity before publication`)
      }
    }
  }
  if (result.violations.length) {
    console.error('Publication check failed:\n' + result.violations.join('\n'))
    process.exitCode = 1
  } else
    console.log(
      `PASS: ${result.checked} publication candidates contain no blocked local records, unreviewed PDFs, or recognized credential patterns.`,
    )
}
