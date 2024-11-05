import { IFeedbackDocument } from '@/types/feedback.type'
import { DialogContent, DialogDescription, DialogTitle } from '../ui/dialog'
import { Rating } from '@smastrom/react-rating'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function AllFeedbacksModal({ feedbacks }: { feedbacks: IFeedbackDocument[] }) {
  return (
    <DialogContent>
      <DialogTitle>All comments</DialogTitle>
      <DialogDescription className='custom-scrollbar max-h-[50vh] overflow-x-hidden overflow-y-scroll'>
        {feedbacks
          .slice()
          .reverse()
          .map(({ _id, value, comment, user }) => (
            <div
              key={_id}
              className='grid grid-cols-1 border-t border-muted-foreground py-2 max-md:gap-y-4 md:grid-cols-2'
            >
              <div className=''>
                <Rating value={value} readOnly halfFillMode='svg' className='mt-[-32px] size-24' />
                <div className='z-50 mt-[-36px] text-black dark:text-white'>{comment}</div>
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
      </DialogDescription>
    </DialogContent>
  )
}
