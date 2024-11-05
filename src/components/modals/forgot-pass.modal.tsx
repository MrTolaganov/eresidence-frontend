import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import Logo from '../shared/logo'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { forgotPassSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { setAuthState } from '@/slices/auth.slice'
import { useMutation } from '@tanstack/react-query'
import { setError } from '@/slices/user.slice'
import $axios from '@/http/axios'
import { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'

export default function ForgotPassModal() {
  const { openForgotPassModal } = useSelector((state: RootState) => state.authModal)
  const { error } = useSelector((state: RootState) => state.user)
  const [sended, setSended] = useState(false)
  const [message, setMessage] = useState('')
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof forgotPassSchema>>({
    resolver: zodResolver(forgotPassSchema),
    defaultValues: {},
  })

  const { mutate } = useMutation({
    mutationKey: ['forgot-pass'],
    mutationFn: async (values: z.infer<typeof forgotPassSchema>) => {
      setSended(true)
      const { data } = await $axios.post('/auth/forgot-pass', values)
      return data
    },
    onSuccess: data => {
      dispatch(setError(''))
      setMessage(data.message)
    },
    onError: (err: AxiosError) => {
      setSended(false)
      // @ts-ignore
      dispatch(setError(err.response?.data.message))
    },
  })

  const onSubmit = (values: z.infer<typeof forgotPassSchema>) => {
    mutate(values)
  }

  useEffect(() => {
    dispatch(setError(''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={openForgotPassModal}>
      <DialogContent>
        <DialogTitle>
          <Logo />
        </DialogTitle>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='size-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert variant='default'>
            <AlertCircle className='size-4' />
            <AlertTitle>Pending...</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='user@gmail.com' {...field} disabled={sended} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='font-semibold'>
                Have an account?{' '}
                <span
                  className='cursor-pointer text-primary underline'
                  onClick={() => dispatch(setAuthState('signin'))}
                >
                  Sign in
                </span>
              </div>
              <Button type='submit' className='w-full' disabled={sended}>
                Submit
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
