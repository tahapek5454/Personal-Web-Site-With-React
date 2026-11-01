import type { MetadataRoute } from 'next'
import { siteConfig } from '../config/site'
import { projects } from '../content/projects'
import { abs, paths } from '../lib/i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = siteConfig.contentUpdatedAt

  const home: MetadataRoute.Sitemap[number] = {
    url: abs(paths.home('tr')),
    lastModified,
    changeFrequency: 'monthly',
    priority: 1,
    alternates: {
      languages: {
        'tr-TR': abs(paths.home('tr')),
        en: abs(paths.home('en')),
      },
    },
  }

  const homeEn: MetadataRoute.Sitemap[number] = {
    url: abs(paths.home('en')),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.9,
    alternates: home.alternates,
  }

  const projectEntries = projects.flatMap((project) => {
    const alternates = {
      languages: {
        'tr-TR': abs(paths.project('tr', project.slug)),
        en: abs(paths.project('en', project.slug)),
      },
    }
    return (['tr', 'en'] as const).map((lang) => ({
      url: abs(paths.project(lang, project.slug)),
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: lang === 'tr' ? 0.7 : 0.6,
      alternates,
    }))
  })

  return [home, homeEn, ...projectEntries]
}
