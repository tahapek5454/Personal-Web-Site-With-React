import HomePage from '@/components/sections/HomePage'
import { getDict } from '@/content/dictionary'
import { pageMetadata } from '@/lib/seo'

const dict = getDict('en')

export const metadata = pageMetadata({
    lang: 'en',
    title: dict.meta.title,
    absoluteTitle: true,
    description: dict.meta.description,
    alternates: { tr: '/', en: '/en' },
    markdown: '/en/index.md',
})

export default function Page() {
    return <HomePage lang="en" />
}
