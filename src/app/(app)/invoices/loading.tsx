import { InvoiceTableSkeleton } from '@/components/common/skeleton'
import { PageHeader } from '@/components/common/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function InvoicesLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage your invoices and track payments"
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoices</CardTitle>
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
              disabled
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent>
          <InvoiceTableSkeleton />
        </CardContent>
      </Card>
    </div>
  )
}
