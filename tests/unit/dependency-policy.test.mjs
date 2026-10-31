import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import nextConfig from '../../next.config.ts'
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants.js'

test('the lockfile is portable and matches the declared direct dependencies', () => {
  const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
  assert.equal(lock.name, manifest.name)
  assert.equal(lock.version, manifest.version)
  assert.deepEqual(lock.packages[''].dependencies, manifest.dependencies)
  assert.deepEqual(lock.packages[''].devDependencies, manifest.devDependencies)
  for (const key of Object.keys(lock.packages))
    assert(key === '' || key.startsWith('node_modules/'), key)
})

test('all math consumers resolve the same patched KaTeX version', () => {
  const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'))
  const version = lock.packages['node_modules/katex'].version
  const consumers = Object.entries(lock.packages).filter(
    ([key]) => key === 'node_modules/katex' || key.endsWith('/node_modules/katex'),
  )
  assert(consumers.length > 0)
  for (const [key, value] of consumers) assert.equal(value.version, version, key)
})

test('remote development hosts require explicit opt-in and never affect production', () => {
  const previous = process.env.NEXT_DEV_ALLOWED_ORIGINS
  try {
    delete process.env.NEXT_DEV_ALLOWED_ORIGINS
    assert.deepEqual(nextConfig(PHASE_DEVELOPMENT_SERVER).allowedDevOrigins, [])
    process.env.NEXT_DEV_ALLOWED_ORIGINS = ' 192.0.2.10, , dev.example.test '
    assert.deepEqual(nextConfig(PHASE_DEVELOPMENT_SERVER).allowedDevOrigins, [
      '192.0.2.10',
      'dev.example.test',
    ])
    assert.equal(nextConfig(PHASE_PRODUCTION_BUILD).allowedDevOrigins, undefined)
  } finally {
    if (previous === undefined) delete process.env.NEXT_DEV_ALLOWED_ORIGINS
    else process.env.NEXT_DEV_ALLOWED_ORIGINS = previous
  }
})

test('development and production use different framework caches', () => {
  const dev = nextConfig(PHASE_DEVELOPMENT_SERVER)
  const production = nextConfig(PHASE_PRODUCTION_BUILD)
  assert.equal(dev.distDir, '.next-dev')
  assert.equal(production.distDir, '.next')
  assert.equal(production.output, 'export')
  assert.equal(production.trailingSlash, true)
})
