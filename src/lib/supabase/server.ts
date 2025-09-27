/**
 * Supabase client for server-side usage
 * Uses service role key for admin operations
 */

import { createClient } from '@supabase/supabase-js'
import { serverEnv } from '@/env.server'
import type { Database } from './browser'

// Create Supabase client for server-side usage with service role
export const supabaseAdmin = createClient<Database>(
  serverEnv.NEXT_PUBLIC_SUPABASE_URL,
  serverEnv.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Create Supabase client for server-side usage with anon key (for RLS)
export const supabaseServer = createClient<Database>(
  serverEnv.NEXT_PUBLIC_SUPABASE_URL,
  serverEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

/**
 * Get Supabase client with user session for server-side operations
 * This respects Row Level Security (RLS) policies
 */
export async function createServerClient() {
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
  const supabase = await createServerClient()
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
  const supabase = await createServerClient()
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
  const result = await getUserWithProfile()

  if (!result) {
    throw new Error('Authentication required')
  }

  return result
}
