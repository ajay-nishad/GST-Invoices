'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  MapPin,
  Phone,
  Mail,
  Building2,
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
import { CustomerForm } from './customer-form'
import { getCustomers, deleteCustomer } from '@/lib/actions/customer'

interface Customer {
  id: string
  name: string
  gst_number?: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  customer_type: 'individual' | 'business'
  notes?: string
  created_at: string
  updated_at: string
}

interface CustomerTableProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function CustomerTable({
  searchQuery = '',
  onSearchChange,
}: CustomerTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState(searchQuery)
  const router = useRouter()

  const fetchCustomers = useCallback(
    async (page = 1, searchTerm = search) => {
      try {
        setLoading(true)
        const result = await getCustomers(searchTerm, page, 10)
        setCustomers(result.data)
        setTotalPages(result.totalPages)
        setTotal(result.total)
        setCurrentPage(page)
      } catch (error) {
        console.error('Failed to fetch customers:', error)
        // Fallback to mock data for development
        const mockCustomers: Customer[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+91 98765 43210',
            address: '123 Main Street, Andheri West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India',
            customer_type: 'individual',
            notes: 'Regular customer',
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z',
          },
          {
            id: '2',
            name: 'Tech Solutions Pvt Ltd',
            gst_number: '29ABCDE1234F1Z5',
            email: 'contact@techsolutions.com',
            phone: '+91 87654 32109',
            address: '456 Tech Park, Electronic City',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560001',
            country: 'India',
            customer_type: 'business',
            notes: 'Software development company',
            created_at: '2024-02-20T14:30:00Z',
            updated_at: '2024-02-20T14:30:00Z',
          },
        ]
        setCustomers(mockCustomers)
        setTotalPages(1)
        setTotal(mockCustomers.length)
      } finally {
        setLoading(false)
      }
    },
    [search]
  )

  useEffect(() => {
    fetchCustomers(1, search)
  }, [fetchCustomers, search])

  const handleSearch = (value: string) => {
    setSearch(value)
    onSearchChange?.(value)
    setCurrentPage(1)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleDelete = async (customerId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this customer? This action cannot be undone.'
      )
    ) {
      try {
        await deleteCustomer(customerId)
        await fetchCustomers(currentPage, search)
      } catch (error) {
        console.error('Failed to delete customer:', error)
        alert('Failed to delete customer. Please try again.')
      }
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCustomer(null)
    fetchCustomers(currentPage, search)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCustomer(null)
  }

  const handlePageChange = (page: number) => {
    fetchCustomers(page, search)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (showForm) {
    return (
      <CustomerForm
        customer={editingCustomer}
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
            <CardTitle>Customers ({total})</CardTitle>
            <CardDescription>
              Manage your customer information and details
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <EmptyState
            icon={User}
            title="No customers found"
            description={
              search
                ? 'No customers match your search criteria.'
                : 'Get started by adding your first customer.'
            }
            action={
              !search
                ? {
                    label: 'Add Customer',
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          {customer.customer_type === 'business' ? (
                            <Building2 className="h-5 w-5 text-indigo-600" />
                          ) : (
                            <User className="h-5 w-5 text-indigo-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          {customer.gst_number && (
                            <div className="text-sm text-gray-500 font-mono">
                              GST: {customer.gst_number}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-[150px]">
                            {customer.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>
                            {customer.city}, {customer.state}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.pincode}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          customer.customer_type === 'business'
                            ? 'default'
                            : 'outline'
                        }
                      >
                        {customer.customer_type === 'business'
                          ? 'Business'
                          : 'Individual'}
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
                          <DropdownMenuItem
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(customer.id)}
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
                  {Math.min(currentPage * 10, total)} of {total} customers
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
