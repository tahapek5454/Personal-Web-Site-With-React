import type { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  ...(isProd
    ? [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        {
          key: 'Content-Security-Policy',
          // Next.js inline bootstrap scripts and JSON-LD require 'unsafe-inline' without per-request nonces.
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            'upgrade-insecure-requests',
          ].join('; '),
        },
      ]
    : []),
]

// Public assets keep stable filenames, so they are not marked immutable.
const staticAssetCache = {
  key: 'Cache-Control',
  value: 'public, max-age=2592000, stale-while-revalidate=86400',
}

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  productionBrowserSourceMaps: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 96, 192, 384],
    qualities: [75],
    localPatterns: [{ pathname: '/images/**' }, { pathname: '/icons/**' }, { pathname: '/logos/**' }],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 31536000,
    maximumDiskCacheSize: 500_000_000,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    removeConsole: isProd,
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/index.md', destination: '/md/tr' },
        { source: '/en/index.md', destination: '/md/en' },
        { source: '/projeler/:slug.md', destination: '/md/tr/:slug' },
        { source: '/en/projects/:slug.md', destination: '/md/en/:slug' },
        { source: '/blog.md', destination: '/md/tr/blog' },
        { source: '/en/blog.md', destination: '/md/en/blog' },
        { source: '/blog/:slug.md', destination: '/md/tr/blog/:slug' },
        { source: '/en/blog/:slug.md', destination: '/md/en/blog/:slug' },
      ],
    }
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/images/:path*', headers: [staticAssetCache] },
      { source: '/icons/:path*', headers: [staticAssetCache] },
      { source: '/logos/:path*', headers: [staticAssetCache] },
    ]
  },
}

export default nextConfig
