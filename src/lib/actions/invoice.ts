'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { invoiceSchema, invoiceUpdateSchema } from '@/lib/schemas/invoice'
import { InvoiceFormData, InvoiceUpdateData } from '@/lib/schemas/invoice'

export async function createInvoice(formData: InvoiceFormData) {
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
  const validatedData = invoiceSchema.parse(formData)

  // Create invoice
  const { data: invoice, error: invoiceError } = await (supabase as any)
    .from('invoices')
    .insert({
      user_id: user.id,
      business_id: validatedData.business_id,
      customer_id: validatedData.customer_id,
      invoice_number: validatedData.invoice_number,
      invoice_date: validatedData.invoice_date,
      due_date: validatedData.due_date,
      status: validatedData.status,
      subtotal: validatedData.subtotal,
      total_discount: validatedData.total_discount,
      total_tax: validatedData.total_tax,
      cgst_amount: validatedData.cgst_amount,
      sgst_amount: validatedData.sgst_amount,
      igst_amount: validatedData.igst_amount,
      round_off: validatedData.round_off,
      total_amount: validatedData.total_amount,
      notes: validatedData.notes,
      terms: validatedData.terms,
      payment_terms: validatedData.payment_terms,
    })
    .select()
    .single()

  if (invoiceError) {
    console.error('Invoice creation error:', invoiceError)
    throw new Error('Failed to create invoice')
  }

  // Create invoice items
  const invoiceItems = validatedData.items.map((item) => ({
    invoice_id: invoice.id,
    item_id: item.item_id,
    name: item.name,
    description: item.description,
    hsn_sac_code: item.hsn_sac_code,
    quantity: item.quantity,
    unit: item.unit,
    price: item.price,
    tax_rate: item.tax_rate,
    discount_percent: item.discount_percent,
    discount_amount: item.discount_amount,
  }))

  const { error: itemsError } = await (supabase as any)
    .from('invoice_items')
    .insert(invoiceItems)

  if (itemsError) {
    console.error('Invoice items creation error:', itemsError)
    // Rollback invoice creation
    await (supabase as any).from('invoices').delete().eq('id', invoice.id)
    throw new Error('Failed to create invoice items')
  }

  revalidatePath('/invoices')
  return { success: true, data: invoice }
}

export async function updateInvoice(formData: InvoiceUpdateData) {
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
  const validatedData = invoiceUpdateSchema.parse(formData)
  const { id, items, ...updateData } = validatedData

  // Update invoice
  const { data: invoice, error: invoiceError } = await (supabase as any)
    .from('invoices')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (invoiceError) {
    console.error('Invoice update error:', invoiceError)
    throw new Error('Failed to update invoice')
  }

  // Update invoice items if provided
  if (items) {
    // Delete existing items
    await (supabase as any).from('invoice_items').delete().eq('invoice_id', id)

    // Insert new items
    const invoiceItems = items.map((item) => ({
      invoice_id: id,
      item_id: item.item_id,
      name: item.name,
      description: item.description,
      hsn_sac_code: item.hsn_sac_code,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      tax_rate: item.tax_rate,
      discount_percent: item.discount_percent,
      discount_amount: item.discount_amount,
    }))

    const { error: itemsError } = await (supabase as any)
      .from('invoice_items')
      .insert(invoiceItems)

    if (itemsError) {
      console.error('Invoice items update error:', itemsError)
      throw new Error('Failed to update invoice items')
    }
  }

  revalidatePath('/invoices')
  return { success: true, data: invoice }
}

export async function saveInvoiceDraft(formData: Partial<InvoiceFormData>) {
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

  // For draft, we'll store the data in a JSON field
  const { data, error } = await (supabase as any)
    .from('invoice_drafts')
    .upsert({
      user_id: user.id,
      draft_data: formData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Draft save error:', error)
    throw new Error('Failed to save draft')
  }

  return { success: true, data }
}

export async function getInvoiceDraft() {
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

  const { data, error } = await (supabase as any)
    .from('invoice_drafts')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found"
    console.error('Draft fetch error:', error)
    throw new Error('Failed to fetch draft')
  }

  return data?.draft_data || null
}

export async function deleteInvoice(invoiceId: string) {
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

  // Delete invoice (items will be deleted by cascade)
  const { error } = await (supabase as any)
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Invoice deletion error:', error)
    throw new Error('Failed to delete invoice')
  }

  revalidatePath('/invoices')
  return { success: true }
}

export async function getInvoices(search?: string, page = 1, limit = 10) {
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
    .from('invoices')
    .select(
      `
      *,
      businesses!inner(name, gst_number),
      customers!inner(name, email)
    `,
      { count: 'exact' }
    )
    .eq('user_id', user.id)
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
}

export async function getInvoice(invoiceId: string) {
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

  // Get invoice with items
  const { data: invoice, error: invoiceError } = await (supabase as any)
    .from('invoices')
    .select(
      `
      *,
      businesses!inner(*),
      customers!inner(*),
      invoice_items(*)
    `
    )
    .eq('id', invoiceId)
    .eq('user_id', user.id)
    .single()

  if (invoiceError) {
    console.error('Database error:', invoiceError)
    throw new Error('Failed to fetch invoice')
  }

  return invoice
}
