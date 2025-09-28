import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable static generation for better performance (only in production)
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 31536000 : 60, // 1 year in prod, 1 min in dev
  },

  // Compression (only in production)
  compress: process.env.NODE_ENV === 'production',

  // Better source maps for development debugging
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',

  // Headers for better caching (environment-aware)
  async headers() {
    const isProd = process.env.NODE_ENV === 'production'

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: isProd
              ? 'public, s-maxage=60, stale-while-revalidate=300'
              : 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: isProd ? 'public, max-age=31536000, immutable' : 'no-cache',
          },
        ],
      },
    ]
  },
}

export default nextConfig
