import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rooted with Eva - Discover, Track, and Grow',
  description: 'Your personal plant journal and care companion. Discover new plants, track their care, and find local plant shops.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}