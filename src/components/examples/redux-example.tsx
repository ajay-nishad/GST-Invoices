'use client'

import React from 'react'
import { useReduxInvoiceState } from '@/hooks/use-redux-invoice-state'
import { useReduxAuth } from '@/hooks/use-redux-auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

/**
 * Example component demonstrating Redux usage
 * This shows how to use the new Redux-based hooks
 */
export function ReduxExample() {
  // Use Redux auth state
  const { user, loading: authLoading, signOut } = useReduxAuth()

  // Use Redux invoice state
  const {
    state: invoiceState,
    setBusiness,
    setCustomer,
    addItem,
    resetState,
  } = useReduxInvoiceState()

  if (authLoading) {
    return <div>Loading authentication...</div>
  }

  const handleAddSampleItem = () => {
    addItem({
      id: crypto.randomUUID(),
      item_id: crypto.randomUUID(),
      name: 'Sample Item',
      description: 'A sample item for testing',
      hsn_sac_code: '1234',
      quantity: 1,
      unit: 'pcs',
      price: 100,
      tax_rate: 18,
      discount_percent: 0,
      discount_amount: 0,
    })
  }

  const handleSetSampleBusiness = () => {
    setBusiness({
      id: crypto.randomUUID(),
      name: 'Sample Business',
      address: '123 Main St',
      gst_number: 'GST123456789',
    })
  }

  const handleSetSampleCustomer = () => {
    setCustomer({
      id: crypto.randomUUID(),
      name: 'Sample Customer',
      email: 'customer@example.com',
      address: '456 Customer Ave',
    })
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Redux Example</h1>

      {/* Auth State */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Authentication State</h2>
        <div className="space-y-2">
          <p>
            <strong>User:</strong> {user?.email || 'Not authenticated'}
          </p>
          <p>
            <strong>Loading:</strong> {authLoading ? 'Yes' : 'No'}
          </p>
          {user && (
            <Button onClick={signOut} variant="outline">
              Sign Out
            </Button>
          )}
        </div>
      </Card>

      {/* Invoice State */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Invoice State</h2>
        <div className="space-y-2">
          <p>
            <strong>Business:</strong> {invoiceState.business?.name || 'None'}
          </p>
          <p>
            <strong>Customer:</strong> {invoiceState.customer?.name || 'None'}
          </p>
          <p>
            <strong>Items Count:</strong> {invoiceState.items.length}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹
            {invoiceState.calculations.totalAmount}
          </p>
          <p>
            <strong>Is Dirty:</strong> {invoiceState.isDirty ? 'Yes' : 'No'}
          </p>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleSetSampleBusiness} size="sm">
              Set Sample Business
            </Button>
            <Button onClick={handleSetSampleCustomer} size="sm">
              Set Sample Customer
            </Button>
            <Button onClick={handleAddSampleItem} size="sm">
              Add Sample Item
            </Button>
            <Button onClick={resetState} variant="outline" size="sm">
              Reset State
            </Button>
          </div>
        </div>
      </Card>

      {/* Items List */}
      {invoiceState.items.length > 0 && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-2">Invoice Items</h2>
          <div className="space-y-2">
            {invoiceState.items.map((item, index) => (
              <div key={item.id || index} className="p-2 border rounded">
                <p>
                  <strong>{item.name}</strong> - ₹{item.price} x {item.quantity}
                </p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
