'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Calendar,
  User,
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
import { PageHeader } from '@/components/common/page-header'
import { getInvoices, deleteInvoice } from '@/lib/actions/invoice'

interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  total_amount: number
  businesses: {
    business_name: string
    gst_number: string
  }
  customers: {
    customer_name: string
    email: string
  }
  created_at: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const router = useRouter()

  const fetchInvoices = useCallback(
    async (page = 1, searchTerm = search) => {
      try {
        setLoading(true)

        // Add a small delay to show loading state, then fetch
        const [result] = await Promise.all([
          getInvoices(searchTerm, page, 10),
          new Promise((resolve) => setTimeout(resolve, 100)), // Minimum loading time for UX
        ])

        setInvoices(result.data)
        setTotalPages(result.totalPages)
        setTotal(result.total)
        setCurrentPage(page)
      } catch (error) {
        console.error('Failed to fetch invoices:', error)
        // Fallback to mock data for development
        const mockInvoices: Invoice[] = [
          {
            id: '1',
            invoice_number: 'INV-20240101-001',
            invoice_date: '2024-01-01',
            due_date: '2024-01-31',
            status: 'sent',
            total_amount: 59000,
            businesses: {
              business_name: 'Acme Corporation',
              gst_number: '29ABCDE1234F1Z5',
            },
            customers: {
              customer_name: 'John Doe',
              email: 'john@example.com',
            },
            created_at: '2024-01-01T10:00:00Z',
          },
          {
            id: '2',
            invoice_number: 'INV-20240102-002',
            invoice_date: '2024-01-02',
            due_date: '2024-02-01',
            status: 'draft',
            total_amount: 88500,
            businesses: {
              business_name: 'Acme Corporation',
              gst_number: '29ABCDE1234F1Z5',
            },
            customers: {
              customer_name: 'Tech Solutions Pvt Ltd',
              email: 'contact@techsolutions.com',
            },
            created_at: '2024-01-02T14:30:00Z',
          },
        ]
        setInvoices(mockInvoices)
        setTotalPages(1)
        setTotal(mockInvoices.length)
      } finally {
        setLoading(false)
      }
    },
    [search]
  )

  useEffect(() => {
    fetchInvoices(1, search)
  }, [fetchInvoices, search])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }, [])

  const handleDelete = async (invoiceId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this invoice? This action cannot be undone.'
      )
    ) {
      try {
        await deleteInvoice(invoiceId)
        await fetchInvoices(currentPage, search)
      } catch (error) {
        console.error('Failed to delete invoice:', error)
        alert('Failed to delete invoice. Please try again.')
      }
    }
  }

  const handlePageChange = useCallback(
    (page: number) => {
      fetchInvoices(page, search)
    },
    [fetchInvoices, search]
  )

  const getStatusColor = useMemo(
    () => (status: string) => {
      switch (status) {
        case 'draft':
          return 'bg-gray-100 text-gray-800'
        case 'sent':
          return 'bg-blue-100 text-blue-800'
        case 'paid':
          return 'bg-green-100 text-green-800'
        case 'overdue':
          return 'bg-red-100 text-red-800'
        case 'cancelled':
          return 'bg-gray-100 text-gray-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    },
    []
  )

  const formatDate = useMemo(
    () => (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    []
  )

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage your invoices and track payments"
        action={{
          label: 'Create Invoice',
          onClick: () => router.push('/invoices/new'),
        }}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices ({total})</CardTitle>
              <CardDescription>
                View and manage all your invoices
              </CardDescription>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search invoices by number, business, or customer..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          {invoices.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No invoices found"
              description={
                search
                  ? 'No invoices match your search criteria.'
                  : 'Get started by creating your first invoice.'
              }
              action={
                !search
                  ? {
                      label: 'Create Invoice',
                      onClick: () => router.push('/invoices/new'),
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {invoice.invoice_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            Created {formatDate(invoice.created_at)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {invoice.businesses.business_name}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              {invoice.businesses.gst_number}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">
                              {invoice.customers.customer_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {invoice.customers.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{formatDate(invoice.invoice_date)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span>{formatDate(invoice.due_date)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="font-medium">
                          ₹{invoice.total_amount.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/invoices/${invoice.id}`)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(invoice.id)}
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
                    {Math.min(currentPage * 10, total)} of {total} invoices
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
    </div>
  )
}
