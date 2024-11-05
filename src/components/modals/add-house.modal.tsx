import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { addHouseSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { setOpenAddHouseModal } from '@/slices/house-modal.slice'
import { ChangeEvent, useState } from 'react'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import $api from '@/http/api'
import { setError, setHouses, setIsLoading, setMyHouses } from '@/slices/house.slice'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'

export default function AddHouseModal() {
  const { openAddHouseModal } = useSelector((state: RootState) => state.houseModal)
  const { isLoading, myHouses, houses, error } = useSelector((state: RootState) => state.house)
  const [requiredImgMsg, setRequiredImgMsg] = useState(false)
  const [image, setImage] = useState('')
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof addHouseSchema>>({
    resolver: zodResolver(addHouseSchema),
    defaultValues: { label: '', body: '', location: '', price: '' },
  })

  const { mutate } = useMutation({
    mutationKey: ['add-house'],
    mutationFn: async (values: z.infer<typeof addHouseSchema>) => {
      dispatch(setIsLoading(true))
      const { data } = await $api.post('/house/create', { ...values, price: +values.price, image })
      return data
    },
    onSuccess: data => {
      dispatch(setIsLoading(false))
      dispatch(setHouses([data.house, ...houses]))
      dispatch(setMyHouses([data.house, ...myHouses]))
      dispatch(setOpenAddHouseModal(false))
      dispatch(setError(''))
      form.reset()
    },
    onError: err => {
      dispatch(setIsLoading(false))
      // @ts-ignore
      dispatch(setError(err.response.data.message))
    },
  })

  const onUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return
    const fileReader = new FileReader()
    fileReader.readAsDataURL(e.target.files[0])
    fileReader.onload = e => {
      const result = e.target?.result as string
      const refs = ref(storage, `/eresidence/house/${uuidv4()}`)
      const promise = uploadString(refs, result, 'data_url').then(() =>
        getDownloadURL(refs).then(url => setImage(url))
      )
      toast.promise(promise, {
        loading: 'Uploading',
        success: 'File uploaded successfully',
        error: 'Something went wrong',
      })
    }
  }

  const onSubmit = (values: z.infer<typeof addHouseSchema>) => {
    if (!image) {
      setRequiredImgMsg(true)
      return
    }
    mutate(values)
  }

  return (
    <Dialog
      open={openAddHouseModal}
      onOpenChange={() => {
        dispatch(setOpenAddHouseModal(false))
        form.reset()
      }}
    >
      <DialogContent>
        <DialogTitle className='text-center text-2xl'>Add house</DialogTitle>
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
                name='label'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='body'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} placeholder='$' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Image</FormLabel>
                <Input type='file' disabled={isLoading} className='pt-2' onChange={onUpload} />
                {requiredImgMsg && <div className='text-xs text-red-800'>Image is required</div>}
              </FormItem>
              <Button type='submit' className='w-full' disabled={isLoading}>
                Submit
              </Button>
            </form>
          </Form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
