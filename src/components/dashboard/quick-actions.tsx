import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  FileText,
  Users,
  Package,
  CreditCard,
  BarChart3,
} from 'lucide-react'
import Link from 'next/link'

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
    description: 'Generate a new invoice',
    href: '/dashboard/invoices/create',
    icon: Plus,
    variant: 'default',
  },
  {
    title: 'View Invoices',
    description: 'Manage your invoices',
    href: '/dashboard/invoices',
    icon: FileText,
    variant: 'outline',
  },
  {
    title: 'Customers',
    description: 'Manage your customers',
    href: '/dashboard/customers',
    icon: Users,
    variant: 'outline',
  },
  {
    title: 'Items',
    description: 'Manage your items',
    href: '/dashboard/items',
    icon: Package,
    variant: 'outline',
  },
  {
    title: 'Payments',
    description: 'Track payments',
    href: '/dashboard/payments',
    icon: CreditCard,
    variant: 'outline',
  },
  {
    title: 'Reports',
    description: 'View analytics',
    href: '/dashboard/reports',
    icon: BarChart3,
    variant: 'outline',
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant={action.variant}
                  className="w-full h-auto p-4 flex flex-col items-start space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-left">
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
