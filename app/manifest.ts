import type { MetadataRoute } from 'next'
import { siteConfig } from '../config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: siteConfig.name,
    short_name: siteConfig.author,
    description: 'Full Stack Software Developer Portfolio',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#eeeeee',
    theme_color: '#eeeeee',
    lang: 'tr',
    categories: ['business', 'developer-tools', 'portfolio'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
