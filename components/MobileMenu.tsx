'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Menu from '@/public/icons/menu.svg'

const MobileMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    // Hydration güvenliği için mounted durumunu kontrol et
    if (!mounted) {
        return (
            <button
                className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
                aria-label='Menu'
            >
                <Image src={Menu} alt="Menu" className='text-black' width={32} height={32} />
            </button>
        )
    }

    return (
        <>
            <button
                onClick={toggleMenu}
                className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200'
                aria-label='Menu'
            >
                <Image src={Menu} alt="Menu" className='text-black' width={32} height={32} />
            </button>

            <div className={`md:hidden absolute top-[80px] left-0 w-full bg-white shadow-lg transform transition-all duration-300 ease-in-out z-40 ${
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}>
                <div className='px-4 py-6 space-y-4'>
                    <Link 
                        href='#hakkimda' 
                        onClick={closeMenu}
                        className='block font-medium py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                    >
                        HAKKIMDA
                    </Link>
                    <Link 
                        href='#tecrubeler' 
                        onClick={closeMenu}
                        className='block font-medium py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                    >
                        TECRÜBELERİM
                    </Link>
                    <Link 
                        href='#projeler' 
                        onClick={closeMenu}
                        className='block font-medium py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                    >
                        PROJELER
                    </Link>
                    <Link 
                        href='#iletisim' 
                        onClick={closeMenu}
                        className='block font-medium py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                    >
                        İLETİŞİM
                    </Link>
                </div>
            </div>
        </>
    )
}

export default MobileMenu
