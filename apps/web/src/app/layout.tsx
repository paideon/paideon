import type { Metadata } from 'next';

import {
  Cormorant_Garamond,
  Inter,
  JetBrains_Mono,
} from 'next/font/google'

import './global.css';

import { CustomCursor } from '@/app/components/layout/CustomCursor'
import { LoadingScreen } from '@/app/components/layout/LoadingScreen'

// Font Setup

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

// Metadata

export const metadata: Metadata = {
  title: 'NEXUS - C.W.W. Kannangara Central College Library',
  description: 'A modern library and learning management system for C.W.W. Kannangara Central College, Mathugama.',
}

// Root Layout

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Prevent theme flash — must run before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <LoadingScreen />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
