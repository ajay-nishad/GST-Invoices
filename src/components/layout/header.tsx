'use client'

import { Bell, Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SignOutButton } from '@/components/sign-out-button'
import { SubscriptionStatus } from '@/components/subscription/subscription-status'
import { useState } from 'react'

interface HeaderProps {
  title?: string
  onMenuClick?: () => void
  showSearch?: boolean
  className?: string
}

export function Header({
  title = 'Dashboard',
  onMenuClick,
  showSearch = true,
  className = '',
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header
      className={`bg-white border-b border-gray-200 px-4 py-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page title */}
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Center - Search */}
        {showSearch && (
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search invoices, customers, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Subscription Status */}
          <SubscriptionStatus />

          {/* Notifications */}
          <Button variant="ghost" size="sm" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Sign out */}
          <SignOutButton variant="outline" size="sm" />
        </div>
      </div>
    </header>
  )
}
