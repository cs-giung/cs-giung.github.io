import { encodeEmail, emailFallback } from '@/lib/email-obfuscation'
import { EmailLink } from './email-link'

interface EmailContactProps {
  address: string
  className?: string
}

// Server component: only the encoded value and readable fallback cross the
// client boundary. Passing the plain address to EmailLink would expose it in RSC data.
export function EmailContact({ address, className }: EmailContactProps) {
  return (
    <EmailLink
      encoded={encodeEmail(address)}
      fallback={emailFallback(address)}
      className={className}
    />
  )
}
