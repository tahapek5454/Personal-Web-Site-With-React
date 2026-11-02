import BlogIndexPage from '@/components/blog/BlogIndexPage'
import { blogIndexMetadata } from '@/lib/blogSeo'

export const metadata = blogIndexMetadata('en', 1)

export default function Page() {
    return <BlogIndexPage lang="en" page={1} />
}
