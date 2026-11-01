import '../globals.css'
import RootShell from '@/components/RootShell'
import { baseMetadata } from '@/lib/seo'
import { sharedViewport } from '@/lib/viewport'

export const metadata = baseMetadata('tr')
export const viewport = sharedViewport

export default function TrLayout({ children }: { children: React.ReactNode }) {
    return <RootShell lang="tr">{children}</RootShell>
}
