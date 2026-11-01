import { IBM_Plex_Sans } from 'next/font/google'

// Variable font: one file per subset instead of one per weight; latin-ext covers Turkish glyphs.
export const ibmPlexSans = IBM_Plex_Sans({
    variable: '--font-ibm-plex-sans',
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
})
