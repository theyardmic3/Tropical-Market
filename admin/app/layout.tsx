"use client"

import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/modal-provider'
import { ToasterProvider } from '@/providers/toast-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import React, { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return null or a loader for SSR compatibility
    return null;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ToasterProvider />
            <ModalProvider />
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
