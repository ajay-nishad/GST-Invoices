import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

interface DashboardStats {
  totalRevenue: number
  revenueChange: number
  invoicesSent: number
  invoicesChange: number
  pendingPayments: number
  pendingChange: number
  activeCustomers: number
  customersChange: number
}

interface RecentInvoice {
  id: string
  invoice_number: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

// Cached dashboard stats
export const getDashboardStats = unstable_cache(
  async (userId: string): Promise<DashboardStats> => {
    const supabase = await createClient()
    if (!supabase) {
      throw new Error('Database connection failed')
    }

    // Get current month data
    const currentMonth = new Date()
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    )
    const lastMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    )
    const lastDayOfLastMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      0
    )

    // Fetch current month invoices
    const { data: currentInvoices } = await (supabase as any)
      .from('invoices')
      .select('total_amount, status')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gte('created_at', firstDayOfMonth.toISOString())
      .lte('created_at', currentMonth.toISOString())

    // Fetch last month invoices for comparison
    const { data: lastMonthInvoices } = await (supabase as any)
      .from('invoices')
      .select('total_amount, status')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gte('created_at', lastMonth.toISOString())
      .lte('created_at', lastDayOfLastMonth.toISOString())

    // Calculate current month stats
    const totalRevenue =
      currentInvoices?.reduce((sum: number, inv: any) => {
        return inv.status === 'paid' ? sum + inv.total_amount : sum
      }, 0) || 0

    const invoicesSent = currentInvoices?.length || 0
    const pendingPayments =
      currentInvoices?.reduce((sum: number, inv: any) => {
        return inv.status === 'sent' ? sum + inv.total_amount : sum
      }, 0) || 0

    // Calculate last month stats for comparison
    const lastMonthRevenue =
      lastMonthInvoices?.reduce((sum: number, inv: any) => {
        return inv.status === 'paid' ? sum + inv.total_amount : sum
      }, 0) || 0

    const lastMonthInvoicesSent = lastMonthInvoices?.length || 0
    const lastMonthPending =
      lastMonthInvoices?.reduce((sum: number, inv: any) => {
        return inv.status === 'sent' ? sum + inv.total_amount : sum
      }, 0) || 0

    // Get active customers count
    const { count: activeCustomers } = await (supabase as any)
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true)

    // Get last month customers count
    const { count: lastMonthCustomers } = await (supabase as any)
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true)
      .lte('created_at', lastDayOfLastMonth.toISOString())

    // Calculate percentage changes
    const revenueChange =
      lastMonthRevenue > 0
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0

    const invoicesChange =
      lastMonthInvoicesSent > 0
        ? ((invoicesSent - lastMonthInvoicesSent) / lastMonthInvoicesSent) * 100
        : 0

    const pendingChange =
      lastMonthPending > 0
        ? ((pendingPayments - lastMonthPending) / lastMonthPending) * 100
        : 0

    const customersChange =
      (lastMonthCustomers || 0) > 0
        ? (((activeCustomers || 0) - (lastMonthCustomers || 0)) /
            (lastMonthCustomers || 0)) *
          100
        : 0

    return {
      totalRevenue,
      revenueChange: Math.round(revenueChange * 100) / 100,
      invoicesSent,
      invoicesChange: Math.round(invoicesChange * 100) / 100,
      pendingPayments,
      pendingChange: Math.round(pendingChange * 100) / 100,
      activeCustomers: activeCustomers || 0,
      customersChange: Math.round(customersChange * 100) / 100,
    }
  },
  ['dashboard-stats'],
  {
    tags: ['dashboard-stats', 'invoices', 'customers'],
    revalidate: 300, // 5 minutes
  }
)

// Cached recent invoices
export const getRecentInvoices = unstable_cache(
  async (userId: string): Promise<RecentInvoice[]> => {
    const supabase = await createClient()
    if (!supabase) {
      throw new Error('Database connection failed')
    }

    const { data, error } = await (supabase as any)
      .from('invoices')
      .select(
        `
        id,
        invoice_number,
        total_amount,
        status,
        created_at,
        customers!inner(name)
      `
      )
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent invoices:', error)
      throw new Error('Failed to fetch recent invoices')
    }

    return (data || []).map((invoice: any) => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      customer_name: invoice.customers.name,
      total_amount: invoice.total_amount,
      status: invoice.status,
      created_at: invoice.created_at,
    }))
  },
  ['recent-invoices'],
  {
    tags: ['recent-invoices', 'invoices'],
    revalidate: 60, // 1 minute
  }
)

// React cache for user data
export const getCachedUserProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await (supabase as any)
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
})
