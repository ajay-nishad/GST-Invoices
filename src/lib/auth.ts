/**
 * Server-side authentication utilities for React Server Components
 * Provides type-safe auth helpers for server components and API routes
 */

import {
  getUser,
  getUserWithProfile,
  requireAuth,
  requireAuthWithProfile,
} from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Get current user in server components
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  return await getUser()
}

/**
 * Get current user with profile in server components
 * Returns null if not authenticated
 */
export async function getCurrentUserWithProfile() {
  return await getUserWithProfile()
}

/**
 * Require authentication in server components
 * Redirects to login if not authenticated
 */
export async function requireUser(redirectTo: string = '/auth/login') {
  const user = await requireAuth()
  return user
}

/**
 * Require authentication with profile in server components
 * Redirects to login if not authenticated
 */
export async function requireUserWithProfile(
  redirectTo: string = '/auth/login'
) {
  const result = await requireAuthWithProfile()
  return result
}

/**
 * Check if user is authenticated (for conditional rendering)
 */
export async function isAuthenticated() {
  const user = await getUser()
  return !!user
}

/**
 * Redirect to login if not authenticated
 */
export async function redirectIfNotAuthenticated(
  redirectTo: string = '/auth/login'
) {
  const user = await getUser()
  if (!user) {
    redirect(redirectTo)
  }
  return user
}

/**
 * Redirect to dashboard if authenticated (for login/register pages)
 */
export async function redirectIfAuthenticated(
  redirectTo: string = '/dashboard'
) {
  const user = await getUser()
  if (user) {
    redirect(redirectTo)
  }
}
