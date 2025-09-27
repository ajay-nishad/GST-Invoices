'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface UserPreferences {
  id?: string
  user_id?: string
  default_tax_rate: number
  default_currency: string
  default_invoice_template: string
  default_payment_terms: string
  default_notes?: string
  default_terms_conditions?: string
  invoice_number_prefix: string
  invoice_number_start: number
  auto_generate_invoice_number: boolean
  email_notifications: boolean
  payment_reminders: boolean
  invoice_updates: boolean
  theme: string
  language: string
  created_at?: string
  updated_at?: string
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Get user preferences
  const { data, error } = await (supabase as any)
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    console.error('Database error:', error)
    throw new Error('Failed to fetch user preferences')
  }

  // If no preferences exist, create default ones
  if (!data) {
    return await createDefaultPreferences()
  }

  return data
}

export async function updateUserPreferences(
  preferences: Partial<UserPreferences>
): Promise<{ success: boolean; data: UserPreferences }> {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Update preferences
  const { data, error } = await (supabase as any)
    .from('user_preferences')
    .update({
      ...preferences,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to update user preferences')
  }

  revalidatePath('/settings')
  return { success: true, data }
}

export async function createDefaultPreferences(): Promise<UserPreferences> {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Create default preferences
  const defaultPreferences = {
    user_id: user.id,
    default_tax_rate: 18.0,
    default_currency: 'INR',
    default_invoice_template: 'classic',
    default_payment_terms: 'Payment due within 30 days',
    invoice_number_prefix: 'INV',
    invoice_number_start: 1,
    auto_generate_invoice_number: true,
    email_notifications: true,
    payment_reminders: true,
    invoice_updates: true,
    theme: 'light',
    language: 'en',
  }

  const { data, error } = await (supabase as any)
    .from('user_preferences')
    .insert(defaultPreferences)
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to create default preferences')
  }

  return data
}

export async function updateUserProfile(profileData: {
  full_name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  country?: string
}): Promise<{ success: boolean }> {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Update user profile
  const { error } = await (supabase as any)
    .from('users')
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to update user profile')
  }

  revalidatePath('/settings')
  return { success: true }
}

export async function getUserProfile() {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  // Get user profile
  const { data, error } = await (supabase as any)
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch user profile')
  }

  return data
}
