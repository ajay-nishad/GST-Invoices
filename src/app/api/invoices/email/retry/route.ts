import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(request: NextRequest) {
  try {
    const { logId } = await request.json()

    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get email log with invoice data
    const { data: emailLog, error: logError } = await (supabase as any)
      .from('email_logs')
      .select(
        `
        *,
        invoices!inner(
          *,
          businesses!inner(*),
          customers!inner(*),
          invoice_items(*)
        )
      `
      )
      .eq('id', logId)
      .eq('user_id', user.id)
      .single()

    if (logError || !emailLog) {
      return NextResponse.json(
        { error: 'Email log not found' },
        { status: 404 }
      )
    }

    if (emailLog.retry_count >= emailLog.max_retries) {
      return NextResponse.json(
        { error: 'Maximum retry attempts reached' },
        { status: 400 }
      )
    }

    // Update retry count and reset status
    const { error: updateError } = await (supabase as any)
      .from('email_logs')
      .update({
        retry_count: emailLog.retry_count + 1,
        status: 'pending',
        error_message: null,
      })
      .eq('id', logId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update email log' },
        { status: 500 }
      )
    }

    // Here you would typically trigger the email sending process again
    // For now, we'll just return success and let the user manually retry
    // In a production system, you might want to use a queue system like Bull or Agenda

    return NextResponse.json({
      success: true,
      message: 'Email retry initiated',
      retryCount: emailLog.retry_count + 1,
    })
  } catch (error) {
    console.error('Email retry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
