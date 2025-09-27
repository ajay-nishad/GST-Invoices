import { CustomerForm } from '@/components/customers/customer-form'
import { PageHeader } from '@/components/common/page-header'

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Customer"
        description="Create a new customer profile"
      />

      <CustomerForm />
    </div>
  )
}
