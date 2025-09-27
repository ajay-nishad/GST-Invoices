'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common/page-header'
import { CustomerTable } from '@/components/customers/customer-table'
import { CustomerForm } from '@/components/customers/customer-form'

export default function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleFormSuccess = () => {
    setShowForm(false)
  }

  const handleFormCancel = () => {
    setShowForm(false)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Add New Customer"
          description="Create a new customer profile"
        />

        <CustomerForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer information and details"
        action={{
          label: 'Add Customer',
          onClick: () => setShowForm(true),
        }}
      />

      <CustomerTable
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
    </div>
  )
}
