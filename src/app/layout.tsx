import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { EnhancedToastProvider } from '@/components/ui/enhanced-toast-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { ReduxProvider } from '@/providers/redux-provider'
import { ReduxAuthProvider } from '@/providers/redux-auth-provider'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { NavigationProgress } from '@/components/common/navigation-progress'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GST Invoices',
  description: 'A modern GST invoice management system with snappy UX',
  keywords: ['GST', 'Invoice', 'Billing', 'Tax', 'Business'],
  authors: [{ name: 'GST Invoices Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className={inter.className}>
        {/* <ErrorBoundary> */}
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <NavigationProgress />
              <ReduxAuthProvider>{children}</ReduxAuthProvider>
            </AuthProvider>
            <EnhancedToastProvider />
          </ThemeProvider>
        </ReduxProvider>
        {/* </ErrorBoundary> */}
      </body>
    </html>
  )
}
