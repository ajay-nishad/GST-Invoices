import { BusinessForm } from '@/components/businesses/business-form'
import { PageHeader } from '@/components/common/page-header'

export default function NewBusinessPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Business"
        description="Create a new business profile for your organization"
      />

      <BusinessForm />
    </div>
  )
}
