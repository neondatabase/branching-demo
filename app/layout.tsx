import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Database branches in subseconds',
  description: 'Instantly provison branches of a Postgres database on Neon.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(fontSans.variable, 'min-h-lvh w-full bg-black bg-[url(https://volta.net/home/hero.png)] bg-cover px-6 pt-24 font-sans md:px-4 lg:px-8')}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
