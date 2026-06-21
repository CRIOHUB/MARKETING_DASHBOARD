import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Instrument_Serif } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CrioCord 2026 — Dashboard Marketing',
  description: 'Dashboard de marketing, ventas y operaciones CrioCord Perú 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
