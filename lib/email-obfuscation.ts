// Reversible obfuscation for basic HTML harvesters, not encryption or secrecy.
// Keep this module free of the actual contact address: it is also bundled for the browser.
export function encodeEmail(address: string): string {
  return Array.from(new TextEncoder().encode(address), (byte, index) =>
    (byte ^ ((91 + index * 17) & 255)).toString(36),
  )
    .reverse()
    .join('.')
}

export function decodeEmail(encoded: string): string {
  if (!encoded) return ''
  const bytes = encoded
    .split('.')
    .reverse()
    .map((part, index) => Number.parseInt(part, 36) ^ ((91 + index * 17) & 255))
  return new TextDecoder().decode(Uint8Array.from(bytes))
}

export function emailFallback(address: string): string {
  return address.replace('@', ' [at] ').replaceAll('.', ' [dot] ')
}
