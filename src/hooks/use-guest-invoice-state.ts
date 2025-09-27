'use client'

import { useReducer, useCallback, useEffect } from 'react'
import {
  InvoiceState,
  InvoiceItem,
  InvoiceCalculations,
} from '@/lib/schemas/invoice'

// Action types (same as regular invoice state)
type InvoiceAction =
  | { type: 'SET_BUSINESS'; payload: any }
  | { type: 'SET_CUSTOMER'; payload: any }
  | { type: 'ADD_ITEM'; payload: InvoiceItem }
  | {
      type: 'UPDATE_ITEM'
      payload: { index: number; item: Partial<InvoiceItem> }
    }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'SET_INVOICE_NUMBER'; payload: string }
  | { type: 'SET_INVOICE_DATE'; payload: string }
  | { type: 'SET_DUE_DATE'; payload: string }
  | {
      type: 'SET_STATUS'
      payload: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
    }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_TERMS'; payload: string }
  | { type: 'SET_PAYMENT_TERMS'; payload: string }
  | { type: 'SET_CALCULATIONS'; payload: InvoiceCalculations }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_INVOICE'; payload: Partial<InvoiceState> }

// Initial state
const initialState: InvoiceState = {
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
  isDirty: false,
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

// Reducer function (same as regular invoice state)
function invoiceReducer(
  state: InvoiceState,
  action: InvoiceAction
): InvoiceState {
  switch (action.type) {
    case 'SET_BUSINESS':
      return { ...state, business: action.payload, isDirty: true }

    case 'SET_CUSTOMER':
      return { ...state, customer: action.payload, isDirty: true }

    case 'ADD_ITEM':
      const newItems = [...state.items, action.payload]
      return {
        ...state,
        items: newItems,
        calculations: calculateInvoiceTotals(newItems),
        isDirty: true,
      }

    case 'UPDATE_ITEM':
      const updatedItems = state.items.map((item, index) =>
        index === action.payload.index
          ? { ...item, ...action.payload.item }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        calculations: calculateInvoiceTotals(updatedItems),
        isDirty: true,
      }

    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(
        (_, index) => index !== action.payload
      )
      return {
        ...state,
        items: filteredItems,
        calculations: calculateInvoiceTotals(filteredItems),
        isDirty: true,
      }

    case 'SET_INVOICE_NUMBER':
      return { ...state, invoiceNumber: action.payload, isDirty: true }

    case 'SET_INVOICE_DATE':
      return { ...state, invoiceDate: action.payload, isDirty: true }

    case 'SET_DUE_DATE':
      return { ...state, dueDate: action.payload, isDirty: true }

    case 'SET_STATUS':
      return { ...state, status: action.payload, isDirty: true }

    case 'SET_NOTES':
      return { ...state, notes: action.payload, isDirty: true }

    case 'SET_TERMS':
      return { ...state, terms: action.payload, isDirty: true }

    case 'SET_PAYMENT_TERMS':
      return { ...state, paymentTerms: action.payload, isDirty: true }

    case 'SET_CALCULATIONS':
      return { ...state, calculations: action.payload }

    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload }

    case 'SET_SAVING':
      return { ...state, isSaving: action.payload }

    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload, isDirty: false }

    case 'RESET_STATE':
      return initialState

    case 'LOAD_INVOICE':
      const loadedState = { ...state, ...action.payload }
      return {
        ...loadedState,
        calculations: calculateInvoiceTotals(loadedState.items),
        isDirty: false,
      }

    default:
      return state
  }
}

// localStorage utilities
const GUEST_STORAGE_KEY = 'guest-invoice-state'
const GUEST_BUSINESSES_KEY = 'guest-businesses'
const GUEST_CUSTOMERS_KEY = 'guest-customers'
const GUEST_ITEMS_KEY = 'guest-items'

function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }
}

function loadFromLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      return null
    }
  }
  return null
}

