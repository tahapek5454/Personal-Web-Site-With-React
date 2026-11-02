import type { Locale } from '@/content/dictionary'

export interface TopicInfo {
    title: string
    description: string
}

/**
 * Optional localized labels for the `topic` key used in post frontmatter.
 * Unlisted topics still work and fall back to a humanized key.
 */
export const topicInfo: Record<string, Record<Locale, TopicInfo>> = {
    ai: {
        tr: { title: 'Yapay Zeka', description: 'Yapay zeka ajanları, LangChain ve LLM tabanlı sistemler üzerine yazılar.' },
        en: { title: 'AI', description: 'Articles on AI agents, LangChain and LLM-based systems.' },
    },
    python: {
        tr: { title: 'Python', description: 'Python ekosistemi, kütüphaneler ve mimari notları.' },
        en: { title: 'Python', description: 'Notes on the Python ecosystem, libraries and architecture.' },
    },
    dotnet: {
        tr: { title: '.NET', description: '.NET ve C# ile backend geliştirme üzerine yazılar.' },
        en: { title: '.NET', description: 'Articles on backend development with .NET and C#.' },
    },
}
