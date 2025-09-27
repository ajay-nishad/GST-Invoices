'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { itemSchema, itemUpdateSchema } from '@/lib/schemas/item'
import { ItemFormData, ItemUpdateData } from '@/lib/schemas/item'

export async function createItem(formData: ItemFormData) {
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
  const validatedData = itemSchema.parse(formData)

  // Create item
  const { data, error } = await (supabase as any)
    .from('items')
    .insert({
      user_id: user.id,
      ...validatedData,
    })
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to create item')
  }

  revalidatePath('/items')
  return { success: true, data }
}

export async function updateItem(formData: ItemUpdateData) {
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
  const validatedData = itemUpdateSchema.parse(formData)
  const { id, ...updateData } = validatedData

  // Update item
  const { data, error } = await (supabase as any)
    .from('items')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to update item')
  }

  revalidatePath('/items')
  return { success: true, data }
}

export async function deleteItem(itemId: string) {
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

  // Delete item
  const { error } = await (supabase as any)
    .from('items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to delete item')
  }

  revalidatePath('/items')
  return { success: true }
}

export async function getItems(search?: string, page = 1, limit = 10) {
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
    .from('items')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('is_active', true)

  // Add search filter
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%,hsn_sac_code.ilike.%${search}%`
    )
  }

  // Add pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to).order('created_at', { ascending: false })

  const { data, error, count } = await query

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch items')
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  }
}

export async function getItem(itemId: string) {
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

  // Get item
  const { data, error } = await (supabase as any)
    .from('items')
    .select('*')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Database error:', error)
    throw new Error('Failed to fetch item')
  }

  return data
}
