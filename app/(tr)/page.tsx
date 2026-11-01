import HomePage from '@/components/sections/HomePage'
import { getDict } from '@/content/dictionary'
import { pageMetadata } from '@/lib/seo'

const dict = getDict('tr')

export const metadata = pageMetadata({
    lang: 'tr',
    title: dict.meta.title,
    absoluteTitle: true,
    description: dict.meta.description,
    alternates: { tr: '/', en: '/en' },
    markdown: '/index.md',
})

export default function Page() {
    return <HomePage lang="tr" />
}
