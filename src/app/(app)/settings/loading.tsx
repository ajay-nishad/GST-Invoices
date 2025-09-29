import { FormSkeleton, CardSkeleton } from '@/components/ui/skeletons'
import { PageHeader } from '@/components/common/page-header'

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton lines={6} />
        <CardSkeleton lines={6} />
      </div>

      <FormSkeleton fields={8} />
    </div>
  )
}
