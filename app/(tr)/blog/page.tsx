import BlogIndexPage from '@/components/blog/BlogIndexPage'
import { blogIndexMetadata } from '@/lib/blogSeo'

export const metadata = blogIndexMetadata('tr', 1)

export default function Page() {
    return <BlogIndexPage lang="tr" page={1} />
}
