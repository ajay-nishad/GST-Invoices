'use client'

import { useCallback } from 'react'
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
} from '@/lib/slices/invoice-slice'
import { InvoiceItem } from '@/lib/schemas/invoice'

export function useReduxInvoiceState() {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.invoice)

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
  }

  return { state, ...actions }
}
