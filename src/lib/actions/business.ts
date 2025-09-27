'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { businessSchema, businessUpdateSchema } from '@/lib/schemas/business'
import { BusinessFormData, BusinessUpdateData } from '@/lib/schemas/business'

export async function createBusiness(formData: BusinessFormData) {
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

  // Validate form data
  const validatedData = businessSchema.parse(formData)

  // If this is set as primary, unset other primary businesses
  if (validatedData.is_primary) {
    await (supabase as any)
      .from('businesses')
      .update({ is_primary: false })
      .eq('user_id', user.id)
  }

  // Create business
  const { data, error } = await (supabase as any)
    .from('businesses')
    .insert({
      user_id: user.id,
      ...validatedData,
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to create business')
  }

  revalidatePath('/businesses')
  return { success: true, data }
}

export async function updateBusiness(formData: BusinessUpdateData) {
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

  // Validate form data
  const validatedData = businessUpdateSchema.parse(formData)
  const { id, ...updateData } = validatedData

  // If this is set as primary, unset other primary businesses
  if (updateData.is_primary) {
    await (supabase as any)
      .from('businesses')
      .update({ is_primary: false })
      .eq('user_id', user.id)
      .neq('id', id)
  }

  // Update business
  const { data, error } = await (supabase as any)
    .from('businesses')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to update business')
  }

  revalidatePath('/businesses')
  return { success: true, data }
}

export async function deleteBusiness(businessId: string) {
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

  // Delete business
  const { error } = await (supabase as any)
    .from('businesses')
    .delete()
    .eq('id', businessId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to delete business')
  }

  revalidatePath('/businesses')
  return { success: true }
}

export async function getBusinesses() {
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

  // Get businesses
  const { data, error } = await (supabase as any)
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('is_primary', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch businesses')
  }

  return data || []
}

export async function getBusiness(businessId: string) {
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

  // Get business
  const { data, error } = await (supabase as any)
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch business')
  }

  return data
}
