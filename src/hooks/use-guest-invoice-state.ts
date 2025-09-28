'use client'

import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store'
import {
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
  setSaving,
  setLastSaved,
  resetState,
  loadInvoice,
} from '@/lib/slices/guest-invoice-slice'
import {
  InvoiceState,
  InvoiceItem,
  InvoiceCalculations,
} from '@/lib/schemas/invoice'

// Guest invoice state type (without isDirty to prevent infinite loops)
type GuestInvoiceState = Omit<InvoiceState, 'isDirty'>

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

// Custom hook for guest invoice state using Redux
export function useGuestInvoiceState() {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.guestInvoice)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadFromLocalStorage(GUEST_STORAGE_KEY)
    if (savedState) {
      dispatch(loadInvoice(savedState))
    }
  }, [dispatch])

  // Actions using Redux actions (no isDirty management)
  const actions = {
    setBusiness: useCallback(
      (business: any) => {
        dispatch(setBusiness(business))
      },
      [dispatch]
    ),

    setCustomer: useCallback(
      (customer: any) => {
        dispatch(setCustomer(customer))
      },
      [dispatch]
    ),

    addItem: useCallback(
      (item: InvoiceItem) => {
        dispatch(addItem(item))
      },
      [dispatch]
    ),

    updateItem: useCallback(
      (index: number, item: Partial<InvoiceItem>) => {
        dispatch(updateItem({ index, item }))
      },
      [dispatch]
    ),

    removeItem: useCallback(
      (index: number) => {
        dispatch(removeItem(index))
      },
      [dispatch]
    ),

    setInvoiceNumber: useCallback(
      (invoiceNumber: string) => {
        dispatch(setInvoiceNumber(invoiceNumber))
      },
      [dispatch]
    ),

    setInvoiceDate: useCallback(
      (invoiceDate: string) => {
        dispatch(setInvoiceDate(invoiceDate))
      },
      [dispatch]
    ),

    setDueDate: useCallback(
      (dueDate: string) => {
        dispatch(setDueDate(dueDate))
      },
      [dispatch]
    ),

    setStatus: useCallback(
      (status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled') => {
        dispatch(setStatus(status))
      },
      [dispatch]
    ),

    setNotes: useCallback(
      (notes: string) => {
        dispatch(setNotes(notes))
      },
      [dispatch]
    ),

    setTerms: useCallback(
      (terms: string) => {
        dispatch(setTerms(terms))
      },
      [dispatch]
    ),

    setPaymentTerms: useCallback(
      (paymentTerms: string) => {
        dispatch(setPaymentTerms(paymentTerms))
      },
      [dispatch]
    ),

    setSaving: useCallback(
      (isSaving: boolean) => {
        dispatch(setSaving(isSaving))
      },
      [dispatch]
    ),

    setLastSaved: useCallback(
      (date: Date) => {
        dispatch(setLastSaved(date))
      },
      [dispatch]
    ),

    resetState: useCallback(() => {
      dispatch(resetState())
      if (typeof window !== 'undefined') {
        localStorage.removeItem(GUEST_STORAGE_KEY)
      }
    }, [dispatch]),

    loadInvoice: useCallback(
      (invoice: Partial<InvoiceState>) => {
        dispatch(loadInvoice(invoice))
      },
      [dispatch]
    ),

    // Manual save to localStorage (since no isDirty auto-save)
    saveToLocalStorage: useCallback(() => {
      saveToLocalStorage(GUEST_STORAGE_KEY, state)
      dispatch(setLastSaved(new Date()))
    }, [state, dispatch]),

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
