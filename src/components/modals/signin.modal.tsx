import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import Logo from '../shared/logo'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { signinSchema } from '@/lib/validation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import {
  setOpenForgotPassModal,
  setOpenSigninModal,
  setOpenSignupModal,
} from '@/slices/auth-modal.slice'
import { setAuthState, setPassState } from '@/slices/auth.slice'
import { useMutation } from '@tanstack/react-query'
import { setError, setLoading, setUser } from '@/slices/user.slice'
import $axios from '@/http/axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { useEffect } from 'react'

export default function SigninModal() {
  const { passState } = useSelector((state: RootState) => state.auth)
  const { openSigninModal } = useSelector((state: RootState) => state.authModal)
  const { loading, error } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {},
  })

  const { mutate } = useMutation({
    mutationKey: ['signin'],
    mutationFn: async (values: z.infer<typeof signinSchema>) => {
      dispatch(setLoading(true))
      const { data } = await $axios.post('/auth/signin', values)
      return data
    },
    onSuccess: data => {
      dispatch(setLoading(false))
      dispatch(setOpenSigninModal(false))
      dispatch(setUser(data.user))
      dispatch(setError(''))
      localStorage.setItem('accessToken', data.accessToken)
      navigate('/')
      toast.success('User signed in successfully')
      form.reset()
    },
    onError: (err: AxiosError) => {
      dispatch(setLoading(false))
      // @ts-ignore
      dispatch(setError(err.response?.data.message))
    },
  })

  const onChangeAuthState = (authState: 'signup' | 'forgot-pass') => {
    dispatch(setAuthState(authState))
    authState === 'signup' && dispatch(setOpenSignupModal(true))
    authState === 'forgot-pass' && dispatch(setOpenForgotPassModal(true))
  }

  const onSubmit = (values: z.infer<typeof signinSchema>) => {
    mutate(values)
  }

  useEffect(() => {
    dispatch(setError(''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Dialog open={openSigninModal}>
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
                name='pass'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className='flex items-center'>
                      <FormControl>
                        <Input
                          type={passState === 'hide' ? 'password' : 'text'}
                          placeholder={passState === 'hide' ? '********' : 'userpass'}
                          {...field}
                          disabled={loading}
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
                Don't have an account?{' '}
                <span
                  className='cursor-pointer text-primary underline'
                  onClick={() => onChangeAuthState('signup')}
                >
                  Sign up
                </span>
              </div>
              <span
                className='cursor-pointer font-semibold text-primary underline'
                onClick={() => onChangeAuthState('forgot-pass')}
              >
                Forgot your password?
              </span>
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
