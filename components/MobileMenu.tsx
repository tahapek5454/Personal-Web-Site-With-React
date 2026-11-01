'use client'
import React, { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/content/dictionary'
import LanguageSwitcher from './LanguageSwitcher'

interface MobileMenuProps {
    label: string
    items: { href: string; label: string }[]
    language: { target: Locale; label: string }
}

const MobileMenu = ({ label, items, language }: MobileMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false)
                buttonRef.current?.focus()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen])

    return (
        <>
            <button
                ref={buttonRef}
                type='button'
                onClick={() => setIsOpen((open) => !open)}
                className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
                aria-label={label}
                aria-expanded={isOpen}
                aria-controls='mobile-menu'
            >
                <svg
                    aria-hidden='true'
                    width='32'
                    height='32'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                >
                    {isOpen ? (
                        <path d='M6 6l12 12M18 6L6 18' />
                    ) : (
                        <path d='M4 7h16M4 12h16M4 17h16' />
                    )}
                </svg>
            </button>

            <div
                id='mobile-menu'
                inert={!isOpen}
                className={`md:hidden absolute top-[80px] left-0 w-full bg-white shadow-lg transform transition-all duration-300 ease-in-out z-40 ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className='px-4 py-6 space-y-4'>
                    {items.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className='block font-medium py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                        >
                            {item.label}
                        </a>
                    ))}
                    <LanguageSwitcher
                        target={language.target}
                        label={language.label}
                        onNavigate={() => setIsOpen(false)}
                        className='block font-medium py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                    />
                </div>
            </div>
        </>
    )
}

export default MobileMenu
