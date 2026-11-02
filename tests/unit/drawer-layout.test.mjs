import assert from 'node:assert/strict'
import test from 'node:test'
import { drawerImages } from '../../lib/drawer-data.ts'
import { justifiedLayout } from '../../lib/drawer-layout.ts'

const aspects = drawerImages
  .toSorted((a, b) => b.year - a.year)
  .map((entry) => entry.width / entry.height)

function rowsOf(tiles) {
  return [...new Set(tiles.map((tile) => tile.row))].map((row) =>
    tiles.filter((tile) => tile.row === row),
  )
}

test('completed gallery rows fill their width without cropping or reordering', () => {
  const original = [...aspects]
  for (const width of [480, 608, 736, 864, 1024.375]) {
    const tiles = justifiedLayout(aspects, width)
    assert.equal(tiles.length, aspects.length)
    tiles.forEach((tile, index) => {
      assert(tile.width > 0 && tile.height > 0)
      assert(Math.abs(tile.width - tile.height * aspects[index]) < aspects.length / 64)
    })
    const rows = rowsOf(tiles)
    rows.forEach((row, index) => {
      assert(row.every((tile) => tile.height === row[0].height))
      const used = row.reduce((sum, tile) => sum + tile.width, 0) + 16 * (row.length - 1)
      assert(used <= width)
      if (index < rows.length - 1 || row[0].justified) assert(Math.abs(used - width) < 1 / 64)
      else assert(row[0].height <= 192)
    })
  }
  assert.deepEqual(aspects, original)
})

test('a sparse last row is not inflated to fill the container', () => {
  const tiles = justifiedLayout([2, 2, 2, 1], 800)
  const rows = rowsOf(tiles)
  assert.equal(rows.length, 2)
  assert(rows[0].every((tile) => tile.justified))
  assert(rows[1].every((tile) => !tile.justified && tile.height === 192))
  assert.equal(justifiedLayout([1], 1000)[0].width, 192)
})

test('single-column layouts fill every row, including the final portrait', () => {
  for (const width of [273, 288.375, 358, 479]) {
    const tiles = justifiedLayout(aspects, width, { targetHeight: 160, maxItemsPerRow: 1 })
    assert.equal(rowsOf(tiles).length, aspects.length)
    tiles.forEach((tile, index) => {
      assert.equal(tile.width, width)
      assert(tile.justified)
      assert(Math.abs(tile.height * aspects[index] - width) < 1e-9)
    })
  }
  for (const aspect of [0.5, 1, 2.5]) {
    const [tile] = justifiedLayout([aspect], 358, { targetHeight: 160, maxItemsPerRow: 1 })
    assert.equal(tile.width, 358)
    assert.equal(tile.height, 358 / aspect)
    assert(tile.justified)
  }
})

test('invalid layout measurements are safe', () => {
  for (const width of [0, -1, Infinity, NaN]) assert.deepEqual(justifiedLayout(aspects, width), [])
  for (const ratio of [0, -1, Infinity, NaN]) assert.deepEqual(justifiedLayout([ratio], 800), [])
  assert.deepEqual(justifiedLayout([], 800), [])
  assert.deepEqual(justifiedLayout(aspects, 800, { targetHeight: 0 }), [])
  assert.deepEqual(justifiedLayout(aspects, 800, { gap: -1 }), [])
})
