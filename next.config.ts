import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable static generation for better performance (only in production)
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),

  // Experimental features for better performance
  experimental: {
    // // Enable Partial Prerendering for faster navigation
    // ppr: process.env.NODE_ENV === 'production',
    // Enable React Compiler for better optimization
    reactCompiler: true,
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@supabase/supabase-js'],
  },

  // Turbopack configuration (moved from experimental.turbo)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: process.env.NODE_ENV === 'production' ? 31536000 : 60, // 1 year in prod, 1 min in dev
  },

  // Compression (only in production)
  compress: process.env.NODE_ENV === 'production',

  // Better source maps for development debugging
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',

  // Bundle analyzer for optimization
  webpack: (config, { isServer, webpack }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    // Add webpack plugins for better performance
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    )

    return config
  },

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
