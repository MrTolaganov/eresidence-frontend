import { Loader2 } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'

export default function FillLoading() {
  return (
    <Skeleton className='absolute inset-0 z-50 flex size-full items-center justify-center bg-background'>
      <Loader2 className='animate-spin' size={128} />
    </Skeleton>
  )
}
