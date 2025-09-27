#!/usr/bin/env tsx
/**
 * Clear Demo Data Script
 *
 * This script removes all demo data from the database.
 * Use this to clean up before re-seeding or for testing.
 *
 * Usage: npm run db:clear
 *
 * WARNING: This will delete all data for the demo user!
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/db'

const DEMO_USER_ID = '550e8400-e29b-41d4-a716-446655440000'

// Helper function to create Supabase client with service role
function createServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing required environment variables:\n' +
        '- SUPABASE_URL\n' +
        '- SUPABASE_SERVICE_ROLE_KEY\n\n' +
        'Please set these in your .env.local file'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Main clearing function
async function clearDemoData() {
  console.log('🧹 Clearing demo data...')

  const supabase = createServiceClient()

  try {
    // Delete in reverse order of dependencies
    console.log('💳 Clearing payments...')
    const { error: paymentsError } = await supabase
      .from('payments')
      .delete()
      .eq(
        'invoice_id',
        supabase.from('invoices').select('id').eq('user_id', DEMO_USER_ID)
      )

    if (paymentsError) {
      console.warn(`⚠️  Warning clearing payments: ${paymentsError.message}`)
    } else {
      console.log('✅ Payments cleared')
    }

    console.log('📋 Clearing invoice items...')
    const { error: invoiceItemsError } = await supabase
      .from('invoice_items')
      .delete()
      .eq(
        'invoice_id',
        supabase.from('invoices').select('id').eq('user_id', DEMO_USER_ID)
      )

    if (invoiceItemsError) {
      console.warn(
        `⚠️  Warning clearing invoice items: ${invoiceItemsError.message}`
      )
    } else {
      console.log('✅ Invoice items cleared')
    }

    console.log('📄 Clearing invoices...')
    const { error: invoicesError } = await supabase
      .from('invoices')
      .delete()
      .eq('user_id', DEMO_USER_ID)

    if (invoicesError) {
      console.warn(`⚠️  Warning clearing invoices: ${invoicesError.message}`)
    } else {
      console.log('✅ Invoices cleared')
    }

    console.log('📦 Clearing items...')
    const { error: itemsError } = await supabase
      .from('items')
      .delete()
      .eq('user_id', DEMO_USER_ID)

    if (itemsError) {
      console.warn(`⚠️  Warning clearing items: ${itemsError.message}`)
    } else {
      console.log('✅ Items cleared')
    }

    console.log('👥 Clearing customers...')
    const { error: customersError } = await supabase
      .from('customers')
      .delete()
      .eq('user_id', DEMO_USER_ID)

    if (customersError) {
      console.warn(`⚠️  Warning clearing customers: ${customersError.message}`)
    } else {
      console.log('✅ Customers cleared')
    }

    console.log('�� Clearing businesses...')
    const { error: businessesError } = await supabase
      .from('businesses')
      .delete()
      .eq('user_id', DEMO_USER_ID)

    if (businessesError) {
      console.warn(
        `⚠️  Warning clearing businesses: ${businessesError.message}`
      )
    } else {
      console.log('✅ Businesses cleared')
    }

    console.log('📋 Clearing subscriptions...')
    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', DEMO_USER_ID)

    if (subscriptionsError) {
      console.warn(
        `⚠️  Warning clearing subscriptions: ${subscriptionsError.message}`
      )
    } else {
      console.log('✅ Subscriptions cleared')
    }

    console.log('👤 Clearing user...')
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', DEMO_USER_ID)

    if (userError) {
      console.warn(`⚠️  Warning clearing user: ${userError.message}`)
    } else {
      console.log('✅ User cleared')
    }

    console.log('\n🎉 Demo data cleared successfully!')
    console.log('\n📝 Next Steps:')
    console.log('1. Run "npm run db:seed" to create fresh demo data')
    console.log('2. Or create your own data through the application')
  } catch (error) {
    console.error('❌ Clearing failed:', error)
    process.exit(1)
  }
}

// Run the clearing function
if (require.main === module) {
  clearDemoData()
}

export { clearDemoData }
