import React from 'react'
import Link from 'next/link'

function Footer() {
    return (
        <footer className='bg-black text-white'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                    <div className='md:col-span-2'>
                        <div className='flex items-center mb-4'>
                            <span className='text-3xl font-bold text-white'>TAHA</span>
                            <span className='text-3xl ml-1 font-[200] text-white'>PEK</span>
                        </div>
                        <p className='text-gray-300 text-sm leading-relaxed max-w-md'>
                            Software Developer
                        </p>
                        <div className='mt-6'>
                            <p className='text-gray-400 text-xs'>
                                © 2025 Taha Pek. Tüm hakları saklıdır.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold mb-4 text-white'>Hızlı Linkler</h3>
                        <div className='space-y-2'>
                            <Link href='#hakkimda' className='block text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                                Hakkımda
                            </Link>
                            <Link href='#tecrubeler' className='block text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                                Tecrübelerim
                            </Link>
                            <Link href='#kabiliyetler' className='block text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                                Kabiliyetlerim
                            </Link>
                            <Link href='#projeler' className='block text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                                Projeler
                            </Link>
                            <Link href="mailto:tahapek5454@gmail.com?subject=İletişim - Kişisel Web Sitesi&body=Merhaba Taha," className='block text-gray-300 hover:text-white transition-colors duration-200 text-sm'>
                                İletişim
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className='text-lg font-semibold mb-4 text-white'>Bağlantılar</h3>
                        <div className='space-y-3'>
                            <Link
                                href="https://github.com/tahapek5454"
                                target="_blank"
                                className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm'
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                <span>GitHub</span>
                            </Link>

                            <Link
                                href="https://www.linkedin.com/in/taha-pek-413b1b221/"
                                target="_blank"
                                className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm'
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                                <span>LinkedIn</span>
                            </Link>

                            <Link
                                href="https://www.instagram.com/tahapek"
                                target="_blank"
                                className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm'
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                <span>Instagram</span>
                            </Link>

                            <Link
                                href="mailto:tahapek5454@gmail.com?subject=İletişim - Kişisel Web Sitesi&body=Merhaba Taha,"
                                className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm'
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.887.492-1.667 1.205-2.05l.431-.183L12 8.949l10.364-5.725.431.183c.713.383 1.205 1.163 1.205 2.05z" />
                                </svg>
                                <span>tahapek5454@gmail.com</span>
                            </Link>

                            <Link
                                href="https://drive.google.com/file/d/1U53fwn20Z8e2nmEErx6jyiX_TJ8FScJK/view?usp=sharing"
                                target="_blank"
                                className='flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 text-sm'
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                </svg>
                                <span>CV İndir</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='border-t border-gray-800 mt-8 pt-6'>
                    <div className='flex flex-col md:flex-row justify-between items-center'>
                        <div className='text-gray-400 text-xs mb-4 md:mb-0'>
                            <span>Software Developer</span>
                            <span className='mx-2'>•</span>
                            <span>Sakarya, Türkiye</span>
                        </div>
                        <div className='text-gray-400 text-xs'>
                            <span>Next.js</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer