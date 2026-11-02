import assert from 'node:assert/strict'
import test from 'node:test'
import { eagerImageCount, INITIAL_EAGER_IMAGE_COUNT } from '../../lib/drawer-loading.ts'

const row = (number, count, height) =>
  Array.from({ length: count }, () => ({ row: number, width: 100, height, justified: true }))
const tiles = [...row(0, 3, 100), ...row(1, 2, 140), ...row(2, 4, 90), ...row(3, 3, 100)]

test('static HTML starts a bounded leading group without knowing the viewport', () => {
  assert.equal(INITIAL_EAGER_IMAGE_COUNT, 3)
  assert.equal(eagerImageCount([], 0, 16), 3)
  for (const height of [0, -1, NaN, Infinity]) assert.equal(eagerImageCount(tiles, height, 16), 3)
})

test('every image in a partially visible row is eager, not just the first tile', () => {
  assert.equal(eagerImageCount(tiles, 100, 16), 3)
  assert.equal(eagerImageCount(tiles, 116, 16), 3)
  assert.equal(eagerImageCount(tiles, 117, 16), 5)
  assert.equal(eagerImageCount(tiles, 272, 16), 5)
  assert.equal(eagerImageCount(tiles, 273, 16), 9)
})

test('viewport height and row gaps determine the fold without eager-loading the entire gallery', () => {
  assert.equal(eagerImageCount(tiles, 270, 0), 9)
  assert.equal(eagerImageCount(tiles, 270, 16), 5)
  assert.equal(eagerImageCount(tiles, 400, 16), 12)
  assert(eagerImageCount(tiles, 200, 16) < tiles.length)
})
