import React from 'react'
import Link from 'next/link'
import MobileMenu from './MobileMenu'

const Navbar = () => {
    return (
        <nav className='w-full h-[80px] bg-white sticky top-0 z-50 shadow-sm'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full'>
                <div className='flex justify-between items-center h-full'>
                    <Link href='/' className='flex items-center'>
                        <span className='text-4xl  font-bold'>TAHA</span>
                        <span className='text-4xl  ml-1 font-[200]'>PEK</span>
                    </Link>
                    <div className='hidden md:flex items-center space-x-8'>
                        <Link href='#hakkimda' className='relative font-medium hover:text-gray-600 transition-colors duration-200 group'>
                            HAKKIMDA
                            <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link href='#tecrubeler' className='relative font-medium hover:text-gray-600 transition-colors duration-200 group'>
                            TECRÜBELERİM
                            <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link href='#kabiliyetler' className='relative font-medium hover:text-gray-600 transition-colors duration-200 group'>
                            KABİLİYETLERİM
                            <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link href='#projeler' className='relative font-medium hover:text-gray-600 transition-colors duration-200 group'>
                            PROJELER
                            <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                        <Link href="mailto:tahapek5454@gmail.com?subject=İletişim - Kişisel Web Sitesi&body=Merhaba Taha," className='relative font-medium hover:text-gray-600 transition-colors duration-200 group'>
                            İLETİŞİM
                            <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-gray-800 transition-all duration-300 group-hover:w-full'></span>
                        </Link>
                    </div>
                    <MobileMenu />
                </div>
            </div>
        </nav>
    )
}

export default Navbar