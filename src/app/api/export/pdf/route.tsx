/** @jsxImportSource react */
import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { ClassicTemplate } from '@/pdf/templates/classic-template'
import { MinimalTemplate } from '@/pdf/templates/minimal-template'
import { ModernTemplate } from '@/pdf/templates/modern-template'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()
    const {
      invoiceId,
      template = 'classic',
      guestMode = false,
      watermark = false,
      invoiceData: guestInvoiceData,
    } = requestBody

    // Handle guest mode
    if (guestMode && guestInvoiceData) {
      return await handleGuestExport(guestInvoiceData, template, watermark)
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

    // Get user's subscription status to determine if it's free plan
    const { data: subscription } = await (supabase as any)
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    const isFreePlan = !subscription || subscription.status !== 'active'

    // Generate QR code for payment link (optional)
    let qrCodeData: string | undefined
    try {
      const paymentLink = `upi://pay?pa=${invoice.businesses.email}&pn=${encodeURIComponent(invoice.businesses.name)}&am=${invoice.total_amount}&cu=INR&tn=Invoice ${invoice.invoice_number}`
      qrCodeData = await QRCode.toDataURL(paymentLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
    } catch (qrError) {
      console.warn('Failed to generate QR code:', qrError)
    }

    // Prepare data for PDF template
    const invoiceData = {
      business: invoice.businesses,
      customer: invoice.customers,
      invoice: {
        invoice_number: invoice.invoice_number,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        status: invoice.status,
        notes: invoice.notes,
        terms: invoice.terms,
        payment_terms: invoice.payment_terms,
      },
      items: invoice.invoice_items.map((item: any) => ({
        name: item.name,
        description: item.description,
        hsn_sac_code: item.hsn_sac_code,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        tax_rate: item.tax_rate,
        discount_percent: item.discount_percent,
        discount_amount: item.discount_amount,
      })),
      calculations: {
        subtotal: invoice.subtotal,
        totalDiscount: invoice.total_discount,
        totalTax: invoice.total_tax,
        cgstAmount: invoice.cgst_amount,
        sgstAmount: invoice.sgst_amount,
        igstAmount: invoice.igst_amount,
        roundOff: invoice.round_off,
        totalAmount: invoice.total_amount,
      },
      isFreePlan,
      qrCodeData,
    }

    return await generatePDFResponse(
      invoiceData,
      template,
      invoice.invoice_number
    )
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

async function handleGuestExport(
  guestInvoiceData: any,
  template: string,
  watermark: boolean
) {
  // Generate QR code for payment link (optional)
  let qrCodeData: string | undefined
  try {
    if (guestInvoiceData.business?.email) {
      const paymentLink = `upi://pay?pa=${guestInvoiceData.business.email}&pn=${encodeURIComponent(guestInvoiceData.business.name)}&am=${guestInvoiceData.total_amount}&cu=INR&tn=Invoice ${guestInvoiceData.invoice_number}`
      qrCodeData = await QRCode.toDataURL(paymentLink, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
    }
  } catch (qrError) {
    console.warn('Failed to generate QR code:', qrError)
  }

  // Prepare data for PDF template
  const invoiceData = {
    business: guestInvoiceData.business,
    customer: guestInvoiceData.customer,
    invoice: {
      invoice_number: guestInvoiceData.invoice_number,
      invoice_date: guestInvoiceData.invoice_date,
      due_date: guestInvoiceData.due_date,
      status: guestInvoiceData.status,
      notes: guestInvoiceData.notes,
      terms: guestInvoiceData.terms,
      payment_terms: guestInvoiceData.payment_terms,
    },
    items: guestInvoiceData.items,
    calculations: {
      subtotal: guestInvoiceData.subtotal,
      totalDiscount: guestInvoiceData.total_discount,
      totalTax: guestInvoiceData.total_tax,
      cgstAmount: guestInvoiceData.cgst_amount,
      sgstAmount: guestInvoiceData.sgst_amount,
      igstAmount: guestInvoiceData.igst_amount,
      roundOff: guestInvoiceData.round_off,
      totalAmount: guestInvoiceData.total_amount,
    },
    isFreePlan: true, // Guest mode always shows as free plan
    isGuestMode: true,
    watermark: watermark,
    qrCodeData,
  }

  return await generatePDFResponse(
    invoiceData,
    template,
    guestInvoiceData.invoice_number || 'guest'
  )
}

async function generatePDFResponse(
  invoiceData: any,
  template: string,
  invoiceNumber: string
) {
  // Select template
  let TemplateComponent
  switch (template) {
    case 'minimal':
      TemplateComponent = MinimalTemplate
      break
    case 'modern':
      TemplateComponent = ModernTemplate
      break
    case 'classic':
    default:
      TemplateComponent = ClassicTemplate
      break
  }

  // Generate PDF
  const stream = await renderToStream(<TemplateComponent data={invoiceData} />)

  // Convert stream to buffer
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  const pdfBuffer = Buffer.concat(chunks)

  // Return PDF as response
  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoiceNumber}.pdf"`,
      'Content-Length': pdfBuffer.length.toString(),
    },
  })
}
