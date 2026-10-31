import assert from 'node:assert/strict'
import test from 'node:test'
import { mathFit } from '../../lib/math-layout.ts'

test('short formulas keep their original size', () => {
  assert.equal(mathFit(600, 200).scale, 1)
  assert.equal(mathFit(600, 300, 25).scale, 1)
})

test('wide formulas fit the container with rounding allowance', () => {
  const fit = mathFit(238, 900)
  assert(fit.scale > 0 && fit.scale < 1)
  assert(fit.width * fit.scale <= 236 + 1e-8)
})

test('equation numbers reserve space rather than overlapping the expression', () => {
  const withoutTag = mathFit(300, 290)
  const tagged = mathFit(300, 290, 30, 16)
  assert(tagged.width > withoutTag.width)
  assert(tagged.scale < withoutTag.scale)
  assert(tagged.width * tagged.scale <= 298 + 1e-8)
})

test('hidden/transient layouts never generate NaN or a zero font size', () => {
  for (const available of [0, 1, NaN, Infinity]) assert.equal(mathFit(available, 500).scale, 1)
  assert.equal(mathFit(300, 0).scale, 1)
  assert.equal(mathFit(300, NaN).scale, 1)
})
