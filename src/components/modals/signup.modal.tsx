import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import Logo from '../shared/logo'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signupSchema } from '@/lib/validation'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { setAuthState, setPassState } from '@/slices/auth.slice'
import $axios from '@/http/axios'
import { setOpenSignupModal } from '@/slices/auth-modal.slice'
import { setError, setLoading, setUser } from '@/slices/user.slice'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { useEffect } from 'react'

export default function SignupModal() {
  const { passState } = useSelector((state: RootState) => state.auth)
  const { openSignupModal } = useSelector((state: RootState) => state.authModal)
  const { loading, error } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {},
  })

  const { mutate } = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (values: z.infer<typeof signupSchema>) => {
      dispatch(setLoading(true))
      const { data } = await $axios.post('/auth/signup', values)
      return data
    },
    onSuccess: data => {
      dispatch(setLoading(false))
      dispatch(setOpenSignupModal(false))
      dispatch(setUser(data.user))
      dispatch(setError(''))
      localStorage.setItem('accessToken', data.accessToken)
      navigate(`/activate/${data.user.id}`)
      toast.success('User signed up successfully')
      form.reset()
    },
    onError: (err: AxiosError) => {
      dispatch(setLoading(false))
      // @ts-ignore
      dispatch(setError(err.response?.data.message))
    },
  })

  const onSubmit = (values: z.infer<typeof signupSchema>) => {
    mutate(values)
  }

  
  useEffect(() => {
    dispatch(setError(''))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={openSignupModal}>
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
        <DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='username' {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='user@gmail.com' {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder='01234567' {...field} disabled={loading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pass'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className='flex items-center'>
                      <FormControl>
                        <Input
                          type={passState === 'hide' ? 'password' : 'text'}
                          placeholder={passState === 'hide' ? '********' : 'userpass'}
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      {passState === 'hide' ? (
                        <Eye
                          className='ml-[-32px] cursor-pointer'
                          onClick={() => dispatch(setPassState('show'))}
                        />
                      ) : (
                        <EyeOff
                          className='ml-[-32px] cursor-pointer'
                          onClick={() => dispatch(setPassState('hide'))}
                        />
                      )}
                    </div>
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
              <Button type='submit' className='w-full' disabled={loading}>
                Submit
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
