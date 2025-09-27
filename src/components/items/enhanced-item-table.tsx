'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableSkeleton } from '@/components/ui/skeletons'
import { EmptyState } from '@/components/common/empty-state'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useMutationWithRetry } from '@/hooks/use-retry-mutation'
import { deleteItem } from '@/lib/actions/item'
import { Package, Search, Edit, Trash2, Plus } from 'lucide-react'
import { ErrorBoundary } from '@/components/common/error-boundary'

interface Item {
  id: string
  name: string
  description?: string
  hsn_sac_code?: string
  price: number
  tax_rate: number
  unit?: string
  category?: string
  is_active: boolean
  created_at: string
}

interface EnhancedItemTableProps {
  initialItems: Item[]
  totalCount: number
  currentPage: number
  totalPages: number
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onPageChange?: (page: number) => void
  onEdit?: (item: Item) => void
  onAdd?: () => void
}

export function EnhancedItemTable({
  initialItems,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = '',
  onSearchChange,
  onPageChange,
  onEdit,
  onAdd,
}: EnhancedItemTableProps) {
  const [search, setSearch] = useState(searchQuery)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Optimistic updates for items
  const [optimisticItems, updateOptimisticItems] = useOptimistic(
    initialItems,
    (
      state: Item[],
      { action, item }: { action: 'delete' | 'add' | 'update'; item: Item }
    ) => {
      switch (action) {
        case 'delete':
          return state.filter((i) => i.id !== item.id)
        case 'add':
          return [item, ...state]
        case 'update':
          return state.map((i) => (i.id === item.id ? { ...i, ...item } : i))
        default:
          return state
      }
    }
  )

  // Delete mutation with retry
  const deleteMutation = useMutationWithRetry(deleteItem, {
    maxRetries: 3,
    onSuccess: () => {
      router.refresh() // Refresh server data
    },
    successMessage: 'Item deleted successfully',
    errorMessage: 'Failed to delete item',
    onRetry: (attempt) => {
      console.log(`Retrying delete operation, attempt ${attempt}`)
    },
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    startTransition(() => {
      onSearchChange?.(value)
    })
  }

  const handleDelete = async (item: Item) => {
    if (
      confirm(
        'Are you sure you want to delete this item? This action cannot be undone.'
      )
    ) {
      // Optimistically remove the item
      updateOptimisticItems({ action: 'delete', item })

      // Perform the actual deletion
      await deleteMutation.mutate(item.id)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  const formatTax = (rate: number) => {
    return `${rate}%`
  }

  if (optimisticItems.length === 0 && !isPending) {
    return (
      <ErrorBoundary>
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Package}
              title="No items found"
              description={
                searchQuery
                  ? 'No items match your search criteria.'
                  : 'Get started by adding your first item.'
              }
              action={
                onAdd
                  ? {
                      label: 'Add Item',
                      onClick: onAdd,
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Items ({totalCount})</CardTitle>
            {onAdd && (
              <Button onClick={onAdd} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          {isPending ? (
            <TableSkeleton rows={5} columns={7} showHeader />
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>HSN/SAC</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optimisticItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.category && (
                            <div className="text-sm text-gray-500">
                              {item.category}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm text-gray-600">
                          {item.description || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm">
                          {item.hsn_sac_code || '-'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatCurrency(item.price)}
                          </div>
                          {item.unit && (
                            <div className="text-sm text-gray-500">
                              per {item.unit}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatTax(item.tax_rate)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.is_active ? 'default' : 'secondary'}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item)}
                            disabled={deleteMutation.isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange?.(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange?.(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </ErrorBoundary>
  )
}
