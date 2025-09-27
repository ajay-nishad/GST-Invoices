'use client'

import { PageHeader } from '@/components/common/page-header'
import { ReportsDashboard } from '@/components/reports/reports-dashboard'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="View reports and business insights"
      />

      <ReportsDashboard />
    </div>
  )
}
