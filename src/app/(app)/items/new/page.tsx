import { ItemForm } from '@/components/items/item-form'
import { PageHeader } from '@/components/common/page-header'

export default function NewItemPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Item"
        description="Create a new product or service item"
      />

      <ItemForm />
    </div>
  )
}
