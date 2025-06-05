import React from 'react'
import Link from 'next/link'
import MobileMenu from './MobileMenu'

const Navbar = () => {
    return (
        <nav className='w-full h-[80px] bg-white sticky top-0 z-50 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full'>
                <div className='flex justify-between items-center h-full'>
                    <Link href='/' className='flex items-center'>
                        <h1 className='text-4xl font-bold'>TAHA</h1>
                        <h2 className='text-4xl ml-1 font-[200]'>PEK</h2>
                    </Link>
                    <div className='hidden md:flex items-center space-x-8'>
                        <Link href='#hakkimda' className='font-medium hover:text-gray-600 transition-colors duration-200'>
                            HAKKIMDA
                        </Link>
                        <Link href='#tecrubeler' className='font-medium hover:text-gray-600 transition-colors duration-200'>
                            TECRÜBELERİM
                        </Link>
                        <Link href='#projeler' className='font-medium hover:text-gray-600 transition-colors duration-200'>
                            PROJELER
                        </Link>
                        <Link href='#iletisim' className='font-medium hover:text-gray-600 transition-colors duration-200'>
                            İLETİŞİM
                        </Link>
                    </div>
                    <MobileMenu />
                </div>
            </div>
        </nav>
    )
}

export default Navbar