'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  FileText,
  Users,
  Package,
  Mail,
  BarChart3,
  Loader2,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'outline' | 'secondary'
}

const quickActions: QuickAction[] = [
  {
    title: 'Create Invoice',
    description: 'Generate new invoice',
    href: '/invoices/new',
    icon: Plus,
    variant: 'default',
  },
  {
    title: 'View Invoices',
    description: 'Manage invoices',
    href: '/invoices',
    icon: FileText,
    variant: 'outline',
  },
  {
    title: 'Customers',
    description: 'Manage customers',
    href: '/customers',
    icon: Users,
    variant: 'outline',
  },
  {
    title: 'Items',
    description: 'Manage items',
    href: '/items',
    icon: Package,
    variant: 'outline',
  },
  {
    title: 'Analytics',
    description: 'View reports',
    href: '/analytics',
    icon: BarChart3,
    variant: 'outline',
  },
  {
    title: 'Email Logs',
    description: 'Track emails',
    href: '/email-logs',
    icon: Mail,
    variant: 'outline',
  },
]

export function QuickActions() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const handleActionClick = (actionTitle: string) => {
    setLoadingAction(actionTitle)
    // Reset loading state after navigation starts
    setTimeout(() => setLoadingAction(null), 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            const isLoading = loadingAction === action.title

            return (
              <Link
                key={action.title}
                href={action.href}
                prefetch={true}
                onClick={() => handleActionClick(action.title)}
              >
                <Button
                  variant={action.variant}
                  disabled={isLoading}
                  className="w-full h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200 min-h-[80px] disabled:opacity-70"
                >
                  <div className="flex items-center space-x-2 w-full">
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 flex-shrink-0 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5 flex-shrink-0" />
                    )}
                    <span className="font-medium truncate">
                      {isLoading ? 'Loading...' : action.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left font-normal leading-relaxed w-full break-words">
                    {action.description}
                  </p>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
