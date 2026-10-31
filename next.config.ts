import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

export default function nextConfig(phase: string): NextConfig {
  const development = phase === PHASE_DEVELOPMENT_SERVER
  const allowedDevOrigins = (process.env.NEXT_DEV_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)

  return {
    output: 'export',
    trailingSlash: true,
    // A production build must not overwrite an active development server's cache.
    distDir: development ? '.next-dev' : '.next',
    ...(development ? { allowedDevOrigins } : {}),
    images: { unoptimized: true },
  }
}
