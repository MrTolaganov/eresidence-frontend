import { Card } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function HouseSkeleton() {
  return (
    <Card className='h-72 bg-secondary'>
      <Skeleton className='h-60 w-full bg-background' />
      <div className='flex h-12 items-center justify-between p-2'>
        <Skeleton className='h-full w-2/3 bg-background' />
        <Skeleton className='h-full w-1/4 bg-background' />
      </div>
    </Card>
  )
}
