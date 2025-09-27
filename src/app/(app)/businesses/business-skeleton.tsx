import {
  Skeleton,
  TableSkeleton,
  CardSkeleton,
} from '@/components/ui/skeletons'

export function BusinessSkeleton() {
  return (
    <div className="space-y-4">
      {/* Action button skeleton */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table skeleton */}
      <div className="border rounded-lg">
        <TableSkeleton rows={3} columns={6} showHeader={true} />
      </div>
    </div>
  )
}

export function BusinessFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto">
      <CardSkeleton lines={8} />
    </div>
  )
}
