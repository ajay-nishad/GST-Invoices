import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { razorpayUtils } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { subscriptionId } = body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Get current subscription details
    const { data: subscription, error: subError } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('razorpay_subscription_id', subscriptionId)
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Create new Razorpay order for renewal
    const amount = subscription.price * 100 // Convert to paise
    const receipt = `renew_${user.id}_${Date.now()}`

    try {
      const order = await razorpayUtils.createOrder(
        subscription.price,
        subscription.currency,
        receipt
      )

      // Update subscription with new order details
      const { error: updateError } = await (supabase as any)
        .from('subscriptions')
        .update({
          razorpay_plan_id: receipt,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('razorpay_subscription_id', subscriptionId)

      if (updateError) {
        console.error('Database error:', updateError)
        return NextResponse.json(
          { error: 'Failed to update subscription' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: receipt,
      })
    } catch (error) {
      console.error('Razorpay order creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create renewal order' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Renew subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
