import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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

    // Check if subscriptions table exists and get user's active subscription
    const { data: subscription, error } = await (supabase as any)
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      // Handle specific error cases
      if (error.code === 'PGRST116') {
        // No rows returned - user has no active subscription
        return NextResponse.json({
          subscription: null,
        })
      } else if (error.code === 'PGRST205') {
        // Table not found - subscriptions table doesn't exist
        console.error(
          'Subscriptions table not found. Database migrations may not be applied.'
        )
        return NextResponse.json({
          subscription: null,
          warning:
            'Subscription feature not available - database schema incomplete',
        })
      } else {
        // Other database errors
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch subscription' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      subscription: subscription || null,
    })
  } catch (error) {
    console.error('Subscription status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
