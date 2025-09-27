import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  InvoiceState,
  InvoiceItem,
  InvoiceCalculations,
} from '@/lib/schemas/invoice'

// Guest-specific state type (without isDirty)
type GuestInvoiceState = Omit<InvoiceState, 'isDirty'>

// Initial state for guest mode
const initialState: GuestInvoiceState = {
  business: null,
  customer: null,
  items: [],
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0], // 30 days from now
  status: 'draft',
  notes: '',
  terms: '',
  paymentTerms: '',
  calculations: {
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    cgstAmount: 0,
    sgstAmount: 0,
    igstAmount: 0,
    roundOff: 0,
    totalAmount: 0,
  },
  isSaving: false,
  lastSaved: null,
}

// Helper function to calculate invoice totals
function calculateInvoiceTotals(items: InvoiceItem[]): InvoiceCalculations {
  let subtotal = 0
  let totalDiscount = 0
  let totalTax = 0
  let cgstAmount = 0
  let sgstAmount = 0
  let igstAmount = 0

  items.forEach((item) => {
    const itemSubtotal = item.quantity * item.price
    const discountAmount =
      item.discount_percent > 0
        ? (itemSubtotal * item.discount_percent) / 100
        : item.discount_amount
    const taxableAmount = itemSubtotal - discountAmount
    const taxAmount = (taxableAmount * item.tax_rate) / 100

    subtotal += itemSubtotal
    totalDiscount += discountAmount
    totalTax += taxAmount

    // For GST calculation, we need to determine if it's inter-state or intra-state
    // For now, assuming intra-state (CGST + SGST)
    if (item.tax_rate > 0) {
      const halfTax = taxAmount / 2
      cgstAmount += halfTax
      sgstAmount += halfTax
    }
  })

  const totalBeforeRoundOff = subtotal - totalDiscount + totalTax
  const roundOff = Math.round(totalBeforeRoundOff) - totalBeforeRoundOff
  const totalAmount = Math.round(totalBeforeRoundOff)

  return {
    subtotal,
    totalDiscount,
    totalTax,
    cgstAmount,
    sgstAmount,
    igstAmount,
    roundOff,
    totalAmount,
  }
}

const guestInvoiceSlice = createSlice({
  name: 'guestInvoice',
  initialState,
  reducers: {
    setBusiness: (state, action: PayloadAction<any>) => {
      state.business = action.payload
    },
    setCustomer: (state, action: PayloadAction<any>) => {
      state.customer = action.payload
    },
    addItem: (state, action: PayloadAction<InvoiceItem>) => {
      state.items.push(action.payload)
      state.calculations = calculateInvoiceTotals(state.items)
    },
    updateItem: (
      state,
      action: PayloadAction<{ index: number; item: Partial<InvoiceItem> }>
    ) => {
      const { index, item } = action.payload
      if (state.items[index]) {
        state.items[index] = { ...state.items[index], ...item }
        state.calculations = calculateInvoiceTotals(state.items)
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1)
      state.calculations = calculateInvoiceTotals(state.items)
    },
    setInvoiceNumber: (state, action: PayloadAction<string>) => {
      state.invoiceNumber = action.payload
    },
    setInvoiceDate: (state, action: PayloadAction<string>) => {
      state.invoiceDate = action.payload
    },
    setDueDate: (state, action: PayloadAction<string>) => {
      state.dueDate = action.payload
    },
    setStatus: (
      state,
      action: PayloadAction<'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'>
    ) => {
      state.status = action.payload
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload
    },
    setTerms: (state, action: PayloadAction<string>) => {
      state.terms = action.payload
    },
    setPaymentTerms: (state, action: PayloadAction<string>) => {
      state.paymentTerms = action.payload
    },
    setCalculations: (state, action: PayloadAction<InvoiceCalculations>) => {
      state.calculations = action.payload
    },
    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload
    },
    setLastSaved: (state, action: PayloadAction<Date>) => {
      state.lastSaved = action.payload
    },
    resetState: () => {
      return initialState
    },
    loadInvoice: (state, action: PayloadAction<Partial<InvoiceState>>) => {
      // Filter out isDirty from loaded state to match GuestInvoiceState
      const { isDirty, ...cleanPayload } = action.payload as any
      const loadedState: GuestInvoiceState = {
        ...state,
        ...cleanPayload,
        // Ensure we have valid items array
        items: Array.isArray(cleanPayload.items) ? cleanPayload.items : [],
      }
      return {
        ...loadedState,
        calculations: calculateInvoiceTotals(loadedState.items),
      }
    },
  },
})

export const {
  setBusiness,
  setCustomer,
  addItem,
  updateItem,
  removeItem,
  setInvoiceNumber,
  setInvoiceDate,
  setDueDate,
  setStatus,
  setNotes,
  setTerms,
  setPaymentTerms,
  setCalculations,
  setSaving,
  setLastSaved,
  resetState,
  loadInvoice,
} = guestInvoiceSlice.actions

export default guestInvoiceSlice.reducer
