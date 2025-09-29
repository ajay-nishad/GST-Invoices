import { Suspense } from 'react'
import { requireUser } from '@/lib/auth'
import { PageHeader } from '@/components/common/page-header'
import { InvoiceTableSkeleton } from '@/components/common/skeleton'
import { InvoicesClient } from './invoices-client'
import { ErrorBoundary } from '@/components/common/error-boundary'

// Enable ISR with revalidation
export const revalidate = 300 // 5 minutes

export default async function InvoicesPage() {
  const user = await requireUser()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Manage your invoices and track payments"
      />

      <ErrorBoundary>
        <Suspense fallback={<InvoiceTableSkeleton />}>
          <InvoicesClient userId={user.id} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
