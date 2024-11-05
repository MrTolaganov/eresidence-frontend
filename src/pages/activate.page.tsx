import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export default function Activate() {
  return (
    <div className='flex h-screen items-center justify-center'>
      <Alert variant='default' className='w-full md:w-1/2'>
        <AlertCircle className='size-4' />
        <AlertTitle>Pending...</AlertTitle>
        <AlertDescription>
          We are waiting for activating your email that has just sended your email address
        </AlertDescription>
      </Alert>
    </div>
  )
}
