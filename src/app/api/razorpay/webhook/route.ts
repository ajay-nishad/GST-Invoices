import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { razorpayUtils } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const isValidSignature = razorpayUtils.verifyWebhookSignature(
      body,
      signature
    )

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)
    const { event: eventType, payload } = event

    console.log('Razorpay webhook received:', eventType, payload)

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    switch (eventType) {
      case 'payment.captured':
        await handlePaymentCaptured(supabase, payload)
        break

      case 'subscription.charged':
        await handleSubscriptionCharged(supabase, payload)
        break

      default:
        console.log('Unhandled webhook event:', eventType)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentCaptured(supabase: any, payload: any) {
  try {
    const payment = payload.payment.entity
    const orderId = payment.order_id

    // Get order details from Razorpay
    const order = await razorpayUtils.getOrder(orderId)

    // Extract user ID from receipt (format: premium_userId_timestamp)
    const receipt = order.receipt
    if (!receipt) {
      console.error('No receipt found in order:', order)
      return
    }

    const userId = receipt.split('_')[1]

    if (!userId) {
      console.error('Could not extract user ID from receipt:', receipt)
      return
    }

    // Update subscription status
    const { error } = await (supabase as any)
      .from('subscriptions')
      .update({
        status: 'active',
        is_active: true,
        razorpay_subscription_id: payment.id,
        started_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('razorpay_plan_id', receipt)

    if (error) {
      console.error('Failed to update subscription:', error)
      throw error
    }

    console.log('Subscription activated for user:', userId)
  } catch (error) {
    console.error('Error handling payment captured:', error)
    throw error
  }
}

async function handleSubscriptionCharged(supabase: any, payload: any) {
  try {
    const subscription = payload.subscription.entity
    const userId = subscription.notes?.user_id

    if (!userId) {
      console.error('No user ID in subscription notes')
      return
    }

    // Update subscription with new billing cycle
    const { error } = await (supabase as any)
      .from('subscriptions')
      .update({
        status: 'active',
        is_active: true,
        razorpay_subscription_id: subscription.id,
        started_at: new Date().toISOString(),
        expires_at: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to update subscription:', error)
      throw error
    }

    console.log('Subscription renewed for user:', userId)
  } catch (error) {
    console.error('Error handling subscription charged:', error)
    throw error
  }
}
