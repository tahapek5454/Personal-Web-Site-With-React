import './globals.css'
import type { Metadata } from 'next'
import RootShell from '@/components/RootShell'
import NotFoundContent from '@/components/NotFoundContent'

export const metadata: Metadata = { title: '404' }

// Unmatched URLs: language is unknown, so render the Turkish default site shell.
export default function GlobalNotFound() {
    return (
        <RootShell lang="tr">
            <NotFoundContent lang="tr" />
        </RootShell>
    )
}
