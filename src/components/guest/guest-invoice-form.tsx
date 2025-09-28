'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Save,
  FileText,
  Calendar,
  User,
  Building2,
  Clock,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useGuestInvoiceState } from '@/hooks/use-guest-invoice-state'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { InvoiceLineItems } from '../invoices/invoice-line-items'
import { InvoiceTotals } from '../invoices/invoice-totals'

interface GuestInvoiceFormProps {
  isGuest?: boolean
}

export function GuestInvoiceForm({ isGuest = true }: GuestInvoiceFormProps) {
  const { state, actions } = useGuestInvoiceState()
  const [businesses, setBusinesses] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)

  // Load guest data from localStorage
  useEffect(() => {
    const savedBusinesses = actions.loadBusinesses()
    const savedCustomers = actions.loadCustomers()

    // Set default businesses and customers if none exist
    if (savedBusinesses.length === 0) {
      const defaultBusinesses = [
        {
          id: 'guest-business-1',
          name: 'My Business',
          email: 'business@example.com',
          phone: '+91 9876543210',
          address: '123 Business Street, City, State 123456',
          gstin: '22AAAAA0000A1Z5',
        },
      ]
      setBusinesses(defaultBusinesses)
      actions.saveBusinesses(defaultBusinesses)
      actions.setBusiness(defaultBusinesses[0])
    } else {
      setBusinesses(savedBusinesses)
      if (!state.business && savedBusinesses.length > 0) {
        actions.setBusiness(savedBusinesses[0])
      }
    }

    if (savedCustomers.length === 0) {
      const defaultCustomers = [
        {
          id: 'guest-customer-1',
          name: 'Sample Customer',
          email: 'customer@example.com',
          phone: '+91 9876543210',
          address: '456 Customer Lane, City, State 654321',
          gstin: '33BBBBB1111B2Z6',
        },
      ]
      setCustomers(defaultCustomers)
      actions.saveCustomers(defaultCustomers)
    } else {
      setCustomers(savedCustomers)
    }
  }, [actions, state.business])

  const handleSaveDraft = useCallback(async () => {
    try {
      actions.setSaving(true)
      // In guest mode, we just save to localStorage (already handled by the hook)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate save delay
      actions.setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save draft:', error)
    } finally {
      actions.setSaving(false)
    }
  }, [actions])

  const handleExportGuest = async (
    format: 'pdf' | 'excel',
    template?: string
  ) => {
    if (state.items.length === 0) {
      alert('Please add at least one item to export the invoice')
      return
    }

    try {
      const response = await fetch(`/api/export/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guestMode: true,
          watermark: true, // Always add watermark for guest exports
          invoiceData: {
            business: state.business,
            customer: state.customer,
            invoice_number: state.invoiceNumber,
            invoice_date: state.invoiceDate,
            due_date: state.dueDate,
            status: state.status,
            items: state.items,
            subtotal: state.calculations.subtotal,
            total_discount: state.calculations.totalDiscount,
            total_tax: state.calculations.totalTax,
            cgst_amount: state.calculations.cgstAmount,
            sgst_amount: state.calculations.sgstAmount,
            igst_amount: state.calculations.igstAmount,
            round_off: state.calculations.roundOff,
            total_amount: state.calculations.totalAmount,
            notes: state.notes,
            terms: state.terms,
            payment_terms: state.paymentTerms,
          },
          template,
        }),
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `invoice-${state.invoiceNumber || 'guest'}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export invoice. Please try again.')
    }
  }

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `GUEST-${year}${month}${day}-${random}`
  }

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (state.items.length > 0) {
      const timer = setTimeout(() => {
        handleSaveDraft()
      }, 30000)
      return () => clearTimeout(timer)
    }
  }, [state.items, handleSaveDraft])

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 's',
      ctrlKey: true,
      callback: handleSaveDraft,
      description: 'Save Draft',
    },
    {
      key: 'Enter',
      ctrlKey: true,
      callback: () => handleSaveDraft(),
      description: 'Save Invoice',
    },
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Invoice
            </h1>
            {isGuest && (
              <Badge
                variant="outline"
                className="bg-orange-50 text-orange-700 border-orange-200"
              >
                Guest Mode
              </Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">
            Create a new invoice for your customer (Guest Mode - saved locally)
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Remove the isDirty indicator since guest state doesn't have it */}
          {state.lastSaved && (
            <div className="text-sm text-gray-500">
              Last saved: {state.lastSaved.toLocaleTimeString()}
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={state.isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>

            <Button
              onClick={() => setShowExportOptions(!showExportOptions)}
              disabled={loading || state.isSaving || state.items.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export (with watermark)
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business & Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>
                Select business and customer for this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business">Business *</Label>
                  <Select
                    value={state.business?.id || ''}
                    onValueChange={(value) => {
                      const business = businesses.find((b) => b.id === value)
                      actions.setBusiness(business)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business" />
                    </SelectTrigger>
                    <SelectContent>
                      {businesses.map((business) => (
                        <SelectItem key={business.id} value={business.id}>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            {business.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer">Customer *</Label>
                  <Select
                    value={state.customer?.id || ''}
                    onValueChange={(value) => {
                      const customer = customers.find((c) => c.id === value)
                      actions.setCustomer(customer)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {customer.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="invoiceNumber"
                      value={state.invoiceNumber}
                      onChange={(e) => actions.setInvoiceNumber(e.target.value)}
                      placeholder="GUEST-20240101-001"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        actions.setInvoiceNumber(generateInvoiceNumber())
                      }
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date *</Label>
                  <Input
                    id="invoiceDate"
                    type="date"
                    value={state.invoiceDate}
                    onChange={(e) => actions.setInvoiceDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={state.dueDate}
                    onChange={(e) => actions.setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <InvoiceLineItems
            items={state.items}
            onUpdateItem={actions.updateItem}
            onRemoveItem={actions.removeItem}
            onAddItem={actions.addItem}
          />

          {/* Notes and Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Add notes, terms, and payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={state.notes}
                  onChange={(e) => actions.setNotes(e.target.value)}
                  placeholder="Additional notes for the customer..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={state.terms}
                  onChange={(e) => actions.setTerms(e.target.value)}
                  placeholder="Terms and conditions..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={state.paymentTerms}
                  onChange={(e) => actions.setPaymentTerms(e.target.value)}
                  placeholder="e.g., Net 30 days"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <InvoiceTotals calculations={state.calculations} />

          {/* Export Options */}
          {showExportOptions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Export Options</CardTitle>
                <CardDescription className="text-xs">
                  Guest exports include watermark
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportGuest('pdf')}
                  className="w-full"
                >
                  Export as PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportGuest('excel')}
                  className="w-full"
                >
                  Export as Excel
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Save Draft:</span>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between">
                <span>Save Invoice:</span>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded">
                  Ctrl+Enter
                </kbd>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
