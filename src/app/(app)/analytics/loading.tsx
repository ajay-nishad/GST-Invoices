import { StatsSkeleton, CardSkeleton } from '@/components/ui/skeletons'
import { PageHeader } from '@/components/common/page-header'

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Business insights and reports"
      />

      {/* Stats Cards */}
      <StatsSkeleton count={4} />

      {/* Charts and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton lines={8} />
        <CardSkeleton lines={8} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CardSkeleton lines={12} />
      </div>
    </div>
  )
}
