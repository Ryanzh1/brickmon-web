import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BrickMon | Track Lego Pokémon Stock & Prices',
  description: 'Real-time stock alerts for the new Kanto Region, Pikachu, and Eevee Lego sets. Don\'t pay scalper prices.',
  keywords: ['Lego Pokemon', 'BrickMon', 'Lego Stock Tracker', 'Kanto Region Set'],
  openGraph: {
    title: 'BrickMon | Track Lego Pokémon Stock & Prices',
    description: 'Real-time stock alerts for the new Kanto Region, Pikachu, and Eevee Lego sets. Don\'t pay scalper prices.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrickMon | Track Lego Pokémon Stock & Prices',
    description: 'Real-time stock alerts for the new Kanto Region, Pikachu, and Eevee Lego sets. Don\'t pay scalper prices.',
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
        <Navbar />
        {children}
      </body>
    </html>
  )
}
