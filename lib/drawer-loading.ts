import type { JustifiedTile } from './drawer-layout'

// Static HTML cannot know the viewport. Start the leading group before hydration.
export const INITIAL_EAGER_IMAGE_COUNT = 3

export function eagerImageCount(
  tiles: readonly JustifiedTile[],
  visibleHeight: number,
  gap: number,
): number {
  if (!Number.isFinite(visibleHeight) || visibleHeight <= 0) return INITIAL_EAGER_IMAGE_COUNT

  let top = 0
  let row = -1
  let rowHeight = 0
  let count = 0
  for (const tile of tiles) {
    if (tile.row !== row) {
      if (row !== -1) top += rowHeight + gap
      row = tile.row
      rowHeight = tile.height
    }
    if (top >= visibleHeight) break
    count++
  }
  return Math.max(INITIAL_EAGER_IMAGE_COUNT, count)
}
