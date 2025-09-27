import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

// GSTR-1 Export API Route
// Exports invoices in GSTR-1 compliant CSV/JSON format
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv' // csv or json
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const section = searchParams.get('section') // b2b, b2c_large, exports, etc.

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

    // Build query for invoices with related data
    let query = supabase
      .from('invoices')
      .select(
        `
        *,
        businesses!inner(*),
        customers!inner(*),
        invoice_items(*)
      `
      )
      .eq('user_id', user.id)
      .eq('is_active', true)

    // Add date filters if provided
    if (startDate) {
      query = query.gte('invoice_date', startDate)
    }
    if (endDate) {
      query = query.lte('invoice_date', endDate)
    }

    const { data: invoices, error: invoicesError } = await query

    if (invoicesError) {
      console.error('Error fetching invoices:', invoicesError)
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      )
    }

    if (!invoices || invoices.length === 0) {
      return NextResponse.json(
        { error: 'No invoices found for the specified period' },
        { status: 404 }
      )
    }

    // Process invoices and generate GSTR-1 data
    const gstr1Data = await processInvoicesForGSTR1(invoices, section)

    // Return data based on requested format
    if (format === 'json') {
      return NextResponse.json(gstr1Data, {
        headers: {
          'Content-Disposition': `attachment; filename="gstr1-${startDate || 'all'}-to-${endDate || 'all'}.json"`,
        },
      })
    } else {
      // Return CSV format
      const csvBuffer = generateCSVFromGSTR1Data(gstr1Data, section)
      return new NextResponse(csvBuffer.toString(), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="gstr1-${section || 'all'}-${startDate || 'all'}-to-${endDate || 'all'}.csv"`,
          'Content-Length': csvBuffer.length.toString(),
        },
      })
    }
  } catch (error) {
    console.error('GSTR-1 export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate GSTR-1 export' },
      { status: 500 }
    )
  }
}

// Process invoices and categorize them for GSTR-1 sections
async function processInvoicesForGSTR1(
  invoices: any[],
  section?: string | null
) {
  const gstr1Data: any = {
    b2b: [], // B2B invoices (registered customers)
    b2c_large: [], // B2C Large invoices (> Rs 2.5L inter-state)
    b2c_small: [], // B2C Small invoices (consolidated)
    exports: [], // Export invoices
    credit_notes: [], // Credit notes
    debit_notes: [], // Debit notes
    hsn_summary: [], // HSN-wise summary
    document_summary: [], // Document summary
  }

  // Process each invoice
  for (const invoice of invoices) {
    const customer = invoice.customers
    const business = invoice.businesses
    const items = invoice.invoice_items || []

    // Determine invoice category based on customer GST status and invoice value
    const isRegisteredCustomer =
      customer.gst_number && customer.gst_number.trim() !== ''
    const isInterState = business.business_state !== customer.billing_state
    const invoiceValue = invoice.total_amount

    if (isRegisteredCustomer) {
      // B2B Invoice
      if (!section || section === 'b2b') {
        gstr1Data.b2b.push(formatB2BInvoice(invoice, customer, business, items))
      }
    } else if (isInterState && invoiceValue > 250000) {
      // B2C Large Invoice (Inter-state > 2.5L)
      if (!section || section === 'b2c_large') {
        gstr1Data.b2c_large.push(
          formatB2CLargeInvoice(invoice, customer, business, items)
        )
      }
    } else {
      // B2C Small Invoice (all others)
      if (!section || section === 'b2c_small') {
        gstr1Data.b2c_small.push(
          formatB2CSmallInvoice(invoice, customer, business, items)
        )
      }
    }

    // Process HSN Summary
    if (!section || section === 'hsn_summary') {
      processHSNSummary(items, gstr1Data.hsn_summary)
    }
  }

  // Generate document summary
  if (!section || section === 'document_summary') {
    gstr1Data.document_summary = generateDocumentSummary(invoices)
  }

  return gstr1Data
}

// Format B2B invoice for GSTR-1
function formatB2BInvoice(
  invoice: any,
  customer: any,
  business: any,
  items: any[]
) {
  return {
    // GSTR-1 B2B format
    gstin: customer.gst_number || 'PLACEHOLDER_GSTIN',
    receiver_name: customer.customer_name,
    invoice_number: invoice.invoice_number,
    invoice_date: invoice.invoice_date,
    invoice_value: invoice.total_amount,
    place_of_supply: customer.billing_state || 'PLACEHOLDER_STATE',
    reverse_charge: 'N', // Placeholder - implement logic if needed
    invoice_type: 'Regular', // Placeholder
    ecommerce_gstin: '', // Placeholder
    rate: items.map((item) => item.tax_rate).join(',') || '0',
    taxable_value: invoice.subtotal,
    integrated_tax: invoice.igst_amount || 0,
    central_tax: invoice.cgst_amount || 0,
    state_ut_tax: invoice.sgst_amount || 0,
    cess: 0, // Placeholder
    // Line items
    items: items.map((item) => ({
      item_name: item.name,
      hsn_code: item.hsn_sac_code || 'PLACEHOLDER_HSN',
      quantity: item.quantity,
      unit: item.unit,
      rate: item.price,
      taxable_value: item.quantity * item.price,
      tax_rate: item.tax_rate || 0,
    })),
  }
}

// Format B2C Large invoice for GSTR-1
function formatB2CLargeInvoice(
  invoice: any,
  customer: any,
  business: any,
  items: any[]
) {
  return {
    // GSTR-1 B2C Large format
    invoice_number: invoice.invoice_number,
    invoice_date: invoice.invoice_date,
    invoice_value: invoice.total_amount,
    place_of_supply: customer.billing_state || 'PLACEHOLDER_STATE',
    rate: items.map((item) => item.tax_rate).join(',') || '0',
    taxable_value: invoice.subtotal,
    integrated_tax: invoice.igst_amount || 0,
    central_tax: invoice.cgst_amount || 0,
    state_ut_tax: invoice.sgst_amount || 0,
    cess: 0, // Placeholder
    ecommerce_gstin: '', // Placeholder
    // Line items
    items: items.map((item) => ({
      item_name: item.name,
      hsn_code: item.hsn_sac_code || 'PLACEHOLDER_HSN',
      quantity: item.quantity,
      unit: item.unit,
      rate: item.price,
      taxable_value: item.quantity * item.price,
      tax_rate: item.tax_rate || 0,
    })),
  }
}

// Format B2C Small invoice for GSTR-1 (consolidated)
function formatB2CSmallInvoice(
  invoice: any,
  customer: any,
  business: any,
  items: any[]
) {
  return {
    // GSTR-1 B2C Small format (consolidated by state and rate)
    place_of_supply: customer.billing_state || 'PLACEHOLDER_STATE',
    rate: items.map((item) => item.tax_rate).join(',') || '0',
    taxable_value: invoice.subtotal,
    integrated_tax: invoice.igst_amount || 0,
    central_tax: invoice.cgst_amount || 0,
    state_ut_tax: invoice.sgst_amount || 0,
    cess: 0, // Placeholder
    ecommerce_gstin: '', // Placeholder
    invoice_count: 1,
  }
}

// Process HSN Summary
function processHSNSummary(items: any[], hsnSummary: any[]) {
  for (const item of items) {
    const hsnCode = item.hsn_sac_code || 'PLACEHOLDER_HSN'
    const existingHSN = hsnSummary.find(
      (h) => h.hsn_code === hsnCode && h.rate === item.tax_rate
    )

    if (existingHSN) {
      existingHSN.quantity += item.quantity
      existingHSN.taxable_value += item.quantity * item.price
      existingHSN.integrated_tax +=
        (item.quantity * item.price * (item.tax_rate || 0)) / 100
    } else {
      hsnSummary.push({
        hsn_code: hsnCode,
        description: item.description || item.name || 'PLACEHOLDER_DESCRIPTION',
        uqc: item.unit || 'NOS', // Unit Quantity Code
        quantity: item.quantity,
        rate: item.tax_rate || 0,
        taxable_value: item.quantity * item.price,
        integrated_tax:
          (item.quantity * item.price * (item.tax_rate || 0)) / 100,
        central_tax: 0, // Calculate based on CGST
        state_ut_tax: 0, // Calculate based on SGST
        cess: 0, // Placeholder
      })
    }
  }
}

// Generate document summary
function generateDocumentSummary(invoices: any[]) {
  const summary = {
    invoices: {
      from_serial: 'PLACEHOLDER_FROM',
      to_serial: 'PLACEHOLDER_TO',
      total_number: invoices.length,
      cancelled: 0, // Placeholder - implement logic for cancelled invoices
    },
    credit_notes: {
      from_serial: 'PLACEHOLDER_FROM',
      to_serial: 'PLACEHOLDER_TO',
      total_number: 0, // Placeholder
      cancelled: 0,
    },
    debit_notes: {
      from_serial: 'PLACEHOLDER_FROM',
      to_serial: 'PLACEHOLDER_TO',
      total_number: 0, // Placeholder
      cancelled: 0,
    },
  }

  return summary
}

// Generate CSV from GSTR-1 data
function generateCSVFromGSTR1Data(
  gstr1Data: any,
  section?: string | null
): Buffer {
  let csvContent = ''

  if (!section || section === 'b2b') {
    csvContent += generateB2BCSV(gstr1Data.b2b)
  }

  if (!section || section === 'b2c_large') {
    csvContent += generateB2CLargeCSV(gstr1Data.b2c_large)
  }

  if (!section || section === 'b2c_small') {
    csvContent += generateB2CSmallCSV(gstr1Data.b2c_small)
  }

  if (!section || section === 'hsn_summary') {
    csvContent += generateHSNSummaryCSV(gstr1Data.hsn_summary)
  }

  if (!section || section === 'document_summary') {
    csvContent += generateDocumentSummaryCSV(gstr1Data.document_summary)
  }

  return Buffer.from(csvContent, 'utf-8')
}

// Generate B2B CSV
function generateB2BCSV(b2bData: any[]): string {
  if (b2bData.length === 0) return ''

  let csv =
    'GSTIN/UIN of Recipient,Receiver Name,Invoice Number,Invoice Date,Invoice Value,Place Of Supply,Reverse Charge,Invoice Type,Rate,Taxable Value,Integrated Tax Amount,Central Tax Amount,State/UT Tax Amount,Cess Amount\n'

  for (const invoice of b2bData) {
    csv += `${invoice.gstin},${invoice.receiver_name},${invoice.invoice_number},${invoice.invoice_date},${invoice.invoice_value},${invoice.place_of_supply},${invoice.reverse_charge},${invoice.invoice_type},${invoice.rate},${invoice.taxable_value},${invoice.integrated_tax},${invoice.central_tax},${invoice.state_ut_tax},${invoice.cess}\n`
  }

  return csv + '\n'
}

// Generate B2C Large CSV
function generateB2CLargeCSV(b2cLargeData: any[]): string {
  if (b2cLargeData.length === 0) return ''

  let csv =
    'Invoice Number,Invoice Date,Invoice Value,Place Of Supply,Rate,Taxable Value,Integrated Tax Amount,Central Tax Amount,State/UT Tax Amount,Cess Amount\n'

  for (const invoice of b2cLargeData) {
    csv += `${invoice.invoice_number},${invoice.invoice_date},${invoice.invoice_value},${invoice.place_of_supply},${invoice.rate},${invoice.taxable_value},${invoice.integrated_tax},${invoice.central_tax},${invoice.state_ut_tax},${invoice.cess}\n`
  }

  return csv + '\n'
}

// Generate B2C Small CSV
function generateB2CSmallCSV(b2cSmallData: any[]): string {
  if (b2cSmallData.length === 0) return ''

  let csv =
    'Place Of Supply,Rate,Taxable Value,Integrated Tax Amount,Central Tax Amount,State/UT Tax Amount,Cess Amount\n'

  // Consolidate B2C small data by place of supply and rate
  const consolidated: any = {}

  for (const invoice of b2cSmallData) {
    const key = `${invoice.place_of_supply}-${invoice.rate}`
    if (consolidated[key]) {
      consolidated[key].taxable_value += invoice.taxable_value
      consolidated[key].integrated_tax += invoice.integrated_tax
      consolidated[key].central_tax += invoice.central_tax
      consolidated[key].state_ut_tax += invoice.state_ut_tax
      consolidated[key].cess += invoice.cess
    } else {
      consolidated[key] = { ...invoice }
    }
  }

  for (const key in consolidated) {
    const invoice = consolidated[key]
    csv += `${invoice.place_of_supply},${invoice.rate},${invoice.taxable_value},${invoice.integrated_tax},${invoice.central_tax},${invoice.state_ut_tax},${invoice.cess}\n`
  }

  return csv + '\n'
}

// Generate HSN Summary CSV
function generateHSNSummaryCSV(hsnData: any[]): string {
  if (hsnData.length === 0) return ''

  let csv =
    'HSN,Description,UQC,Total Quantity,Rate,Taxable Value,Integrated Tax Amount,Central Tax Amount,State/UT Tax Amount,Cess Amount\n'

  for (const hsn of hsnData) {
    csv += `${hsn.hsn_code},${hsn.description},${hsn.uqc},${hsn.quantity},${hsn.rate},${hsn.taxable_value},${hsn.integrated_tax},${hsn.central_tax},${hsn.state_ut_tax},${hsn.cess}\n`
  }

  return csv + '\n'
}

// Generate Document Summary CSV
function generateDocumentSummaryCSV(docSummary: any): string {
  let csv =
    'Nature of Document,Sr. No. From,Sr. No. To,Total Number,Cancelled\n'

  csv += `Invoices for outward supply,${docSummary.invoices.from_serial},${docSummary.invoices.to_serial},${docSummary.invoices.total_number},${docSummary.invoices.cancelled}\n`
  csv += `Credit Note,${docSummary.credit_notes.from_serial},${docSummary.credit_notes.to_serial},${docSummary.credit_notes.total_number},${docSummary.credit_notes.cancelled}\n`
  csv += `Debit Note,${docSummary.debit_notes.from_serial},${docSummary.debit_notes.to_serial},${docSummary.debit_notes.total_number},${docSummary.debit_notes.cancelled}\n`

  return csv + '\n'
}
