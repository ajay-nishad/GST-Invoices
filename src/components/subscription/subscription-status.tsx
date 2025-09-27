'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Crown, CreditCard } from 'lucide-react'

interface Subscription {
  id: string
  plan_name: string
  status: 'active' | 'inactive' | 'cancelled' | 'expired'
  price: number
  currency: string
  billing_cycle: string
  expires_at: string | null
  is_active: boolean
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchSubscription()
    }
  }, [user])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/status')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  if (!subscription || !subscription.is_active) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          Free
        </Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/pricing')}
          className="text-xs h-7 px-2"
        >
          <Crown className="h-3 w-3 mr-1" />
          Upgrade
        </Button>
      </div>
    )
  }

  const isExpiringSoon =
    subscription.expires_at &&
    new Date(subscription.expires_at) <
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="flex items-center space-x-2">
      <Badge
        variant={subscription.plan_name === 'premium' ? 'default' : 'outline'}
        className={`text-xs ${
          subscription.plan_name === 'premium'
            ? 'bg-indigo-500 hover:bg-indigo-600'
            : ''
        }`}
      >
        {subscription.plan_name === 'premium' ? (
          <>
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </>
        ) : (
          subscription.plan_name
        )}
      </Badge>

      {isExpiringSoon && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push('/pricing')}
          className="text-xs h-7 px-2 text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <CreditCard className="h-3 w-3 mr-1" />
          Renew
        </Button>
      )}
    </div>
  )
}
