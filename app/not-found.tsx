'use client'
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <div className="relative mb-8">
                    <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 bg-clip-text text-transparent animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-gray-200 -z-10 blur-sm">
                        404
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Oops! Sayfa Bulunamadı
                    </h2>
                    <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                        Aradığınız sayfa mevcut değil, taşınmış veya silinmiş olabilir.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">                    <Link
                    href="/"
                    className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                    🏠 Ana Sayfaya Dön
                </Link>
                </div>
            </div>
        </div>
    )
}