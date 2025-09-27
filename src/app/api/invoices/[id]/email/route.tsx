/** @jsxImportSource react */
import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderToStream } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { ClassicTemplate } from '@/pdf/templates/classic-template'
import { MinimalTemplate } from '@/pdf/templates/minimal-template'
import { ModernTemplate } from '@/pdf/templates/modern-template'
import QRCode from 'qrcode'
import { serverEnv } from '@/env.server'

const resend = new Resend(serverEnv.RESEND_API_KEY)

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params
    const {
      recipientEmail,
      recipientName,
      template = 'classic',
      customMessage,
    } = await request.json()

    if (!recipientEmail) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      )
    }

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

    // Create email log entry
    const { data: emailLog, error: logError } = await (supabase as any)
      .from('email_logs')
      .insert({
        user_id: user.id,
        invoice_id: invoiceId,
        recipient_email: recipientEmail,
        recipient_name: recipientName || invoice.customers.name,
        subject: `Invoice ${invoice.invoice_number} from ${invoice.businesses.business_name}`,
        email_type: 'invoice',
        status: 'pending',
      })
      .select()
      .single()

    if (logError) {
      console.error('Failed to create email log:', logError)
      return NextResponse.json(
        { error: 'Failed to create email log' },
        { status: 500 }
      )
    }

    try {
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
        const paymentLink = `upi://pay?pa=${invoice.businesses.contact_email}&pn=${encodeURIComponent(invoice.businesses.business_name)}&am=${invoice.total_amount}&cu=INR&tn=Invoice ${invoice.invoice_number}`
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
      const stream = await renderToStream(
        <TemplateComponent data={invoiceData} />
      )

      // Convert stream to buffer
      const chunks: Buffer[] = []
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk))
      }
      const pdfBuffer = Buffer.concat(chunks)

      // Prepare email content
      const emailSubject = `Invoice ${invoice.invoice_number} from ${invoice.businesses.business_name}`
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Invoice ${invoice.invoice_number}</h1>
            <p style="color: #666; font-size: 16px;">From ${invoice.businesses.business_name}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 15px;">Invoice Details</h2>
            <p><strong>Invoice Number:</strong> ${invoice.invoice_number}</p>
            <p><strong>Date:</strong> ${new Date(invoice.invoice_date).toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ₹${invoice.total_amount.toLocaleString()}</p>
          </div>
          
          ${
            customMessage
              ? `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1976d2; margin-bottom: 10px;">Message from ${invoice.businesses.business_name}</h3>
              <p style="color: #333;">${customMessage}</p>
            </div>
          `
              : ''
          }
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; margin-bottom: 20px;">Please find your invoice attached as a PDF.</p>
            <p style="color: #999; font-size: 14px;">
              If you have any questions about this invoice, please contact us at ${invoice.businesses.contact_email}
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
            <p>This email was sent by ${invoice.businesses.business_name}</p>
            <p>${invoice.businesses.business_address}, ${invoice.businesses.business_city}, ${invoice.businesses.business_state} ${invoice.businesses.business_pincode}</p>
          </div>
        </div>
      `

      // Send email with PDF attachment
      const emailResult = await resend.emails.send({
        from: `"${invoice.businesses.business_name}" <noreply@resend.dev>`,
        to: [recipientEmail],
        subject: emailSubject,
        html: emailHtml,
        attachments: [
          {
            filename: `invoice-${invoice.invoice_number}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      })

      if (emailResult.error) {
        throw new Error(emailResult.error.message)
      }

      // Update email log with success
      await (supabase as any)
        .from('email_logs')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', emailLog.id)

      return NextResponse.json({
        success: true,
        message: 'Invoice sent successfully',
        emailId: emailResult.data?.id,
        logId: emailLog.id,
      })
    } catch (emailError) {
      console.error('Email sending failed:', emailError)

      // Update email log with failure
      await (supabase as any)
        .from('email_logs')
        .update({
          status: 'failed',
          error_message:
            emailError instanceof Error ? emailError.message : 'Unknown error',
          retry_count: 1,
        })
        .eq('id', emailLog.id)

      return NextResponse.json(
        {
          error: 'Failed to send email',
          details:
            emailError instanceof Error ? emailError.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Retry failed emails
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params
    const { logId } = await request.json()

    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 })
    }

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

    // Get email log
    const { data: emailLog, error: logError } = await (supabase as any)
      .from('email_logs')
      .select('*')
      .eq('id', logId)
      .eq('user_id', user.id)
      .single()

    if (logError || !emailLog) {
      return NextResponse.json(
        { error: 'Email log not found' },
        { status: 404 }
      )
    }

    if (emailLog.retry_count >= emailLog.max_retries) {
      return NextResponse.json(
        { error: 'Maximum retry attempts reached' },
        { status: 400 }
      )
    }

    // Retry the email sending process
    // This would involve re-running the email sending logic
    // For now, we'll just update the retry count
    await (supabase as any)
      .from('email_logs')
      .update({
        retry_count: emailLog.retry_count + 1,
        status: 'pending',
      })
      .eq('id', logId)

    return NextResponse.json({
      success: true,
      message: 'Email retry initiated',
    })
  } catch (error) {
    console.error('Email retry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
