import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { createExportServer } from '../../scripts/serve-export.mjs'

test('the local preview serves exported pages safely, including encoded chunk paths', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'export-preview-test-'))
  const root = path.join(directory, 'out')
  fs.mkdirSync(path.join(root, 'blog', '[slug]'), { recursive: true })
  fs.writeFileSync(path.join(root, 'index.html'), '<h1>Home</h1>')
  fs.writeFileSync(path.join(root, 'blog', 'index.html'), '<h1>Blog</h1>')
  fs.writeFileSync(path.join(root, 'blog', '[slug]', 'page.js'), 'export default 1')
  fs.writeFileSync(path.join(directory, 'private.txt'), 'private data')
  fs.symlinkSync('../private.txt', path.join(root, 'outside.txt'))
  const server = createExportServer(root)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const url = `http://127.0.0.1:${server.address().port}`
  try {
    assert.equal(await (await fetch(url)).text(), '<h1>Home</h1>')
    const redirect = await fetch(`${url}/blog?x=1`, { redirect: 'manual' })
    assert.equal(redirect.status, 308)
    assert.equal(redirect.headers.get('location'), '/blog/?x=1')
    const script = await fetch(`${url}/blog/%5Bslug%5D/page.js`)
    assert.match(script.headers.get('content-type'), /javascript/)
    assert.equal(await script.text(), 'export default 1')
    assert.equal((await fetch(url, { method: 'HEAD' })).headers.get('content-length'), '13')
    assert.equal((await fetch(url, { method: 'POST' })).status, 405)
    assert.equal((await fetch(`${url}/..%2fprivate.txt`)).status, 403)
    assert.equal((await fetch(`${url}/outside.txt`)).status, 403)
    assert.equal((await fetch(`${url}/missing`)).status, 404)
    assert.equal((await fetch(`${url}/bad%ZZ`)).status, 400)
  } finally {
    await new Promise((resolve) => server.close(resolve))
    fs.rmSync(directory, { recursive: true })
  }
})
