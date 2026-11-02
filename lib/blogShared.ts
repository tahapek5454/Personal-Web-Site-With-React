import type { Locale } from '@/content/dictionary'

/** Serializable post summary, safe to pass to client components and JSON. */
export interface PostSummary {
    slug: string
    title: string
    description: string
    date: string
    topic: string
    topicTitle: string
    tags: string[]
    cover?: string
    readingMinutes: number
}

export const formatDate = (lang: Locale, iso: string) =>
    new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`))

export const formatTemplate = (template: string, n: number) => template.replace('{n}', String(n))

/** Lowercases and strips diacritics so "yapay" matches "Yapay" and "Ğ" matches "g". */
export const normalizeSearch = (lang: Locale, value: string) =>
    value
        .toLocaleLowerCase(lang === 'tr' ? 'tr-TR' : 'en-US')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ı/g, 'i')
