import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Internal dashboard — don't let lint warnings block production deploys.
  // Run `npm run lint` separately during development.
  eslint: { ignoreDuringBuilds: true },
}

export default nextConfig
