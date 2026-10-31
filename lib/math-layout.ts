// Leave room on both sides so a centered expression cannot overlap its tag.
export function mathFit(available: number, expression: number, tag = 0, fontSize = 16) {
  const width = expression + (tag > 0 ? 2 * (tag + fontSize * 0.6) : 0)
  if (![available, width].every(Number.isFinite) || available <= 2 || width <= 0) {
    return { scale: 1, width: Math.max(0, Number.isFinite(width) ? width : 0) }
  }
  return { scale: Math.min(1, Math.max(0, available - 2) / width), width }
}
