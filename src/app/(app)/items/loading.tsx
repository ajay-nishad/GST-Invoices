import { TableSkeleton } from '@/components/ui/skeletons'
import { PageHeader } from '@/components/common/page-header'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ItemsLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Items"
        description="Manage your products and services catalog"
      />

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>
            View and manage your products and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={10} columns={6} showHeader />
        </CardContent>
      </Card>
    </div>
  )
}
