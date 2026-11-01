'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/content/dictionary'
import { localeCookie, localeCookieMaxAge, localizedPath } from '@/lib/i18n'

interface LanguageSwitcherProps {
    target: Locale
    label: string
    className?: string
    onNavigate?: () => void
}

const LanguageSwitcher = ({ target, label, className, onNavigate }: LanguageSwitcherProps) => {
    const pathname = usePathname()

    const remember = () => {
        document.cookie = `${localeCookie}=${target}; path=/; max-age=${localeCookieMaxAge}; samesite=lax`
        onNavigate?.()
    }

    return (
        <a
            href={localizedPath(pathname, target)}
            hrefLang={target}
            aria-label={label}
            onClick={remember}
            className={className}
        >
            <span lang={target}>{target.toUpperCase()}</span>
        </a>
    )
}

export default LanguageSwitcher
