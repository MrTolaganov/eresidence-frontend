import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { RootState } from '@/lib/store'
import { setOpenEditHouseModal } from '@/slices/house-modal.slice'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { editHouseSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { IHouse } from '@/types/house.type'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { ChangeEvent, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import $api from '@/http/api'
import { setError, setIsLoading } from '@/slices/house.slice'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

export default function EditHouseModal({ id, label, body, location, price }: IHouse) {
  const { openEditHouseModal } = useSelector((state: RootState) => state.houseModal)
  const { isLoading, error } = useSelector((state: RootState) => state.house)
  const [requiredImgMsg, setRequiredImgMsg] = useState(false)
  const [image, setImage] = useState('')
  const dispatch = useDispatch()
  const navigate=useNavigate()

  const form = useForm<z.infer<typeof editHouseSchema>>({
    resolver: zodResolver(editHouseSchema),
    defaultValues: { label, body, location, price: price.toString() },
  })

  const { mutate } = useMutation({
    mutationKey: ['edit-house'],
    mutationFn: async (values: z.infer<typeof editHouseSchema>) => {
      dispatch(setIsLoading(true))
      const { data } = await $api.put(`/house/update/${id}`, {
        ...values,
        price: +values.price,
        image,
      })
      return data
    },
    onSuccess: () => {
      dispatch(setIsLoading(false))
      dispatch(setOpenEditHouseModal(false))
      dispatch(setError(''))
      navigate(`/house/${id}`)
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

  const onSubmit = (values: z.infer<typeof editHouseSchema>) => {
    if (!image) {
      setRequiredImgMsg(true)
      return
    }
    mutate(values)
  }

  return (
    <Dialog
      open={openEditHouseModal}
      onOpenChange={() => {
        dispatch(setOpenEditHouseModal(false))
        form.reset()
      }}
    >
      <DialogContent>
        <DialogTitle className='text-center text-2xl'>Edit house</DialogTitle>
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
