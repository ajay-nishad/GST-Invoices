import { TableSkeleton } from '@/components/ui/skeletons'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function EmailLogsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Email Logs</h1>
        <p className="text-gray-600 mt-1">
          Track all invoice emails sent to your customers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email History</CardTitle>
          <CardDescription>
            View and manage all email communications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TableSkeleton rows={8} columns={6} showHeader />
        </CardContent>
      </Card>
    </div>
  )
}
