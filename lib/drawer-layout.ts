export interface JustifiedTile {
  width: number
  height: number
  row: number
  justified: boolean
}

interface LayoutOptions {
  targetHeight?: number
  gap?: number
  maxItemsPerRow?: number
}

// Preserve source order and aspect ratios. Completed rows fill the container;
// the last row may be shorter, but never grows beyond the target height.
export function justifiedLayout(
  aspects: readonly number[],
  width: number,
  { targetHeight = 192, gap = 16, maxItemsPerRow = Infinity }: LayoutOptions = {},
): JustifiedTile[] {
  if (
    !Number.isFinite(width) ||
    width <= 1 ||
    !Number.isFinite(targetHeight) ||
    targetHeight <= 0 ||
    !Number.isFinite(gap) ||
    gap < 0 ||
    !(maxItemsPerRow >= 1) ||
    aspects.some((aspect) => !Number.isFinite(aspect) || aspect <= 0)
  )
    return []

  // CSS layout uses subpixels. Quantize widths so rounding cannot wrap a row.
  const quantize = (value: number) => Math.floor(value * 64) / 64
  const available = quantize(width)
  const tiles: JustifiedTile[] = []
  let start = 0
  let row = 0

  while (start < aspects.length) {
    let end = start + 1
    let sum = aspects[start]
    while (end < aspects.length && end - start < maxItemsPerRow) {
      const currentHeight = (available - gap * (end - start - 1)) / sum
      if (currentHeight <= targetHeight) break
      const nextSpace = available - gap * (end - start)
      if (nextSpace <= 0) break
      const nextHeight = nextSpace / (sum + aspects[end])
      if (
        nextHeight <= targetHeight &&
        Math.abs(currentHeight - targetHeight) <= Math.abs(nextHeight - targetHeight)
      )
        break
      sum += aspects[end]
      end++
    }

    const imageSpace = available - gap * (end - start - 1)
    const fittedHeight = imageSpace / sum
    const finalRow = end === aspects.length
    const height = finalRow ? Math.min(targetHeight, fittedHeight) : fittedHeight
    const justified = !finalRow || fittedHeight <= targetHeight
    let used = 0
    for (let index = start; index < end; index++) {
      const tileWidth =
        justified && index === end - 1 ? imageSpace - used : quantize(aspects[index] * height)
      tiles.push({ width: tileWidth, height, row, justified })
      used += tileWidth
    }
    start = end
    row++
  }
  return tiles
}
