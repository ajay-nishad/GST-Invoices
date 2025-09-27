// Database utilities and common operations
import { createClient } from '@/lib/supabase/server'
import type {
  Database,
  User,
  Business,
  Customer,
  Item,
  Invoice,
  InvoiceItem,
  Payment,
  InvoiceWithDetails,
  CustomerWithBusiness,
  BusinessWithStats,
} from '@/types/db'

type Tables = Database['public']['Tables']

// Generic database operations
export class DatabaseService {
  private supabase

  constructor() {
    this.supabase = createClient()
  }

  // User operations
  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  }

  async updateUser(
    userId: string,
    updates: Partial<User>
  ): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return null
    }

    return data
  }

  // Business operations
  async getBusinesses(userId: string): Promise<Business[]> {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching businesses:', error)
      return []
    }

    return data || []
  }

  async getPrimaryBusiness(userId: string): Promise<Business | null> {
    const { data, error } = await this.supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching primary business:', error)
      return null
    }

    return data
  }

  async createBusiness(
    business: Tables['businesses']['Insert']
  ): Promise<Business | null> {
    const { data, error } = await this.supabase
      .from('businesses')
      .insert(business)
      .select()
      .single()

    if (error) {
      console.error('Error creating business:', error)
      return null
    }

    return data
  }

  // Customer operations
  async getCustomers(userId: string, businessId?: string): Promise<Customer[]> {
    let query = this.supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('customer_name')

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching customers:', error)
      return []
    }

    return data || []
  }

  async getCustomerWithBusiness(
    customerId: string
  ): Promise<CustomerWithBusiness | null> {
    const { data, error } = await this.supabase
      .from('customers')
      .select(
        `
        *,
        business:businesses(*)
      `
      )
      .eq('id', customerId)
      .single()

    if (error) {
      console.error('Error fetching customer with business:', error)
      return null
    }

    return data
  }

  async createCustomer(
    customer: Tables['customers']['Insert']
  ): Promise<Customer | null> {
    const { data, error } = await this.supabase
      .from('customers')
      .insert(customer)
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      return null
    }

    return data
  }

  // Item operations
  async getItems(userId: string, businessId?: string): Promise<Item[]> {
    let query = this.supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('item_name')

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching items:', error)
      return []
    }

    return data || []
  }

  async createItem(item: Tables['items']['Insert']): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .insert(item)
      .select()
      .single()

    if (error) {
      console.error('Error creating item:', error)
      return null
    }

    return data
  }

  // Invoice operations
  async getInvoices(userId: string, businessId?: string): Promise<Invoice[]> {
    let query = this.supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('invoice_date', { ascending: false })

    if (businessId) {
      query = query.eq('business_id', businessId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching invoices:', error)
      return []
    }

    return data || []
  }

  async getInvoiceWithDetails(
    invoiceId: string
  ): Promise<InvoiceWithDetails | null> {
    const { data, error } = await this.supabase
      .from('invoices')
      .select(
        `
        *,
        invoice_items (
          *,
          item:items(*)
        ),
        customer:customers(*),
        business:businesses(*),
        payments(*)
      `
      )
      .eq('id', invoiceId)
      .single()

    if (error) {
      console.error('Error fetching invoice with details:', error)
      return null
    }

    return data
  }

  async createInvoice(
    invoice: Tables['invoices']['Insert']
  ): Promise<Invoice | null> {
    const { data, error } = await this.supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single()

    if (error) {
      console.error('Error creating invoice:', error)
      return null
    }

    return data
  }

  async addInvoiceItem(
    item: Tables['invoice_items']['Insert']
  ): Promise<InvoiceItem | null> {
    const { data, error } = await this.supabase
      .from('invoice_items')
      .insert(item)
      .select()
      .single()

    if (error) {
      console.error('Error adding invoice item:', error)
      return null
    }

    return data
  }

  // Payment operations
  async getPayments(invoiceId: string): Promise<Payment[]> {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('invoice_id', invoiceId)
      .eq('is_active', true)
      .order('payment_date', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error)
      return []
    }

    return data || []
  }

  async createPayment(
    payment: Tables['payments']['Insert']
  ): Promise<Payment | null> {
    const { data, error } = await this.supabase
      .from('payments')
      .insert(payment)
      .select()
      .single()

    if (error) {
      console.error('Error creating payment:', error)
      return null
    }

    return data
  }

  // Dashboard operations
  async getDashboardStats(userId: string) {
    const { data, error } = await this.supabase.rpc('get_dashboard_stats', {
      user_uuid: userId,
    })

    if (error) {
      console.error('Error fetching dashboard stats:', error)
      return null
    }

    return data?.[0] || null
  }

  // Utility functions
  async generateInvoiceNumber(businessId: string): Promise<string | null> {
    const { data, error } = await this.supabase.rpc('generate_invoice_number', {
      business_uuid: businessId,
    })

    if (error) {
      console.error('Error generating invoice number:', error)
      return null
    }

    return data
  }

  async generatePaymentNumber(invoiceId: string): Promise<string | null> {
    const { data, error } = await this.supabase.rpc('generate_payment_number', {
      invoice_uuid: invoiceId,
    })

    if (error) {
      console.error('Error generating payment number:', error)
      return null
    }

    return data
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Helper functions for common operations
export async function createInvoiceWithItems(
  invoiceData: Tables['invoices']['Insert'],
  items: Tables['invoice_items']['Insert'][]
): Promise<Invoice | null> {
  const db = new DatabaseService()

  // Create invoice
  const invoice = await db.createInvoice(invoiceData)
  if (!invoice) return null

  // Add items
  for (const item of items) {
    const invoiceItem = await db.addInvoiceItem({
      ...item,
      invoice_id: invoice.id,
    })
    if (!invoiceItem) {
      console.error('Failed to add invoice item:', item)
    }
  }

  return invoice
}

export async function getInvoiceSummary(userId: string) {
  const { data, error } = await createClient()
    .from('invoice_summary')
    .select('*')
    .eq('user_id', userId)
    .order('invoice_date', { ascending: false })

  if (error) {
    console.error('Error fetching invoice summary:', error)
    return []
  }

  return data || []
}

export async function getCustomerSummary(userId: string) {
  const { data, error } = await createClient()
    .from('customer_summary')
    .select('*')
    .eq('user_id', userId)
    .order('total_amount', { ascending: false })

  if (error) {
    console.error('Error fetching customer summary:', error)
    return []
  }

  return data || []
}

export async function getBusinessSummary(userId: string) {
  const { data, error } = await createClient()
    .from('business_summary')
    .select('*')
    .eq('user_id', userId)
    .order('total_revenue', { ascending: false })

  if (error) {
    console.error('Error fetching business summary:', error)
    return []
  }

  return data || []
}

export async function getMonthlyRevenue(userId: string, months: number = 12) {
  const { data, error } = await createClient()
    .from('monthly_revenue')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false })
    .limit(months)

  if (error) {
    console.error('Error fetching monthly revenue:', error)
    return []
  }

  return data || []
}
