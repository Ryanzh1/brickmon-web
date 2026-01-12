import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import TreasureHuntBanner from '@/components/TreasureHuntBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lego Pokémon Stock Tracker | BrickMon | Check Kanto Set Availability',
  description: 'Real-time stock alerts for the new Kanto Region, Pikachu, and Eevee Lego sets. Don\'t pay scalper prices.',
  keywords: ['Lego Pokemon', 'Lego Kanto Region', 'Pikachu Lego Set', 'BrickMon', 'Lego Stock Tracker'],
  openGraph: {
    title: 'Lego Pokémon Stock Tracker | BrickMon | Check Kanto Set Availability',
    description: 'Real-time stock alerts for the new Kanto Region, Pikachu, and Eevee Lego sets. Don\'t pay scalper prices.',
    type: 'website',
    url: 'https://brickmon.com',
    siteName: 'BrickMon',
    images: [
      {
        url: 'https://brickmon.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BrickMon - Lego Pokémon Stock Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lego Pokémon Stock Tracker | BrickMon | Check Kanto Set Availability',
    description: 'Real-time stock alerts for the new Kanto Region, Pikachu, and Eevee Lego sets. Don\'t pay scalper prices.',
    images: ['https://brickmon.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://brickmon.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TreasureHuntBanner />
        <Navbar />
        {children}
      </body>
    </html>
  )
}
