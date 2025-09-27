import { z } from 'zod'

export const invoiceItemSchema = z.object({
  id: z.string().optional(),
  item_id: z.string().uuid('Invalid item ID'),
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  hsn_sac_code: z.string().min(1, 'HSN/SAC code is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  price: z.number().min(0, 'Price must be positive'),
  tax_rate: z.number().min(0).max(100, 'Tax rate must be between 0-100%'),
  discount_percent: z
    .number()
    .min(0)
    .max(100, 'Discount must be between 0-100%')
    .default(0),
  discount_amount: z
    .number()
    .min(0, 'Discount amount must be positive')
    .default(0),
})

export const invoiceSchema = z.object({
  business_id: z.string().uuid('Invalid business ID'),
  customer_id: z.string().uuid('Invalid customer ID'),
  invoice_number: z.string().min(1, 'Invoice number is required'),
  invoice_date: z.string().min(1, 'Invoice date is required'),
  due_date: z.string().min(1, 'Due date is required'),
  status: z
    .enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
    .default('draft'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  total_discount: z
    .number()
    .min(0, 'Total discount must be positive')
    .default(0),
  total_tax: z.number().min(0, 'Total tax must be positive'),
  cgst_amount: z.number().min(0, 'CGST amount must be positive').default(0),
  sgst_amount: z.number().min(0, 'SGST amount must be positive').default(0),
  igst_amount: z.number().min(0, 'IGST amount must be positive').default(0),
  round_off: z.number().default(0),
  total_amount: z.number().min(0, 'Total amount must be positive'),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
  terms: z
    .string()
    .max(1000, 'Terms must be less than 1000 characters')
    .optional(),
  payment_terms: z
    .string()
    .max(500, 'Payment terms must be less than 500 characters')
    .optional(),
})

export const invoiceUpdateSchema = invoiceSchema.partial().extend({
  id: z.string().uuid('Invalid invoice ID'),
})

export type InvoiceItem = z.infer<typeof invoiceItemSchema>
export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type InvoiceUpdateData = z.infer<typeof invoiceUpdateSchema>

// Helper types for calculations
export interface InvoiceCalculations {
  subtotal: number
  totalDiscount: number
  totalTax: number
  cgstAmount: number
  sgstAmount: number
  igstAmount: number
  roundOff: number
  totalAmount: number
}

export interface InvoiceState {
  business: any | null
  customer: any | null
  items: InvoiceItem[]
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes: string
  terms: string
  paymentTerms: string
  calculations: InvoiceCalculations
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null
}
