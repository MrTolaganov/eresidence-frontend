import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Textarea } from '../ui/textarea'
import { z } from 'zod'
import { feedbackSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'
import { useMutation } from '@tanstack/react-query'
import $api from '@/http/api'
import $axios from '@/http/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setFeedback } from '@/slices/feedback.slice'
import { RootState } from '@/lib/store'
import { Link } from 'react-router-dom'

export default function FeedbackForm({ houseId }: { houseId: string }) {
  const { user } = useSelector((state: RootState) => state.user)
  const [rating, setRating] = useState(0)
  const [ratingErr, setRatingErr] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { comment: '' },
  })

  const { mutate } = useMutation({
    mutationKey: ['onfeedback'],
    mutationFn: async (values: z.infer<typeof feedbackSchema>) => {
      setIsLoading(true)
      await $api.post(`/feedback/on-feedback/${houseId}`, {
        value: rating,
        comment: values.comment,
      })
      const { data } = await $axios.get(`/feedback/house-fbs/${houseId}`)
      dispatch(setFeedback(data))
      setIsLoading(false)
      return data
    },
    onSuccess: () => {
      form.reset({ comment: '' })
      setRating(0)
    },
  })

  const onSubmit = (values: z.infer<typeof feedbackSchema>) => {
    if (!rating) {
      setRatingErr(true)
      return
    }
    mutate(values)
  }

  useEffect(() => {
    setRatingErr(false)
  }, [rating])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-full space-y-8 rounded-md bg-background p-4'
      >
        <div className='flex flex-col'>
          <Rating value={rating} readOnly={isLoading} onChange={setRating} className={`w-32`} />
          {ratingErr && <div className='text-xs text-red-800'>Rating is required</div>}
        </div>

        <FormField
          control={form.control}
          name='comment'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea {...field} placeholder='Comment here...' disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {Object.keys(user).length !== 0 ? (
          <Button type='submit' disabled={isLoading}>
            Submit
          </Button>
        ) : (
          <Link to={'/auth'}>
            <Button type='button' className='mt-4'>
              Submit
            </Button>
          </Link>
        )}
      </form>
    </Form>
  )
}
