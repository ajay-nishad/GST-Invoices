import { Suspense } from 'react'
import { requireUser } from '@/lib/auth'
import { getCachedBusinesses } from '@/lib/cache'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/common/page-header'
import { BusinessesClient } from './businesses-client'
import { BusinessSkeleton } from './business-skeleton'
import { ErrorBoundary } from '@/components/common/error-boundary'

// Enable ISR with revalidation
export const revalidate = 300 // 5 minutes

export default async function BusinessesPage() {
  const user = await requireUser()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Businesses"
        description="Manage your business profiles and settings"
      />

      <ErrorBoundary>
        <Suspense fallback={<BusinessSkeleton />}>
          <BusinessesData userId={user.id} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

async function BusinessesData({ userId }: { userId: string }) {
  const supabase = await createClient()
  if (!supabase) throw new Error('Database connection failed')

  const businesses = await getCachedBusinesses(userId, supabase)

  return <BusinessesClient initialBusinesses={businesses} />
}
