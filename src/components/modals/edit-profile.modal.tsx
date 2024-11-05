import { useForm } from 'react-hook-form'
import { DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { editProfileSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { IUser } from '@/types/user.type'
import { ChangeEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setUser } from '@/slices/user.slice'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { AxiosError } from 'axios'
import $axios from '@/http/axios'

export default function EditProfileModal({ id, username, phone }: IUser) {
  const [profileImage, setProfileImage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { username, phone },
  })

  const { isSubmitting } = form.formState

  const { mutate } = useMutation({
    mutationKey: ['edit-profile'],
    mutationFn: async (values: z.infer<typeof editProfileSchema>) => {
      const { data } = await $axios.put(`/auth/update/${id}`, {
        username: values.username,
        phone: values.phone,
        image: profileImage,
      })
      console.log(data)

      return data
    },
    onSuccess: data => {
      setErrorMessage('')
      dispatch(setUser(data.user))
      toast.success('Your profile updated successfully')
    },
    onError: (err: AxiosError) => {
      // @ts-ignore
      setErrorMessage(err.response?.data.message)
    },
  })

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const fileReader = new FileReader()
    fileReader.readAsDataURL(e.target.files[0])
    fileReader.onload = e => {
      const result = e.target?.result as string
      const refs = ref(storage, `/eresidence/user/${uuidv4()}`)
      const promise = uploadString(refs, result, 'data_url').then(() =>
        getDownloadURL(refs).then(url => setProfileImage(url))
      )
      toast.promise(promise, {
        loading: 'Uploading',
        success: 'File uploaded successfully',
        error: 'Something went wrong',
      })
    }
  }

  const onSubmit = (values: z.infer<typeof editProfileSchema>) => {
    mutate(values)
  }

  return (
    <DialogContent>
      <DialogTitle className='text-center text-2xl'>Edit your profile</DialogTitle>
      {errorMessage && (
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isSubmitting} />
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
                    <Input {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Profile image (optional)</FormLabel>
              <Input type='file' disabled={isSubmitting} className='pt-2' onChange={onUpload} />
            </FormItem>
            <Button type='submit' disabled={isSubmitting}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogDescription>
    </DialogContent>
  )
}
