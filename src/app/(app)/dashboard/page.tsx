import { Suspense } from 'react'
import { requireUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/dashboard/stats-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { RecentInvoices } from '@/components/dashboard/recent-invoices'
import { StatsSkeleton, CardSkeleton } from '@/components/ui/skeletons'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { DollarSign, FileText, Clock, Users } from 'lucide-react'
import { getDashboardStats, getRecentInvoices } from './dashboard-data'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/db'

// Enable ISR with 5-minute revalidation
export const revalidate = 300

export default async function DashboardPage() {
  const user = await requireUser()
  const supabase = await createClient()

  if (!supabase) {
    throw new Error('Database connection failed')
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
        <p className="text-indigo-100">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Cards */}
      <ErrorBoundary>
        <Suspense fallback={<StatsSkeleton count={4} />}>
          <DashboardStats userId={user.id} supabase={supabase} />
        </Suspense>
      </ErrorBoundary>

      {/* Quick Actions and Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />

        <ErrorBoundary>
          <Suspense fallback={<CardSkeleton lines={5} />}>
            <RecentInvoicesData userId={user.id} supabase={supabase} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

async function DashboardStats({
  userId,
  supabase,
}: {
  userId: string
  supabase: SupabaseClient<Database>
}) {
  const stats = await getDashboardStats(userId, supabase)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Revenue"
        value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
        change={{
          value: stats.revenueChange,
          type: stats.revenueChange >= 0 ? 'increase' : 'decrease',
        }}
        icon={DollarSign}
        description="This month"
      />
      <StatsCard
        title="Invoices Sent"
        value={stats.invoicesSent.toString()}
        change={{
          value: stats.invoicesChange,
          type: stats.invoicesChange >= 0 ? 'increase' : 'decrease',
        }}
        icon={FileText}
        description="This month"
      />
      <StatsCard
        title="Pending Payments"
        value={`₹${stats.pendingPayments.toLocaleString('en-IN')}`}
        change={{
          value: stats.pendingChange,
          type: stats.pendingChange >= 0 ? 'increase' : 'decrease',
        }}
        icon={Clock}
        description="Outstanding"
      />
      <StatsCard
        title="Active Customers"
        value={stats.activeCustomers.toString()}
        change={{
          value: stats.customersChange,
          type: stats.customersChange >= 0 ? 'increase' : 'decrease',
        }}
        icon={Users}
        description="Total customers"
      />
    </div>
  )
}

async function RecentInvoicesData({
  userId,
  supabase,
}: {
  userId: string
  supabase: SupabaseClient<Database>
}) {
  const recentInvoices = await getRecentInvoices(userId, supabase)

  return <RecentInvoices invoices={recentInvoices} />
}
