'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/common/page-header'
import { ItemTable } from '@/components/items/item-table'
import { ItemForm } from '@/components/items/item-form'

export default function ItemsPage() {
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
          title="Add New Item"
          description="Create a new product or service item"
        />

        <ItemForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Items"
        description="Manage your product and service catalog"
        action={{
          label: 'Add Item',
          onClick: () => setShowForm(true),
        }}
      />

      <ItemTable
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
    </div>
  )
}
