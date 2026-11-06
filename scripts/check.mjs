import { spawn } from 'node:child_process'

const checks = ['check:public', 'lint', 'format:check', 'typecheck', 'test']

export async function runChecks(
  names,
  { npmCli = process.env.npm_execpath, log = console.log } = {},
) {
  if (!npmCli) throw new Error('Run checks through npm run check.')

  return Promise.all(
    names.map(
      (name) =>
        new Promise((resolve) => {
          const started = performance.now()
          log(`[check] Starting ${name}`)
          const child = spawn(process.execPath, [npmCli, 'run', name], { stdio: 'inherit' })
          child.once('error', (error) => log(`[check] ${name}: ${error.message}`))
          child.once('close', (code, signal) => {
            const elapsed = ((performance.now() - started) / 1000).toFixed(1)
            const passed = code === 0 && !signal
            log(
              `[check] ${passed ? 'PASS' : 'FAIL'} ${name} (${elapsed}s${signal ? `, ${signal}` : ''})`,
            )
            resolve({ name, code: passed ? 0 : code || 1 })
          })
        }),
    ),
  )
}

if (import.meta.main) {
  const results = await runChecks(checks)
  const failed = results.filter(({ code }) => code !== 0)
  if (failed.length) {
    console.error(`[check] Failed: ${failed.map(({ name }) => name).join(', ')}`)
    process.exitCode = 1
  } else {
    console.log('[check] All checks passed.')
  }
}
