'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import {
  Crown,
  CreditCard,
  Calendar,
  AlertTriangle,
  RefreshCw,
  X,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Subscription {
  id: string
  plan_name: string
  status: 'active' | 'inactive' | 'cancelled' | 'expired'
  price: number
  currency: string
  billing_cycle: string
  started_at: string
  expires_at: string | null
  razorpay_subscription_id: string | null
  is_active: boolean
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/status')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data.subscription)
      } else {
        console.error('Failed to fetch subscription')
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    router.push('/pricing')
  }

  const handleRenew = async () => {
    if (!subscription?.razorpay_subscription_id) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/subscription/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.razorpay_subscription_id,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description:
            'Subscription renewed successfully. You will be redirected to payment.',
        })
        // Redirect to payment page
        router.push('/pricing')
      } else {
        const errorData = await response.json()
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to renew subscription',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Renew subscription error:', error)
      toast({
        title: 'Error',
        description: 'Failed to renew subscription. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!subscription?.razorpay_subscription_id) return

    if (
      confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.'
      )
    ) {
      setActionLoading(true)
      try {
        const response = await fetch('/api/subscription/cancel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: subscription.razorpay_subscription_id,
          }),
        })

        if (response.ok) {
          toast({
            title: 'Success',
            description:
              'Subscription cancelled successfully. You will retain access until the end of your billing period.',
          })
          fetchSubscription()
        } else {
          const errorData = await response.json()
          toast({
            title: 'Error',
            description: errorData.error || 'Failed to cancel subscription',
            variant: 'destructive',
          })
        }
      } catch (error) {
        console.error('Cancel subscription error:', error)
        toast({
          title: 'Error',
          description: 'Failed to cancel subscription. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setActionLoading(false)
      }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Loading subscription details...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription || !subscription.is_active) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-gray-400" />
            Subscription
          </CardTitle>
          <CardDescription>You are currently on the free plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Free Plan</p>
              <p className="text-sm text-gray-500">
                Up to 10 invoices per month
              </p>
            </div>
            <Badge variant="outline">Free</Badge>
          </div>
          <Button onClick={handleUpgrade} className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isExpiringSoon =
    subscription.expires_at &&
    new Date(subscription.expires_at) <
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const isExpired =
    subscription.expires_at && new Date(subscription.expires_at) < new Date()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-orange-500'
      case 'expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-indigo-600" />
          Subscription
        </CardTitle>
        <CardDescription>Manage your premium subscription</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Details */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium capitalize">
              {subscription.plan_name} Plan
            </p>
            <p className="text-sm text-gray-500">
              ₹{subscription.price}/{subscription.billing_cycle}
            </p>
          </div>
          <Badge
            variant={subscription.status === 'active' ? 'default' : 'outline'}
            className={`${getStatusColor(subscription.status)} text-white`}
          >
            {subscription.status}
          </Badge>
        </div>

        {/* Billing Info */}
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>Started: {formatDate(subscription.started_at)}</span>
          </div>
          {subscription.expires_at && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span>Expires: {formatDate(subscription.expires_at)}</span>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {isExpired && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
            <span className="text-sm text-red-800">
              Your subscription has expired. Renew now to continue using premium
              features.
            </span>
          </div>
        )}

        {isExpiringSoon && !isExpired && (
          <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-md">
            <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
            <span className="text-sm text-orange-800">
              Your subscription expires soon. Renew to continue using premium
              features.
            </span>
          </div>
        )}

        {subscription.status === 'cancelled' && (
          <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Your subscription has been cancelled. You will retain access until
              the end of your billing period.
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          {isExpired || isExpiringSoon ? (
            <Button
              onClick={handleRenew}
              disabled={actionLoading}
              className="flex-1"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${actionLoading ? 'animate-spin' : ''}`}
              />
              {actionLoading ? 'Processing...' : 'Renew Subscription'}
            </Button>
          ) : (
            <Button
              onClick={handleUpgrade}
              variant="outline"
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Change Plan
            </Button>
          )}

          {subscription.status === 'active' && (
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={actionLoading}
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>

        {/* Webhook Status Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center text-sm text-blue-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span>
              Webhook status: Active - Subscription changes are automatically
              synced
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
