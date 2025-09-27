'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  IndianRupee,
  Percent,
  Hash,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/common/empty-state'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { ItemForm } from './item-form'
import { getItems, deleteItem } from '@/lib/actions/item'

interface Item {
  id: string
  name: string
  description?: string
  hsn_sac_code: string
  price: number
  tax_rate: number
  unit: string
  category?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ItemTableProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function ItemTable({
  searchQuery = '',
  onSearchChange,
}: ItemTableProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState(searchQuery)
  const router = useRouter()

  const fetchItems = useCallback(
    async (page = 1, searchTerm = search) => {
      try {
        setLoading(true)
        const result = await getItems(searchTerm, page, 10)
        setItems(result.data)
        setTotalPages(result.totalPages)
        setTotal(result.total)
        setCurrentPage(page)
      } catch (error) {
        console.error('Failed to fetch items:', error)
        // Fallback to mock data for development
        const mockItems: Item[] = [
          {
            id: '1',
            name: 'Web Development Service',
            description: 'Custom website development and design',
            hsn_sac_code: '9983',
            price: 50000,
            tax_rate: 18,
            unit: 'project',
            category: 'Services',
            is_active: true,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
          },
          {
            id: '2',
            name: 'Laptop Computer',
            description: 'High-performance laptop for business use',
            hsn_sac_code: '8471',
            price: 75000,
            tax_rate: 18,
            unit: 'piece',
            category: 'Electronics',
            is_active: true,
            created_at: '2024-02-20T14:30:00Z',
            updated_at: '2024-02-20T14:30:00Z',
          },
          {
            id: '3',
            name: 'Consulting Services',
            description: 'Business consulting and advisory services',
            hsn_sac_code: '9983',
            price: 2500,
            tax_rate: 18,
            unit: 'hour',
            category: 'Services',
            is_active: true,
            created_at: '2024-03-10T09:15:00Z',
            updated_at: '2024-03-10T09:15:00Z',
          },
        ]
        setItems(mockItems)
        setTotalPages(1)
        setTotal(mockItems.length)
      } finally {
        setLoading(false)
      }
    },
    [search]
  )

  useEffect(() => {
    fetchItems(1, search)
  }, [fetchItems, search])

  const handleSearch = (value: string) => {
    setSearch(value)
    onSearchChange?.(value)
    setCurrentPage(1)
  }

  const handleEdit = (item: Item) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (itemId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this item? This action cannot be undone.'
      )
    ) {
      try {
        await deleteItem(itemId)
        await fetchItems(currentPage, search)
      } catch (error) {
        console.error('Failed to delete item:', error)
        alert('Failed to delete item. Please try again.')
      }
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingItem(null)
    fetchItems(currentPage, search)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingItem(null)
  }

  const handlePageChange = (page: number) => {
    fetchItems(page, search)
  }

  const calculateTotalPrice = (price: number, taxRate: number) => {
    const taxAmount = (price * taxRate) / 100
    return price + taxAmount
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (showForm) {
    return (
      <ItemForm
        item={editingItem}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Items ({total})</CardTitle>
            <CardDescription>
              Manage your product and service catalog
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search items by name, description, or HSN/SAC code..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No items found"
            description={
              search
                ? 'No items match your search criteria.'
                : 'Get started by adding your first item.'
            }
            action={
              !search
                ? {
                    label: 'Add Item',
                    onClick: () => setShowForm(true),
                  }
                : undefined
            }
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>HSN/SAC</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                              {item.description}
                            </div>
                          )}
                          {item.category && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Hash className="h-3 w-3 text-gray-400" />
                        <span className="font-mono text-sm">
                          {item.hsn_sac_code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="h-3 w-3 text-gray-400" />
                        <span className="font-medium">
                          {item.price.toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Percent className="h-3 w-3 text-gray-400" />
                        <span>{item.tax_rate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <IndianRupee className="h-3 w-3 text-gray-400" />
                        <span className="font-bold">
                          {calculateTotalPrice(
                            item.price,
                            item.tax_rate
                          ).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{item.unit}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? 'default' : 'secondary'}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * 10 + 1} to{' '}
                  {Math.min(currentPage * 10, total)} of {total} items
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
