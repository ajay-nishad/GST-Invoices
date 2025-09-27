import { getInvoice } from '@/lib/actions/invoice'
import { InvoiceForm } from '@/components/invoices/invoice-form'
import { notFound } from 'next/navigation'

interface EditInvoicePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditInvoicePage({
  params,
}: EditInvoicePageProps) {
  try {
    const { id } = await params
    const invoice = await getInvoice(id)

    if (!invoice) {
      notFound()
    }

    // Transform the invoice data to match the form state
    const formData = {
      business: invoice.businesses,
      customer: invoice.customers,
      items: invoice.invoice_items.map((item: any) => ({
        id: item.id,
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
      })),
      invoiceNumber: invoice.invoice_number,
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date,
      status: invoice.status,
      notes: invoice.notes || '',
      terms: invoice.terms || '',
      paymentTerms: invoice.payment_terms || '',
    }

    return <InvoiceForm invoiceId={id} initialData={formData} />
  } catch (error) {
    console.error('Failed to load invoice:', error)
    notFound()
  }
}
