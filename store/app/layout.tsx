import { Footer, Navbar } from '@/components'
import './globals.css'
import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-provider'
import Head from 'next/head'

const urban = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bites By Brayo',
  description: 'Your Favorite Crunchie Stop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        {/* Viewport meta tag for responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <body className={urban.className}>
        <ModalProvider />
        <ToastProvider />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
