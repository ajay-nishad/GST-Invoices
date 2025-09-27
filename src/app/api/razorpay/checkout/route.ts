import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { razorpayUtils } from '@/lib/razorpay'
import { serverEnv } from '@/env.server'

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
    const { plan, amount, currency = 'INR' } = body

    if (!plan || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate plan
    if (plan !== 'premium') {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Validate amount (₹500 = 50000 paise)
    if (amount !== 50000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Create Razorpay order
    const receipt = `premium_${user.id}_${Date.now()}`
    const order = await razorpayUtils.createOrder(
      amount / 100, // Convert paise to rupees
      currency,
      receipt
    )

    // Store order details in database for verification
    const { error: dbError } = await (supabase as any)
      .from('subscriptions')
      .insert({
        user_id: user.id,
        plan_name: 'premium',
        status: 'inactive',
        price: amount / 100,
        currency,
        billing_cycle: 'monthly',
        razorpay_plan_id: receipt,
        is_active: false,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create subscription record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orderId: order.id,
      keyId: serverEnv.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
