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
import { InvoiceItem } from '@/lib/schemas/invoice'

const GUEST_STORAGE_KEY = 'guest-invoice-state'

// Helper functions for localStorage
function saveToLocalStorage(key: string, data: any) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }
}

function loadFromLocalStorage(key: string) {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return null
    }
  }
  return null
}

export function useReduxGuestInvoiceState() {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.guestInvoice)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    // For guest invoices, we save all changes (no isDirty field)
    saveToLocalStorage(GUEST_STORAGE_KEY, state)
  }, [state])

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = loadFromLocalStorage(GUEST_STORAGE_KEY)
    if (savedState) {
      dispatch(loadInvoice(savedState))
    }
  }, [dispatch])

  // Actions
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
    }, [dispatch]),

    loadInvoice: useCallback(
      (invoice: any) => {
        dispatch(loadInvoice(invoice))
      },
      [dispatch]
    ),

    clearStorage: useCallback(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(GUEST_STORAGE_KEY)
      }
      dispatch(resetState())
    }, [dispatch]),
  }

  return { state, ...actions }
}
