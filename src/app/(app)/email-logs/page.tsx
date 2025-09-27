import { createClient } from '@/lib/supabase/server'
import { EmailLogsTable } from '@/components/email-logs/email-logs-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function EmailLogsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Database connection failed</div>
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    return <div>Unauthorized</div>
  }

  // Get email logs
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch email logs:', error)
  }

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
          <EmailLogsTable emailLogs={emailLogs || []} />
        </CardContent>
      </Card>
    </div>
  )
}
