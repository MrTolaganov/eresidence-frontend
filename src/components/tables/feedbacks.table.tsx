import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useEffect, useState } from 'react'
import $api from '@/http/api'
import { Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Label } from '../ui/label'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import Nothing from '../shared/nothing'
import { IFeedbackDocument } from '@/types/feedback.type'
import { Rating } from '@smastrom/react-rating'
import { toast } from 'sonner'

export default function FeedbacksTable() {
  const [feedbacks, setFeedbacks] = useState<IFeedbackDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const onDelete = async (feedbackId: string) => {
    try {
      const confirmed = confirm('Are you sure to delete this feedback')
      if (!confirmed) return
      setIsLoading(true)
      await $api.delete(`/feedback/delete/${feedbackId}`)
      setFeedbacks(feedbacks => feedbacks.filter(feedback => feedback.id !== feedbackId))
      toast.success('Feedback deleted successfully')
    } catch (err) {
      // @ts-ignore
      toast.error(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getAllFeedbacks = async () => {
      const { data } = await $api.get('/feedback/all-fbs')
      setFeedbacks(data.feedbacks)
      setIsLoading(false)
    }
    getAllFeedbacks()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>House</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Loader2 className='mx-auto size-12 animate-spin py-2 text-primary' />
            </TableCell>
          </TableRow>
        ) : feedbacks.length > 0 ? (
          feedbacks.map(({ id, comment, updatedAt, value, house, user }, idx) => (
            <TableRow key={id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{comment}</TableCell>
              <TableCell>{format(updatedAt, 'dd/MM/yyyy')}</TableCell>
              <TableCell>
                <Rating value={value} readOnly halfFillMode='svg' className='w-16' />
              </TableCell>
              <TableCell>{house.label}</TableCell>
              <TableCell className='flex h-full items-center gap-x-2'>
                <Avatar>
                  <AvatarImage src={user.image} />
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    {user.username.at(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Label>@{user.username}</Label>
              </TableCell>
              <TableCell>
                <Button
                  variant={'outline'}
                  className='border-red-500 text-red-500 hover:bg-red-500'
                  size={'sm'}
                  onClick={() => onDelete(id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7}>
              <Nothing />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
