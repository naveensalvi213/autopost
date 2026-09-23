import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['cloudinary', 'googleapis'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' }
    ],
  },
}

export default nextConfig
