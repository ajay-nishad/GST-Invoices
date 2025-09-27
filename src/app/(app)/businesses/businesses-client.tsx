'use client'

import { useState, useOptimistic } from 'react'
import { useRouter } from 'next/navigation'
import { BusinessTable } from '@/components/businesses/business-table'
import { BusinessForm } from '@/components/businesses/business-form'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import {
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '@/lib/actions/business'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { Business } from '@/components/businesses/business-table'

interface BusinessesClientProps {
  initialBusinesses: Business[]
}

export function BusinessesClient({ initialBusinesses }: BusinessesClientProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null)
  const [optimisticBusinesses, addOptimisticBusiness] = useOptimistic(
    initialBusinesses,
    (state: Business[], newBusiness: Business) => [...state, newBusiness]
  )
  const router = useRouter()

  const createMutation = useOptimisticMutation(createBusiness, {
    onSuccess: () => {
      setShowForm(false)
      router.refresh() // Refresh server component data
    },
    successMessage: 'Business created successfully',
    errorMessage: 'Failed to create business',
    retryable: true,
  })

  const updateMutation = useOptimisticMutation(updateBusiness, {
    onSuccess: () => {
      setShowForm(false)
      setEditingBusiness(null)
      router.refresh()
    },
    successMessage: 'Business updated successfully',
    errorMessage: 'Failed to update business',
    retryable: true,
  })

  const deleteMutation = useOptimisticMutation(deleteBusiness, {
    onSuccess: () => {
      router.refresh()
    },
    successMessage: 'Business deleted successfully',
    errorMessage: 'Failed to delete business',
    retryable: true,
  })

  const handleCreate = async (data: any) => {
    // Optimistically add the business
    const optimisticBusiness: Business = {
      id: `temp-${Date.now()}`,
      ...data,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    addOptimisticBusiness(optimisticBusiness)

    await createMutation.mutate(data)
  }

  const handleUpdate = async (data: any) => {
    await updateMutation.mutate(data)
  }

  const handleDelete = async (businessId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this business? This action cannot be undone.'
      )
    ) {
      await deleteMutation.mutate(businessId)
    }
  }

  const handleEdit = (business: Business) => {
    setEditingBusiness(business)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingBusiness(null)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingBusiness(null)
  }

  if (showForm) {
    return (
      <BusinessForm
        business={editingBusiness}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
        onSubmit={editingBusiness ? handleUpdate : handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Business
        </Button>
      </div>

      <BusinessTable
        businesses={optimisticBusinesses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}
