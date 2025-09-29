'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/businesses': 'Businesses',
  '/customers': 'Customers',
  '/items': 'Items',
  '/invoices': 'Invoices',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/pricing': 'Pricing',
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on dashboard
  if (pathname === '/dashboard') {
    return null
  }

  const pathSegments = pathname.split('/').filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const label =
      routeMap[href] || segment.charAt(0).toUpperCase() + segment.slice(1)

    return {
      href,
      label,
      isLast: index === pathSegments.length - 1,
    }
  })

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            href="/dashboard"
            prefetch={true}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {breadcrumb.isLast ? (
              <span className="font-medium text-gray-900">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                prefetch={true}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
