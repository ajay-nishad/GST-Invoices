/**
 * Supabase client for server-side usage
 * Uses service role key for admin operations
 */

import { createClient } from '@supabase/supabase-js'
import { serverEnv } from '@/env.server'
import type { Database } from './browser'

// Check if we have valid Supabase credentials
const hasValidCredentials =
  serverEnv.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
  serverEnv.SUPABASE_SERVICE_ROLE_KEY !== 'placeholder_service_key'

// Create Supabase client for server-side usage with service role
export const supabaseAdmin = hasValidCredentials
  ? createClient<Database>(
      serverEnv.NEXT_PUBLIC_SUPABASE_URL,
      serverEnv.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null

// Create Supabase client for server-side usage with anon key (for RLS)
export const supabaseServer = hasValidCredentials
  ? createClient<Database>(
      serverEnv.NEXT_PUBLIC_SUPABASE_URL,
      serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : null

/**
 * Get Supabase client with user session for server-side operations
 * This respects Row Level Security (RLS) policies
 */
export async function createServerClient() {
  if (!hasValidCredentials) {
    return null
  }

  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()

  const supabase = createClient<Database>(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Cookie: cookieStore.toString(),
        },
      },
    }
  )

  return supabase
}

/**
 * Get user session on server-side
 */
export async function getUser() {
  if (!hasValidCredentials) {
    return null
  }

  const supabase = await createServerClient()
  if (!supabase) return null

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting user:', error)
    return null
  }

  return user
}

// Type for user with profile
export type UserWithProfile = {
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>
  profile: Database['public']['Tables']['profiles']['Row'] | null
}

/**
 * Get user session with profile data
 */
export async function getUserWithProfile(): Promise<UserWithProfile | null> {
  if (!hasValidCredentials) {
    return null
  }

  const supabase = await createServerClient()
  if (!supabase) return null

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return { user, profile: null }
  }

  return { user, profile }
}

/**
 * Require authentication on server-side
 * Throws error if user is not authenticated
 */
export async function requireAuth() {
  if (!hasValidCredentials) {
    throw new Error(
      'Supabase not configured - please set up your environment variables'
    )
  }

  const user = await getUser()

  if (!user) {
    throw new Error('Authentication required')
  }

  return user
}

/**
 * Require authentication with profile on server-side
 * Throws error if user is not authenticated
 */
export async function requireAuthWithProfile(): Promise<UserWithProfile> {
  if (!hasValidCredentials) {
    throw new Error(
      'Supabase not configured - please set up your environment variables'
    )
  }

  const result = await getUserWithProfile()

  if (!result) {
    throw new Error('Authentication required')
  }

  return result
}
