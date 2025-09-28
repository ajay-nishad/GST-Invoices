'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useUser } from '@/providers/auth-provider'
import { useState } from 'react'
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  FileText,
  BarChart3,
  Settings,
  Receipt,
  X,
  Mail,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface AppSidebarProps {
  open: boolean
  onClose: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and quick actions',
  },
  {
    name: 'Businesses',
    href: '/businesses',
    icon: Building2,
    description: 'Manage your businesses',
  },
  {
    name: 'Customers',
    href: '/customers',
    icon: Users,
    description: 'Customer management',
  },
  {
    name: 'Items',
    href: '/items',
    icon: Package,
    description: 'Product and service catalog',
  },
  {
    name: 'Invoices',
    href: '/invoices',
    icon: FileText,
    description: 'Create and manage invoices',
  },
  {
    name: 'Email Logs',
    href: '/email-logs',
    icon: Mail,
    description: 'Track email communications',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Reports and insights',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account and preferences',
  },
]

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()
  const [loadingItem, setLoadingItem] = useState<string | null>(null)

  const handleNavClick = (itemName: string) => {
    setLoadingItem(itemName)
    onClose()
    // Reset loading state after navigation starts
    setTimeout(() => setLoadingItem(null), 2000)
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <Receipt className="h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">
          GST Invoices
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const isLoading = loadingItem === item.name
          const Icon = isLoading ? Loader2 : item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              onClick={() => handleNavClick(item.name)}
              className={cn(
                'group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                isLoading && 'opacity-70'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive
                    ? 'text-indigo-500'
                    : 'text-gray-400 group-hover:text-gray-500',
                  isLoading && 'animate-spin'
                )}
              />
              <div className="flex-1">
                <div className="font-medium">
                  {isLoading ? 'Loading...' : item.name}
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-sm font-medium text-indigo-600">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.user_metadata?.full_name || 'User'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-80 p-0 lg:hidden">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
