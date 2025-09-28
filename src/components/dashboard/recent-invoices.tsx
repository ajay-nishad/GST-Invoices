import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Eye, Download } from 'lucide-react'
import Link from 'next/link'

// Mock data - replace with actual data from your API
const recentInvoices: RecentInvoice[] = [
  {
    invoice_number: 'INV-001',
    customer_name: 'Acme Corp',
    total_amount: 15000,
    status: 'paid' as const,
    created_at: '2024-01-15T10:00:00Z',
    id: '1',
  },
  {
    invoice_number: 'INV-002',
    customer_name: 'Tech Solutions',
    total_amount: 25000,
    status: 'sent' as const,
    created_at: '2024-01-14T10:00:00Z',
    id: '2',
  },
  {
    invoice_number: 'INV-003',
    customer_name: 'Global Industries',
    total_amount: 18000,
    status: 'overdue' as const,
    created_at: '2024-01-10T10:00:00Z',
    id: '3',
  },
]

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'paid':
      return 'success'
    case 'sent':
      return 'default'
    case 'overdue':
      return 'destructive'
    case 'draft':
      return 'secondary'
    default:
      return 'outline'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

interface RecentInvoice {
  id: string
  invoice_number: string
  customer_name: string
  total_amount: number
  status: string
  created_at: string
}

interface RecentInvoicesProps {
  invoices?: RecentInvoice[]
}

export function RecentInvoices({
  invoices = recentInvoices,
}: RecentInvoicesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Invoices</CardTitle>
        <Link href="/invoices">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice_number}>
                <TableCell className="font-medium">
                  {invoice.invoice_number}
                </TableCell>
                <TableCell>{invoice.customer_name}</TableCell>
                <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(invoice.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
