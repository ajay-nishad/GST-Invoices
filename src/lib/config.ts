/**
 * Configuration utilities for environment variables
 * Provides type-safe access to environment variables with proper validation
 */

// Server-side configuration (includes all environment variables)
export { serverEnv, isDevelopment, isProduction, isTest } from '@/env.server'
export type { ServerEnv } from '@/env.server'

// Client-side configuration (only public variables)
export { clientEnv } from '@/env.client'
export type { ClientEnv } from '@/env.client'

// Re-export the main env for backward compatibility
export { env } from '@/env'
export type { Env } from '@/env'

/**
 * Utility function to safely access environment variables
 * Throws an error if the variable is not defined
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Required environment variable ${key} is not defined`)
  }
  return value
}

/**
 * Utility function to safely access optional environment variables
 * Returns undefined if the variable is not defined
 */
export function getOptionalEnv(key: string): string | undefined {
  return process.env[key]
}

/**
 * Configuration object for easy access to common settings
 */
export const config = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },

  // App
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '3000',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
} as const
