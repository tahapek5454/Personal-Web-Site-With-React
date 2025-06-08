import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "../config/site";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.author}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  keywords: [
    "Taha Pek",
    "Software Developer",
    "Full Stack Developer", 
    "Frontend Developer",
    "Backend Developer",
    ".NET Developer",
    "React Developer",
    "Next.js Developer",
    "Vue.js Developer",
    "Nuxt.js Developer",
    "C# Developer",
    "JavaScript Developer",
    "TypeScript Developer",
    "Web Developer",
    "Kocaeli Üniversitesi",
    "Bilgisayar Mühendisliği",
    "Portfolio",
    "CV",
    "İletişim"
  ],
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description.split('.')[0] + '.',
  },
  verification: {
    google: siteConfig.googleSiteVerification,
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'tr-TR': siteConfig.url,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <meta name="copyright" content="© 2025 Taha Pek. Tüm hakları saklıdır." />
        <meta name="language" content="Turkish" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": siteConfig.author,
              "jobTitle": "Software Developer",
              "description": "Full Stack Software Developer specializing in .NET, Nuxt.js, React, Next.js, and Vue.js",
              "url": siteConfig.url,
              "sameAs": [
                siteConfig.social.github,
                siteConfig.social.linkedin,
                siteConfig.social.instagram
              ],
              "knowsAbout": [
                "Software Development",
                "Full Stack Development",
                ".NET",
                "C#",
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Vue.js",
                "Nuxt.js",
                "Docker",
                "Kubernetes",
                "Cloud Computing",
                "Web Development"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Doğuş Teknoloji"
              },
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Kocaeli Üniversitesi",
                "department": "Bilgisayar Mühendisliği"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "email": siteConfig.email,
                "contactType": "professional"
              }
            })
          }}
        />
      </head>
      <body
        className={`${ibmPlexSans.variable} font-ibm-plex-sans text-black antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
