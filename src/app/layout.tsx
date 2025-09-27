import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

// Validate environment variables at build time (safer approach)
if (typeof window === 'undefined') {
  try {
    require('@/lib/env-demo').validateEnvironment()
  } catch (error) {
    console.warn('Environment validation warning:', error)
  }
}

export const metadata: Metadata = {
  title: 'GST Invoices',
  description: 'A modern GST invoice management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
