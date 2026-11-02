import { siteConfig } from '@/config/site'
import { getDict, type Locale } from '@/content/dictionary'
import { projects, type Project } from '@/content/projects'
import { absoluteBody, getPosts, getTopics, modifiedDate, topicLabel, type Post } from './blog'
import { formatDate } from './blogShared'
import { abs, absHome, paths } from './i18n'

const list = (items: string[]) => items.map((i) => `- ${i}`).join('\n')

const postLine = (lang: Locale, post: Post) =>
    `- [${post.title}](${abs(paths.mdBlogPost(lang, post.slug))}) (${formatDate(lang, post.date)}): ${post.description}`

export function blogPostMarkdown(lang: Locale, post: Post): string {
    const t = getDict(lang).blog
    const alt: Locale = lang === 'tr' ? 'en' : 'tr'
    const dates = [`${formatDate(lang, post.date)}`, post.updated && post.updated !== post.date ? `${t.updatedOn}: ${formatDate(lang, modifiedDate(post))}` : '']
    return [
        `# ${post.title}`,
        '',
        `> ${post.description}`,
        '',
        `- ${dates.filter(Boolean).join(' · ')}`,
        `- ${t.topic}: ${topicLabel(lang, post.topic).title}`,
        ...(post.tags.length ? [`- ${t.tagsLabel}: ${post.tags.join(', ')}`] : []),
        `- HTML: ${abs(paths.blogPost(lang, post.slug))}`,
        `- ${alt === 'tr' ? 'Türkçe' : 'English'}: ${abs(paths.mdBlogPost(alt, post.slug))}`,
        '',
        absoluteBody(post),
        '',
    ].join('\n')
}

export function blogIndexMarkdown(lang: Locale): string {
    const t = getDict(lang).blog
    const posts = getPosts(lang)
    const sections = getTopics(lang).flatMap((topic) => [
        `## ${topic.title}`,
        '',
        ...posts.filter((p) => p.topic === topic.key).map((p) => postLine(lang, p)),
        '',
    ])
    return [`# ${t.title}`, '', `> ${t.metaDescription}`, '', `- HTML: ${abs(paths.blog(lang))}`, `- RSS: ${abs(paths.blogRss(lang))}`, '', ...sections].join('\n')
}

export function projectMarkdown(lang: Locale, project: Project): string {
    const dict = getDict(lang)
    const t = dict.projectPage
    const text = project.text[lang]
    return [
        `# ${text.title}`,
        '',
        `> ${text.description}`,
        '',
        text.longDescription,
        '',
        `## ${t.technologies}`,
        '',
        list(project.technologies),
        '',
        `## ${t.source}`,
        '',
        `- [${t.githubCta}](${project.githubUrl})`,
        `- [${t.home}](${absHome(lang)}) · [HTML](${abs(paths.project(lang, project.slug))})`,
        '',
    ].join('\n')
}

export function homeMarkdown(lang: Locale): string {
    const dict = getDict(lang)
    const h = dict.header
    const alt: Locale = lang === 'tr' ? 'en' : 'tr'

    const experience = dict.experience.items.map((e) =>
        [`### ${e.title} — ${e.company}`, '', `${e.period}`, '', e.description, '', `${dict.experience.title}: ${e.skills.join(', ')}`, ''].join('\n'),
    )

    const projectList = projects.map((p) => {
        const text = p.text[lang]
        return `### [${text.title}](${abs(paths.mdProject(lang, p.slug))})\n\n${text.description}\n\n${text.longDescription}\n\n${dict.projectPage.technologies}: ${p.technologies.join(', ')}\n\nGitHub: ${p.githubUrl}\n`
    })

    const recent = getPosts(lang).slice(0, 5)
    const latestPosts = recent.length
        ? ['', `## ${dict.blog.title}`, '', ...recent.map((p) => postLine(lang, p)), '', `- [${dict.blog.viewAll}](${abs(paths.mdBlog(lang))})`, '']
        : []

    return [
        `# Taha Pek — ${dict.meta.jobTitle}`,
        '',
        `> ${dict.meta.description}`,
        '',
        h.bio.join(' '),
        '',
        `- Web: ${absHome(lang)}`,
        `- ${lang === 'tr' ? 'English' : 'Türkçe'}: ${absHome(alt)}`,
        `- Email: ${siteConfig.email}`,
        `- GitHub: ${siteConfig.social.github}`,
        `- LinkedIn: ${siteConfig.social.linkedin}`,
        `- CV: ${siteConfig.cvUrl}`,
        '',
        `## ${dict.about.title}`,
        '',
        ...dict.about.paragraphs.flatMap((p) => [p, '']),
        `### ${dict.about.expertiseTitle}`,
        '',
        list(dict.about.expertise.map((e) => `**${e.title}**: ${e.description}`)),
        '',
        `## ${dict.experience.title}`,
        '',
        ...experience,
        `## ${dict.abilities.title}`,
        '',
        ...dict.abilities.items.flatMap((a) => [`### ${a.title}`, '', a.description, '']),
        `## ${dict.projects.title}`,
        '',
        ...projectList,
        ...latestPosts,
    ].join('\n')
}

export function llmsTxt(): string {
    const tr = getDict('tr')
    const en = getDict('en')
    const blogSections = (['en', 'tr'] as const).flatMap((lang) => {
        const posts = getPosts(lang)
        if (posts.length === 0) return []
        return [
            lang === 'en' ? '## Blog (English)' : '## Blog (Türkçe)',
            '',
            `- [${getDict(lang).blog.title} index (Markdown)](${abs(paths.mdBlog(lang))})`,
            ...posts.map((p) => postLine(lang, p)),
            '',
        ]
    })
    return [
        '# Taha Pek',
        '',
        `> ${en.meta.schemaDescription} Personal portfolio of a Specialist Software Developer at Doğuş Teknoloji (Türkiye). Content is available in Turkish and English; every page has a Markdown twin.`,
        '',
        '## Main pages',
        '',
        `- [Home — English (Markdown)](${abs(paths.mdHome('en'))}): ${en.meta.description}`,
        `- [Ana sayfa — Türkçe (Markdown)](${abs(paths.mdHome('tr'))}): ${tr.meta.description}`,
        `- [Home — English (HTML)](${absHome('en')})`,
        `- [Ana sayfa — Türkçe (HTML)](${absHome('tr')})`,
        '',
        '## Projects',
        '',
        ...projects.map((p) => `- [${p.text.en.title}](${abs(paths.mdProject('en', p.slug))}): ${p.text.en.description}`),
        '',
        ...blogSections,
        '## Optional',
        '',
        `- [Full content in one file](${abs('/llms-full.txt')}): Turkish and English home pages, all projects and all blog posts`,
        `- [GitHub](${siteConfig.social.github})`,
        `- [LinkedIn](${siteConfig.social.linkedin})`,
        `- [Resume](${siteConfig.cvUrl})`,
        '',
    ].join('\n')
}

export function llmsFullTxt(): string {
    const parts = [llmsTxt()]
    for (const lang of ['en', 'tr'] as const) {
        parts.push('---', '', homeMarkdown(lang))
        for (const p of projects) parts.push('---', '', projectMarkdown(lang, p))
        for (const post of getPosts(lang)) parts.push('---', '', blogPostMarkdown(lang, post))
    }
    return parts.join('\n')
}
