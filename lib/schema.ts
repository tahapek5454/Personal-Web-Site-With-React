import { siteConfig } from '@/config/site'
import { getDict, type Locale } from '@/content/dictionary'
import type { Project } from '@/content/projects'
import { modifiedDate, topicLabel, type PostMeta } from './blog'
import { abs, absHome, paths, personId, websiteId } from './i18n'

const langTag = (lang: Locale) => (lang === 'tr' ? 'tr-TR' : 'en')

export function websiteNode() {
    return {
        '@type': 'WebSite',
        '@id': websiteId,
        url: absHome('tr'),
        name: siteConfig.name,
        inLanguage: ['tr-TR', 'en'],
        publisher: { '@id': personId },
    }
}

export function personNode(lang: Locale) {
    const dict = getDict(lang)
    return {
        '@type': 'Person',
        '@id': personId,
        name: siteConfig.author,
        jobTitle: dict.meta.jobTitle,
        description: dict.meta.schemaDescription,
        url: absHome('tr'),
        image: abs('/images/image1.jpeg'),
        email: siteConfig.email,
        sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.instagram],
        knowsLanguage: ['tr', 'en'],
        knowsAbout: [
            'Software Development', 'Full Stack Development', '.NET', 'C#', 'JavaScript', 'TypeScript', 'React',
            'Next.js', 'Vue.js', 'Nuxt.js', 'Docker', 'Kubernetes', 'Cloud Computing', 'Web Development',
            'LangChain', 'LangGraph', 'Microservices',
        ],
        worksFor: { '@type': 'Organization', name: 'Doğuş Teknoloji' },
        alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Kocaeli Üniversitesi',
            department: 'Bilgisayar Mühendisliği',
        },
    }
}

export function profilePageNode(lang: Locale) {
    const dict = getDict(lang)
    return {
        '@type': 'ProfilePage',
        '@id': `${absHome(lang)}#profilepage`,
        url: absHome(lang),
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: langTag(lang),
        dateModified: siteConfig.contentUpdatedAt,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
    }
}

export function projectNode(lang: Locale, project: Project) {
    const text = project.text[lang]
    const url = abs(paths.project(lang, project.slug))
    return {
        '@type': project.kind,
        '@id': `${url}#project`,
        url,
        name: text.title,
        description: text.longDescription,
        inLanguage: langTag(lang),
        codeRepository: project.githubUrl,
        keywords: project.technologies.join(', '),
        author: { '@id': personId },
        dateModified: siteConfig.contentUpdatedAt,
        ...(project.image ? { image: abs(project.image.src) } : {}),
        isPartOf: { '@id': `${absHome(lang)}#profilepage` },
    }
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: abs(item.path),
        })),
    }
}

export function graph(...nodes: object[]) {
    return { '@context': 'https://schema.org', '@graph': nodes }
}

export function blogPostingNode(lang: Locale, post: PostMeta) {
    const url = abs(paths.blogPost(lang, post.slug))
    const alt: Locale = lang === 'tr' ? 'en' : 'tr'
    return {
        '@type': 'BlogPosting',
        '@id': `${url}#post`,
        url,
        mainEntityOfPage: url,
        headline: post.title,
        description: post.description,
        inLanguage: langTag(lang),
        datePublished: post.date,
        dateModified: modifiedDate(post),
        wordCount: post.wordCount,
        articleSection: topicLabel(lang, post.topic).title,
        keywords: post.tags.join(', '),
        image: abs(post.cover ?? paths.blogOg(lang, post.slug)),
        author: { '@id': personId },
        publisher: { '@id': personId },
        isPartOf: { '@id': `${abs(paths.blog(lang))}#blog` },
        workTranslation: { '@id': `${abs(paths.blogPost(alt, post.slug))}#post` },
    }
}

export function blogNode(lang: Locale, posts: PostMeta[]) {
    const dict = getDict(lang)
    const url = abs(paths.blog(lang))
    return {
        '@type': 'Blog',
        '@id': `${url}#blog`,
        url,
        name: dict.blog.title,
        description: dict.blog.metaDescription,
        inLanguage: langTag(lang),
        isPartOf: { '@id': websiteId },
        publisher: { '@id': personId },
        blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            '@id': `${abs(paths.blogPost(lang, p.slug))}#post`,
            url: abs(paths.blogPost(lang, p.slug)),
            headline: p.title,
            datePublished: p.date,
        })),
    }
}
