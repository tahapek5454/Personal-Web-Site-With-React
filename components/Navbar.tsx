'use client'

import React, { useEffect, useState } from 'react'
import type { Locale } from '@/content/dictionary'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'

export interface NavLinks {
    homeHref: string
    homeLabel: string
    items: { href: string; label: string }[]
    contact: { href: string; label: string }
    menuLabel: string
    language: { target: Locale; label: string }
}

const linkClass =
    'relative py-1 font-medium hover:text-gray-600 transition-colors duration-200 group'
const underline =
    'absolute left-0 bottom-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full'

const Navbar = ({ links }: { links: NavLinks }) => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            aria-label={links.menuLabel}
            className={`w-full h-[80px] fixed top-0 z-50 shadow-sm transition-colors duration-300 hover:bg-white ${scrolled ? 'bg-white' : 'bg-transparent'}`}
        >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full'>
                <div className='flex justify-between items-center h-full'>
                    <a href={links.homeHref} aria-label={links.homeLabel} className='flex items-center'>
                        <span className='text-4xl font-bold'>TAHA</span>{' '}
                        <span className='text-4xl ml-1 font-[200]'>PEK</span>
                    </a>
                    <div className='hidden md:flex items-center space-x-4 lg:space-x-8'>
                        {links.items.map((item) => (
                            <a key={item.href} href={item.href} className={linkClass}>
                                {item.label}
                                <span className={underline}></span>
                            </a>
                        ))}
                        <a href={links.contact.href} className={linkClass}>
                            {links.contact.label}
                            <span className={underline}></span>
                        </a>
                        <LanguageSwitcher
                            target={links.language.target}
                            label={links.language.label}
                            className='rounded-md border border-gray-800 px-2 py-0.5 text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors duration-200'
                        />
                    </div>
                    <MobileMenu
                        label={links.menuLabel}
                        items={[...links.items, links.contact]}
                        language={links.language}
                    />
                </div>
            </div>
        </nav>
    )
}

export default Navbar
