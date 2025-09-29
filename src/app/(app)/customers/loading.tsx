import { TableSkeleton } from '@/components/ui/skeletons'
import { PageHeader } from '@/components/common/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer information and contacts"
      />

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>View and manage all your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={8} columns={5} showHeader />
        </CardContent>
      </Card>
    </div>
  )
}
