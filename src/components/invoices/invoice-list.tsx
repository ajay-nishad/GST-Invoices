'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Eye, Calendar, User, Building2 } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { useSuspenseQuery, useMutation } from '@/hooks/use-suspense-query'
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

interface InvoiceListProps {
  searchTerm?: string
  page?: number
  pageSize?: number
}

export function InvoiceList({
  searchTerm = '',
  page = 1,
  pageSize = 10,
}: InvoiceListProps) {
  const router = useRouter()

  const {
    data: invoiceData,
    isLoading,
    error,
  } = useSuspenseQuery({
    queryKey: ['invoices', searchTerm, page.toString(), pageSize.toString()],
    queryFn: () => getInvoices(searchTerm, page, pageSize),
  })

  const deleteMutation = useMutation(deleteInvoice, {
    invalidateQueries: [
      ['invoices', searchTerm, page.toString(), pageSize.toString()],
    ],
    onSuccess: () => {
      // Optionally show success message
    },
    onError: (error) => {
      alert('Failed to delete invoice. Please try again.')
      console.error('Failed to delete invoice:', error)
    },
  })

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

  const handleDelete = async (invoiceId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this invoice? This action cannot be undone.'
      )
    ) {
      await deleteMutation.mutate(invoiceId)
    }
  }

  if (isLoading) {
    return <div>Loading invoices...</div>
  }

  if (error) {
    return <div>Error loading invoices: {error.message}</div>
  }

  const invoices = invoiceData?.data || []

  return (
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
        {invoices.map((invoice: Invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>
              <div>
                <div className="font-medium">{invoice.invoice_number}</div>
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
                    onClick={() => router.push(`/invoices/${invoice.id}`)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(invoice.id)}
                    disabled={deleteMutation.isLoading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
