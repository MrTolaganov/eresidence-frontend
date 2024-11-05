import CustomMap from '@/components/shared/custom-map'
import FillLoading from '@/components/shared/fill-loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import $axios from '@/http/axios'
import { RootState } from '@/lib/store'
import { cn } from '@/lib/utils'
import { IHouse } from '@/types/house.type'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Rating } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import AllFeedbacksModal from '@/components/modals/all-feedbacks.model'
import { setFeedback } from '@/slices/feedback.slice'
import FeedbackForm from '@/components/forms/feedback.form'
import { setOpenEditHouseModal } from '@/slices/house-modal.slice'
import EditHouseModal from '@/components/modals/edit-house.modal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import $api from '@/http/api'
import { setHouses } from '@/slices/house.slice'
import { toast } from 'sonner'

export default function House() {
  const { user } = useSelector((state: RootState) => state.user)
  const { houses } = useSelector((state: RootState) => state.house)
  const { feedback } = useSelector((state: RootState) => state.feedback)
  const [house, setHouse] = useState<IHouse>({} as IHouse)
  const { houseId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading } = useQuery({
    queryKey: ['get-house'],
    queryFn: async () => {
      const { data } = await $axios.get(`/house/gethouse/${houseId}`)
      setHouse(data.house)
      return data
    },
  })

  const { isLoading: feedbackLoading } = useQuery({
    queryKey: ['get-feedbacks'],
    queryFn: async () => {
      const { data } = await $axios.get(`/feedback/house-fbs/${houseId}`)
      dispatch(setFeedback(data))
      return data
    },
  })

  const { isPending, mutate } = useMutation({
    mutationKey: ['delete-house'],
    mutationFn: async (houseId: string) => {
      const { data } = await $api.delete(`/house/delete/${houseId}`)
      return data
    },
    onSuccess: data => {
      dispatch(
        setHouses(
          houses
            .filter(h => h.id !== data.house.id)
            .slice()
            .reverse()
        )
      )
      toast.success('House deleted successfully')
      navigate('/')
    },
    onError: err => {
      // @ts-ignore
      toast.error(err.response.data.message)
    },
  })

  return (
    <div className='relative mt-[10vh] min-h-[90vh]'>
      {isLoading && <FillLoading />}
      <div className={`container py-8 ${cn(isLoading && 'h-[90vh]')}`}>
        <div className='grid grid-cols-1 max-md:gap-y-8 md:grid-cols-3 md:gap-8'>
          <div className='col-span-2 space-y-4'>
            <div className='flex items-center justify-between pb-4 '>
              <div className='text-2xl font-bold md:text-4xl'>{house.label}</div>
              <div className='text-xl font-semibold md:text-3xl'>${house.price} USD</div>
            </div>
            <img src={house.image} alt={house.label} className='w-full rounded-xl md:h-[72vh]' />
            <div className='py-4 text-xl md:text-2xl'>{house.body}</div>
          </div>
          <div
            className={`space-y-4 rounded-xl bg-secondary p-4 md:sticky md:top-24 ${cn(house.user && house.user._id === user.id ? 'h-[72vh]' : 'h-[65vh]')}`}
          >
            {house.user && (
              <div className='flex items-center gap-2'>
                <Avatar>
                  <AvatarImage src={house.user.image} />
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    {house.user.username.at(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='w-full space-y-1'>
                  <div className='flex items-center justify-between'>
                    <div>@{house.user.username}</div>
                    <div>{house.user.phone}</div>
                  </div>
                  <div className='text-muted-foreground'>{house.user.email}</div>
                </div>
              </div>
            )}
            <CustomMap location={+house.location} />
            {house.user && house.user._id === user.id ? (
              <div className='space-y-2'>
                <Button
                  size={'lg'}
                  className='w-full'
                  onClick={() => dispatch(setOpenEditHouseModal(true))}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={'lg'} className='w-full' variant={'destructive'}>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your house and
                        remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className='bg-red-500 hover:bg-red-700'
                        disabled={isPending}
                        onClick={() => mutate(houseId!)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              !isLoading && (
                <Button size={'lg'} className='w-full'>
                  Explore
                </Button>
              )
            )}
          </div>
        </div>
        {!feedbackLoading && Object.keys(feedback).length !== 0 && (
          <div className='my-8 grid grid-cols-1 rounded-xl bg-gradient-to-b from-secondary via-background to-secondary p-8 max-md:gap-y-8 md:grid-cols-3 md:gap-x-8'>
            <div className='flex flex-col items-center justify-between'>
              <div className='mx-auto flex  items-center gap-x-2'>
                <Rating
                  value={feedback.avgStarsValue ? feedback.avgStarsValue : 0}
                  readOnly
                  halfFillMode='svg'
                  className='size-28'
                />
                <div className='text-xl font-semibold'>
                  {feedback.avgStarsValue ? feedback.avgStarsValue.toFixed(1) : 0} of{' '}
                  {feedback.feedbacks.length} ratings
                </div>
              </div>
              <FeedbackForm houseId={houseId!} />
            </div>
            <div className='col-span-2 space-y-4 rounded-lg bg-background p-4'>
              <div>
                {feedback.feedbacks.length < 3 ? feedback.feedbacks.length : 3} comments of{' '}
                {feedback.feedbacks.length} comments
              </div>
              <div>
                {feedback.feedbacks
                  .slice(-3)
                  .reverse()
                  .map(({ _id, value, comment, user }) => (
                    <div
                      key={_id}
                      className='grid grid-cols-1 border-t border-muted-foreground py-2 max-md:gap-y-4 md:grid-cols-2'
                    >
                      <div className=''>
                        <Rating
                          value={value}
                          readOnly
                          halfFillMode='svg'
                          className='mt-[-32px] size-24'
                        />
                        <div className='z-50 mt-[-36px]'>{comment}</div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Avatar>
                          <AvatarImage src={user.image} />
                          <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                            {user.username.at(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='w-full space-y-1'>
                          <div className='flex items-center justify-between'>
                            <div>@{user.username}</div>
                            <div>{user.phone}</div>
                          </div>
                          <div className='text-muted-foreground'>{user.email}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                {feedback.feedbacks.length > 3 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={'link'}>View all</Button>
                    </DialogTrigger>
                    <AllFeedbacksModal feedbacks={feedback.feedbacks} />
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {Object.keys(house).length !== 0 && <EditHouseModal {...house} />}
    </div>
  )
}
