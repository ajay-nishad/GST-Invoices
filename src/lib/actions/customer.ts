'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { customerSchema, customerUpdateSchema } from '@/lib/schemas/customer'
import { CustomerFormData, CustomerUpdateData } from '@/lib/schemas/customer'

export async function createCustomer(formData: CustomerFormData) {
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
  const validatedData = customerSchema.parse(formData)

  // Create customer
  const { data, error } = await (supabase as any)
    .from('customers')
    .insert({
      user_id: user.id,
      ...validatedData,
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to create customer')
  }

  revalidatePath('/customers')
  return { success: true, data }
}

export async function updateCustomer(formData: CustomerUpdateData) {
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
  const validatedData = customerUpdateSchema.parse(formData)
  const { id, ...updateData } = validatedData

  // Update customer
  const { data, error } = await (supabase as any)
    .from('customers')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to update customer')
  }

  revalidatePath('/customers')
  return { success: true, data }
}

export async function deleteCustomer(customerId: string) {
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

  // Delete customer
  const { error } = await (supabase as any)
    .from('customers')
    .delete()
    .eq('id', customerId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to delete customer')
  }

  revalidatePath('/customers')
  return { success: true }
}

export async function getCustomers(search?: string, page = 1, limit = 10) {
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

  let query = (supabase as any)
    .from('customers')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('is_active', true)

  // Add search filter
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    )
  }

  // Add pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch customers')
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getCustomer(customerId: string) {
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

  // Get customer
  const { data, error } = await (supabase as any)
    .from('customers')
    .select('*')
    .eq('id', customerId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch customer')
  }

  return data
}
