import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const {
      invoiceId,
      guestMode = false,
      watermark = false,
      invoiceData: guestInvoiceData,
    } = requestBody

    // Handle guest mode
    if (guestMode && guestInvoiceData) {
      return await handleGuestExcelExport(guestInvoiceData, watermark)
    }

    // Handle authenticated user mode
    const supabase = await createClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      )
    }

    // Get invoice data with related information
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

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return await generateExcelResponse(invoice, false)
  } catch (error) {
    console.error('Excel generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    )
  }
}

async function handleGuestExcelExport(
  guestInvoiceData: any,
  watermark: boolean
) {
  return await generateExcelResponse(guestInvoiceData, watermark, true)
}

async function generateExcelResponse(
  invoiceData: any,
  watermark: boolean,
  isGuestMode: boolean = false
) {
  // Create workbook
  const workbook = XLSX.utils.book_new()

  // Prepare data based on mode
  let invoice, business, customer, items

  if (isGuestMode) {
    invoice = {
      invoice_number: invoiceData.invoice_number,
      invoice_date: invoiceData.invoice_date,
      due_date: invoiceData.due_date,
      status: invoiceData.status,
      subtotal: invoiceData.subtotal,
      total_discount: invoiceData.total_discount,
      total_tax: invoiceData.total_tax,
      cgst_amount: invoiceData.cgst_amount,
      sgst_amount: invoiceData.sgst_amount,
      igst_amount: invoiceData.igst_amount,
      round_off: invoiceData.round_off,
      total_amount: invoiceData.total_amount,
      notes: invoiceData.notes,
      terms: invoiceData.terms,
      payment_terms: invoiceData.payment_terms,
    }
    business = invoiceData.business
    customer = invoiceData.customer
    items = invoiceData.items
  } else {
    invoice = invoiceData
    business = invoiceData.businesses
    customer = invoiceData.customers
    items = invoiceData.invoice_items
  }

  // Invoice Summary Sheet
  const summaryData = []

  // Add watermark for guest mode
  if (watermark) {
    summaryData.push([
      '*** DEMO VERSION - Sign up at your-domain.com for full features ***',
      '',
    ])
    summaryData.push(['', ''])
  }

  summaryData.push(
    ['Invoice Summary', ''],
    ['Invoice Number', invoice.invoice_number],
    [
      'Invoice Date',
      new Date(invoice.invoice_date).toLocaleDateString('en-IN'),
    ],
    ['Due Date', new Date(invoice.due_date).toLocaleDateString('en-IN')],
    ['Status', invoice.status?.toUpperCase() || 'DRAFT'],
    ['', ''],
    ['Business Details', ''],
    ['Business Name', business?.name || 'N/A'],
    ['GSTIN', business?.gst_number || business?.gstin || 'N/A'],
    ['PAN', business?.pan_number || 'N/A'],
    ['Address', business?.address || 'N/A'],
    ['City', business?.city || 'N/A'],
    ['State', business?.state || 'N/A'],
    ['Pincode', business?.pincode || 'N/A'],
    ['Phone', business?.phone || 'N/A'],
    ['Email', business?.email || 'N/A'],
    ['', ''],
    ['Customer Details', ''],
    ['Customer Name', customer?.name || 'N/A'],
    ['Email', customer?.email || 'N/A'],
    ['Phone', customer?.phone || 'N/A'],
    ['GSTIN', customer?.gst_number || customer?.gstin || 'N/A'],
    ['Address', customer?.address || 'N/A'],
    ['City', customer?.city || 'N/A'],
    ['State', customer?.state || 'N/A'],
    ['Pincode', customer?.pincode || 'N/A'],
    ['', ''],
    ['Invoice Totals', ''],
    [
      'Subtotal',
      `₹${(invoice.subtotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'Total Discount',
      `₹${(invoice.total_discount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'Taxable Amount',
      `₹${((invoice.subtotal || 0) - (invoice.total_discount || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'CGST Amount',
      `₹${(invoice.cgst_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'SGST Amount',
      `₹${(invoice.sgst_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'IGST Amount',
      `₹${(invoice.igst_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'Total Tax',
      `₹${(invoice.total_tax || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'Round Off',
      `₹${(invoice.round_off || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ],
    [
      'Total Amount',
      `₹${(invoice.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
    ]
  )

  if (invoice.notes) {
    summaryData.push(['', ''], ['Notes', invoice.notes])
  }

  if (invoice.terms) {
    summaryData.push(['', ''], ['Terms & Conditions', invoice.terms])
  }

  if (invoice.payment_terms) {
    summaryData.push(['', ''], ['Payment Terms', invoice.payment_terms])
  }

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Invoice Summary')

  // Invoice Items Sheet
  const itemsData = [
    [
      'Item Name',
      'Description',
      'HSN/SAC Code',
      'Quantity',
      'Unit',
      'Price',
      'Tax Rate (%)',
      'Discount (%)',
      'Discount Amount',
      'Item Total',
    ],
  ]

  // Add watermark for guest mode
  if (watermark) {
    itemsData.push([
      '*** DEMO VERSION - Sign up for full features ***',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
  }

  if (items && items.length > 0) {
    items.forEach((item: any) => {
      const itemSubtotal = (item.quantity || 0) * (item.price || 0)
      const discountAmount =
        (item.discount_percent || 0) > 0
          ? (itemSubtotal * (item.discount_percent || 0)) / 100
          : item.discount_amount || 0
      const taxableAmount = itemSubtotal - discountAmount
      const taxAmount = (taxableAmount * (item.tax_rate || 0)) / 100
      const itemTotal = taxableAmount + taxAmount

      itemsData.push([
        item.name || '',
        item.description || '',
        item.hsn_sac_code || '',
        item.quantity || 0,
        item.unit || '',
        item.price || 0,
        item.tax_rate || 0,
        item.discount_percent || 0,
        discountAmount,
        itemTotal,
      ])
    })
  }

  const itemsSheet = XLSX.utils.aoa_to_sheet(itemsData)
  XLSX.utils.book_append_sheet(workbook, itemsSheet, 'Invoice Items')

  // Generate Excel buffer
  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

  // Return Excel file as response
  return new NextResponse(excelBuffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number || 'guest'}.xlsx"`,
      'Content-Length': excelBuffer.length.toString(),
    },
  })
}
