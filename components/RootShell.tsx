import React from 'react'
import { getDict, type Locale } from '@/content/dictionary'
import { mailto, paths } from '@/lib/i18n'
import { graph, personNode, websiteNode } from '@/lib/schema'
import { ibmPlexSans } from '@/lib/fonts'
import Footer from './Footer'
import JsonLd from './JsonLd'
import Navbar, { type NavLinks } from './Navbar'

export default function RootShell({ lang, children }: { lang: Locale; children: React.ReactNode }) {
    const dict = getDict(lang)
    const home = paths.home(lang)
    const links: NavLinks = {
        homeHref: home,
        homeLabel: dict.nav.homeLabel,
        menuLabel: dict.nav.menu,
        items: [
            { href: `${home}#${dict.ids.about}`, label: dict.nav.about },
            { href: `${home}#${dict.ids.experience}`, label: dict.nav.experience },
            { href: `${home}#${dict.ids.skills}`, label: dict.nav.skills },
            { href: `${home}#${dict.ids.projects}`, label: dict.nav.projects },
            { href: paths.blog(lang), label: dict.nav.blog },
        ],
        contact: { href: mailto(dict.mail.subject, dict.mail.body), label: dict.nav.contact },
        language: { target: lang === 'tr' ? 'en' : 'tr', label: dict.nav.switchLanguage },
    }

    return (
        <html lang={dict.htmlLang} suppressHydrationWarning>
            <body suppressHydrationWarning className={`${ibmPlexSans.variable} font-ibm-plex-sans text-black antialiased`}>
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-black focus:px-4 focus:py-2 focus:text-white"
                >
                    {dict.nav.skip}
                </a>
                <JsonLd data={graph(websiteNode(), personNode(lang))} />
                <Navbar links={links} />
                {children}
                <Footer lang={lang} />
            </body>
        </html>
    )
}
