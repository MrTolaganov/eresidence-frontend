import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import $axios from '@/http/axios'
import { RootState } from '@/lib/store'
import { recAccSchema } from '@/lib/validation'
import { setPassState } from '@/slices/auth.slice'
import { setLoading } from '@/slices/user.slice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

export default function RecAcc() {
  const { passState } = useSelector((state: RootState) => state.auth)
  const { loading } = useSelector((state: RootState) => state.user)
  const { token } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof recAccSchema>>({
    resolver: zodResolver(recAccSchema),
    defaultValues: {},
  })

  const { mutate } = useMutation({
    mutationKey: ['rec-acc'],
    mutationFn: async (values: z.infer<typeof recAccSchema>) => {
      dispatch(setLoading(true))
      const { data } = await $axios.put('/auth/rec-acc', { token, pass: values.newPass })
      return data
    },
    onSuccess: data => {
      dispatch(setLoading(false))
      navigate('/auth')
      toast.success(data.message)
      form.reset()
    },
  })

  const onSubmit = (values: z.infer<typeof recAccSchema>) => {
    mutate(values)
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <Dialog open={true}>
        <DialogContent>
          <DialogTitle>
            <Logo />
          </DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-4'>
                <FormField
                  control={form.control}
                  name='newPass'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
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
                <FormField
                  control={form.control}
                  name='confirmPass'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
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
                <Button type='submit' className='w-full' disabled={loading}>
                  Submit
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  )
}
