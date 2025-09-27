/**
 * Demonstration of environment variable usage
 * This file shows how to properly import and use environment variables
 * in different contexts (client vs server)
 */

// ✅ CORRECT: Client-side usage (only public variables)
import { clientEnv } from '@/env.client'

// ✅ CORRECT: Server-side usage (all variables including secrets)
import { serverEnv } from '@/env.server'

// ✅ CORRECT: Using the configuration utility
import { config } from '@/lib/config'

// ✅ CORRECT: Using Supabase client (client-side)
import { supabase } from '@/lib/supabase/browser'

// ✅ CORRECT: Using Razorpay (server-side only)
import { razorpay } from '@/lib/razorpay'

/**
 * Example: Client-side component
 * Only use clientEnv or config.clientEnv
 */
export function getClientConfig() {
  // ✅ This is safe to use in client components
  const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL

  // ✅ This is also safe
  const supabaseUrlFromConfig = config.supabase.url

  return {
    supabaseUrl,
    supabaseUrlFromConfig,
  }
}

/**
 * Example: Server-side API route or server component
 * Can use serverEnv or config for all variables
 */
export async function serverAction() {
  // ✅ This is safe to use in server-side code
  const razorpayKeyId = serverEnv.RAZORPAY_KEY_ID
  const supabaseServiceKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY

  // ✅ This is also safe
  const razorpayKeyIdFromConfig = config.razorpay.keyId

  // Example usage
  const order = await razorpay.orders.create({
    amount: 1000,
    currency: 'INR',
    receipt: 'test_receipt',
  })

  return { order }
}

/**
 * Example: Environment validation
 * This will throw an error if required variables are missing
 */
export function validateEnvironment() {
  try {
    // This will validate all environment variables at startup
    const env = serverEnv
    console.log('✅ Environment variables validated successfully')
    return true
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    return false
  }
}

// ❌ WRONG: Don't do this in client-side code
// const secretKey = process.env.RAZORPAY_KEY_SECRET // This will be undefined in client

// ❌ WRONG: Don't do this in client-side code
// const serviceKey = serverEnv.SUPABASE_SERVICE_ROLE_KEY // This will cause build errors
