import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { EnhancedToastProvider } from '@/components/ui/enhanced-toast-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { ErrorBoundary } from '@/components/common/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GST Invoices',
  description: 'A modern GST invoice management system with snappy UX',
  keywords: ['GST', 'Invoice', 'Billing', 'Tax', 'Business'],
  authors: [{ name: 'GST Invoices Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <ErrorBoundary>{children}</ErrorBoundary>
            </AuthProvider>
            <EnhancedToastProvider />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
