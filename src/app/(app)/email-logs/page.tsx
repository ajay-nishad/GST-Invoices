import { Suspense } from 'react'
import { requireUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { EmailLogsTable } from '@/components/email-logs/email-logs-table'
import { TableSkeleton } from '@/components/ui/skeletons'
import { ErrorBoundary } from '@/components/common/error-boundary'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Enable ISR with revalidation
export const revalidate = 300 // 5 minutes

export default async function EmailLogsPage() {
  const user = await requireUser()

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
          <ErrorBoundary>
            <Suspense
              fallback={<TableSkeleton rows={8} columns={6} showHeader />}
            >
              <EmailLogsData userId={user.id} />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  )
}

async function EmailLogsData({ userId }: { userId: string }) {
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get email logs with streaming
  const { data: emailLogs, error } = await (supabase as any)
    .from('email_logs')
    .select(
      `
      *,
      invoices!inner(
        invoice_number,
        total_amount
      )
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch email logs:', error)
    throw new Error('Failed to fetch email logs')
  }

  return <EmailLogsTable emailLogs={emailLogs || []} />
}
