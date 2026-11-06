import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { runChecks } from '../../scripts/check.mjs'

test('checks start concurrently, wait for every task, and retain failures', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'parallel-checks-'))
  const npmCli = path.join(directory, 'npm-fixture.mjs')
  try {
    fs.writeFileSync(
      npmCli,
      `import fs from 'node:fs'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
const name = process.argv[3]
const marker = (task) => path.join(import.meta.dirname, task)
fs.writeFileSync(marker(name), '')
if (name === 'failure') process.exit(7)
const peer = name === 'first' ? 'second' : 'first'
const deadline = Date.now() + 5000
while (!fs.existsSync(marker(peer))) {
  if (Date.now() > deadline) process.exit(8)
  await setTimeout(10)
}
fs.writeFileSync(marker(name + '-done'), '')
`,
    )
    const results = await runChecks(['first', 'failure', 'second'], { npmCli, log: () => {} })
    assert.deepEqual(results, [
      { name: 'first', code: 0 },
      { name: 'failure', code: 7 },
      { name: 'second', code: 0 },
    ])
    assert(fs.existsSync(path.join(directory, 'first-done')))
    assert(fs.existsSync(path.join(directory, 'second-done')))
  } finally {
    fs.rmSync(directory, { recursive: true, force: true })
  }
})

test('direct check invocation explains the required npm entry point', async () => {
  await assert.rejects(runChecks(['test'], { npmCli: null }), /npm run check/)
})
