import type { MetadataRoute } from 'next'
import type { Locale } from '../content/dictionary'
import { siteConfig } from '../config/site'
import { projects } from '../content/projects'
import { getPosts, getTopics, modifiedDate, pageCount } from '../lib/blog'
import { abs, locales, paths } from '../lib/i18n'

type Entry = MetadataRoute.Sitemap[number]

// One entry per locale. hreflang lives in each page's <link rel="alternate">; xhtml:link here makes browsers render the XML as plain text.
function bilingual(
  path: (lang: Locale) => string,
  lastModified: string,
  changeFrequency: Entry['changeFrequency'],
  priority: (lang: Locale) => number,
): Entry[] {
  return locales.map((lang) => ({
    url: abs(path(lang)),
    lastModified,
    changeFrequency,
    priority: priority(lang),
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts('tr')
  const latestPost = [...posts, ...getPosts('en')].map(modifiedDate).sort().at(-1)
  const homeModified =
    latestPost && latestPost > siteConfig.contentUpdatedAt ? latestPost : siteConfig.contentUpdatedAt

  const home = bilingual(paths.home, homeModified, 'monthly', (lang) => (lang === 'tr' ? 1 : 0.9))

  const projectEntries = projects.flatMap((project) =>
    bilingual(
      (lang) => paths.project(lang, project.slug),
      siteConfig.contentUpdatedAt,
      'yearly',
      (lang) => (lang === 'tr' ? 0.7 : 0.6),
    ),
  )

  const blogEntries: Entry[] = latestPost
    ? [
        ...bilingual(paths.blog, latestPost, 'weekly', () => 0.8),
        ...Array.from({ length: pageCount(posts.length) - 1 }, (_, i) =>
          bilingual((lang) => paths.blogPage(lang, i + 2), latestPost, 'weekly', () => 0.5),
        ).flat(),
        ...getTopics('tr').flatMap((topic) =>
          bilingual((lang) => paths.blogTopic(lang, topic.key), topic.latest, 'weekly', () => 0.6),
        ),
        ...posts.flatMap((post) =>
          bilingual(
            (lang) => paths.blogPost(lang, post.slug),
            modifiedDate(post),
            'monthly',
            (lang) => (lang === 'tr' ? 0.7 : 0.6),
          ),
        ),
      ]
    : []

  return [...home, ...projectEntries, ...blogEntries]
}
