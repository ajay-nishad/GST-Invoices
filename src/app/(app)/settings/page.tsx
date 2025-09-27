import { PageHeader } from '@/components/common/page-header'
import { SettingsDashboard } from '@/components/settings/settings-dashboard'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, business defaults, and subscription"
      />

      <SettingsDashboard />
    </div>
  )
}
