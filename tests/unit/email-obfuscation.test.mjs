import assert from 'node:assert/strict'
import test from 'node:test'
import { encodeEmail, decodeEmail, emailFallback } from '../../lib/email-obfuscation.ts'

test('email conversion round-trips normal and Unicode addresses', () => {
  for (const address of [
    'reader@example.com',
    'first.last+cv@lab.example.ac.kr',
    '\uC5F0\uB77D\uCC98@\uC608\uC2DC.\uD55C\uAD6D',
  ]) {
    const encoded = encodeEmail(address)
    assert.equal(decodeEmail(encoded), address)
    assert(!encoded.includes(address))
    assert(!encoded.includes('@'))
    assert(!encoded.includes('mailto:'))
    assert.equal(encodeEmail(address), encoded, 'SSR props must be deterministic')
  }
})

test('conversion handles empty input without producing a spurious character', () => {
  assert.equal(encodeEmail(''), '')
  assert.equal(decodeEmail(''), '')
})

test('the no-JS fallback is readable and needs no name placeholder substitution', () => {
  assert.equal(emailFallback('reader@lab.example.com'), 'reader [at] lab [dot] example [dot] com')
  assert.equal(emailFallback('first.last@example.com'), 'first [dot] last [at] example [dot] com')
})