// Custom hook for guest invoice state
export function useGuestInvoiceState() {
  const [state, dispatch] = useReducer(invoiceReducer, initialState)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.isDirty) {
      saveToLocalStorage(GUEST_STORAGE_KEY, state)
    }
  }, [state])

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadFromLocalStorage(GUEST_STORAGE_KEY)
    if (savedState) {
      dispatch({ type: 'LOAD_INVOICE', payload: savedState })
    }
  }, [])

  // Actions
  const actions = {
    setBusiness: useCallback((business: any) => {
      dispatch({ type: 'SET_BUSINESS', payload: business })
    }, []),

    setCustomer: useCallback((customer: any) => {
      dispatch({ type: 'SET_CUSTOMER', payload: customer })
    }, []),

    addItem: useCallback((item: InvoiceItem) => {
      dispatch({ type: 'ADD_ITEM', payload: item })
    }, []),

    updateItem: useCallback((index: number, item: Partial<InvoiceItem>) => {
      dispatch({ type: 'UPDATE_ITEM', payload: { index, item } })
    }, []),

    removeItem: useCallback((index: number) => {
      dispatch({ type: 'REMOVE_ITEM', payload: index })
    }, []),

    setInvoiceNumber: useCallback((invoiceNumber: string) => {
      dispatch({ type: 'SET_INVOICE_NUMBER', payload: invoiceNumber })
    }, []),

    setInvoiceDate: useCallback((invoiceDate: string) => {
      dispatch({ type: 'SET_INVOICE_DATE', payload: invoiceDate })
    }, []),

    setDueDate: useCallback((dueDate: string) => {
      dispatch({ type: 'SET_DUE_DATE', payload: dueDate })
    }, []),

    setStatus: useCallback(
      (status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled') => {
        dispatch({ type: 'SET_STATUS', payload: status })
      },
      []
    ),

    setNotes: useCallback((notes: string) => {
      dispatch({ type: 'SET_NOTES', payload: notes })
    }, []),

    setTerms: useCallback((terms: string) => {
      dispatch({ type: 'SET_TERMS', payload: terms })
    }, []),

    setPaymentTerms: useCallback((paymentTerms: string) => {
      dispatch({ type: 'SET_PAYMENT_TERMS', payload: paymentTerms })
    }, []),

    setSaving: useCallback((isSaving: boolean) => {
      dispatch({ type: 'SET_SAVING', payload: isSaving })
    }, []),

    setLastSaved: useCallback((date: Date) => {
      dispatch({ type: 'SET_LAST_SAVED', payload: date })
    }, []),

    resetState: useCallback(() => {
      dispatch({ type: 'RESET_STATE' })
      if (typeof window !== 'undefined') {
        localStorage.removeItem(GUEST_STORAGE_KEY)
      }
    }, []),

    loadInvoice: useCallback((invoice: Partial<InvoiceState>) => {
      dispatch({ type: 'LOAD_INVOICE', payload: invoice })
    }, []),

    // Guest-specific actions for managing localStorage data
    saveBusinesses: useCallback((businesses: any[]) => {
      saveToLocalStorage(GUEST_BUSINESSES_KEY, businesses)
    }, []),

    loadBusinesses: useCallback(() => {
      return loadFromLocalStorage(GUEST_BUSINESSES_KEY) || []
    }, []),

    saveCustomers: useCallback((customers: any[]) => {
      saveToLocalStorage(GUEST_CUSTOMERS_KEY, customers)
    }, []),

    loadCustomers: useCallback(() => {
      return loadFromLocalStorage(GUEST_CUSTOMERS_KEY) || []
    }, []),

    saveItems: useCallback((items: any[]) => {
      saveToLocalStorage(GUEST_ITEMS_KEY, items)
    }, []),

    loadItems: useCallback(() => {
      return loadFromLocalStorage(GUEST_ITEMS_KEY) || []
    }, []),
  }

  return { state, actions }
}
