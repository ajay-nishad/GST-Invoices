'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'

export function PricingCard() {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    // Simple alert for now - can be replaced with proper toast later
    alert(message)
  }

  const handleUpgrade = async () => {
    if (!user) {
      showToast('Please sign in to upgrade your plan.', 'error')
      return
    }

    setIsLoading(true)

    try {
      // Call our API to create Razorpay order
      const response = await fetch('/api/razorpay/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: 'premium',
          amount: 50000, // ₹500 in paise
          currency: 'INR',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId, keyId } = await response.json()

      // Load Razorpay script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: keyId,
          amount: 50000,
          currency: 'INR',
          name: 'GST Invoices',
          description: 'Premium Plan - Monthly Subscription',
          order_id: orderId,
          prefill: {
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
          },
          theme: {
            color: '#4f46e5',
          },
          handler: async function (response: any) {
            // Payment successful
            try {
              const verifyResponse = await fetch('/api/razorpay/webhook', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  event: 'payment.captured',
                  payload: {
                    payment: {
                      entity: {
                        id: response.razorpay_payment_id,
                        order_id: response.razorpay_order_id,
                        amount: 50000,
                        currency: 'INR',
                        status: 'captured',
                        method: 'card',
                        created_at: Math.floor(Date.now() / 1000),
                      },
                    },
                  },
                }),
              })

              if (verifyResponse.ok) {
                showToast(
                  'Payment Successful! Your premium subscription has been activated.'
                )
                router.push('/dashboard')
              } else {
                throw new Error('Payment verification failed')
              }
            } catch (error) {
              console.error('Payment verification error:', error)
              showToast(
                'Payment verification failed. Please contact support if the amount was deducted.',
                'error'
              )
            }
          },
          modal: {
            ondismiss: function () {
              setIsLoading(false)
            },
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error('Checkout error:', error)
      showToast('Unable to process payment. Please try again.', 'error')
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      className="w-full bg-indigo-600 hover:bg-indigo-700"
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : 'Upgrade to Premium'}
    </Button>
  )
}
