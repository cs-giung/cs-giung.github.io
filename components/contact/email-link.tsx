'use client'

import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'
import { decodeEmail } from '@/lib/email-obfuscation'

interface EmailLinkProps {
  encoded: string
  fallback: string
  className?: string
}

const clientSnapshot = () => true
const serverSnapshot = () => false

function subscribe(beforePrint: () => void) {
  // A browser print event must flush the hydration snapshot before capture.
  const restore = () => flushSync(beforePrint)
  window.addEventListener('beforeprint', restore)
  return () => window.removeEventListener('beforeprint', restore)
}

export function EmailLink({ encoded, fallback, className }: EmailLinkProps) {
  // SSR and the first hydration render use only the fallback. No cascading
  // effect/state update is needed, and prop changes decode immediately.
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
  const address = hydrated ? decodeEmail(encoded) : null

  return (
    <span data-email-contact="">
      {address ? (
        <a className={className} href={`mailto:${address}`}>
          {address}
        </a>
      ) : (
        fallback
      )}
    </span>
  )
}
