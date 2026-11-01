import '../globals.css'
import RootShell from '@/components/RootShell'
import { baseMetadata } from '@/lib/seo'
import { sharedViewport } from '@/lib/viewport'

export const metadata = baseMetadata('en')
export const viewport = sharedViewport

export default function EnLayout({ children }: { children: React.ReactNode }) {
    return <RootShell lang="en">{children}</RootShell>
}
