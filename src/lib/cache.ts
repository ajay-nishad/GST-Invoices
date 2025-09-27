import { cache } from 'react'
import { createClient } from './supabase/server'
import { unstable_cache } from 'next/cache'

// React cache for server components
export const getCachedUser = cache(async () => {
  const supabase = await createClient()
  if (!supabase) return null

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return null

  return user
})

// Next.js cache with revalidation for businesses
export const getCachedBusinesses = unstable_cache(
  async (userId: string) => {
    const supabase = await createClient()
    if (!supabase) throw new Error('Database connection failed')

    const { data, error } = await (supabase as any)
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch businesses')
    }

    return data || []
  },
  ['businesses'],
  {
    tags: ['businesses'],
    revalidate: 300, // 5 minutes
  }
)

// Next.js cache for customers
export const getCachedCustomers = unstable_cache(
  async (userId: string, search?: string, page = 1, limit = 10) => {
    const supabase = await createClient()
    if (!supabase) throw new Error('Database connection failed')

    let query = (supabase as any)
      .from('customers')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
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
  },
  ['customers'],
  {
    tags: ['customers'],
    revalidate: 180, // 3 minutes
  }
)

// Next.js cache for items
export const getCachedItems = unstable_cache(
  async (userId: string, search?: string, page = 1, limit = 10) => {
    const supabase = await createClient()
    if (!supabase) throw new Error('Database connection failed')

    let query = (supabase as any)
      .from('items')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
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
  },
  ['items'],
  {
    tags: ['items'],
    revalidate: 300, // 5 minutes
  }
)

// Next.js cache for invoices
export const getCachedInvoices = unstable_cache(
  async (userId: string, search?: string, page = 1, limit = 10) => {
    const supabase = await createClient()
    if (!supabase) throw new Error('Database connection failed')

    let query = (supabase as any)
      .from('invoices')
      .select(
        `
        *,
        businesses!inner(name, gst_number),
        customers!inner(name, email)
      `,
        { count: 'exact' }
      )
      .eq('user_id', userId)
      .eq('is_active', true)

    // Add search filter
    if (search) {
      query = query.or(
        `invoice_number.ilike.%${search}%,businesses.name.ilike.%${search}%,customers.name.ilike.%${search}%`
      )
    }

    // Add pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch invoices')
    }

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  },
  ['invoices'],
  {
    tags: ['invoices'],
    revalidate: 60, // 1 minute - more frequent for invoices
  }
)

// Cache invalidation helpers
export const invalidateBusinesses = () => {
  // This would be called after mutations
  return ['businesses']
}

export const invalidateCustomers = () => {
  return ['customers']
}

export const invalidateItems = () => {
  return ['items']
}

export const invalidateInvoices = () => {
  return ['invoices']
}
