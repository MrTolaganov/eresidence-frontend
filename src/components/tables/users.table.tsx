import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useEffect, useState } from 'react'
import { IUser } from '@/types/user.type'
import $api from '@/http/api'
import { CheckCheck, Loader2, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Label } from '../ui/label'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import Nothing from '../shared/nothing'
import $axios from '@/http/axios'
import { toast } from 'sonner'

export default function UsersTable() {
  const [users, setUsers] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const onApproveAndDisapprove = async (userId: string, isAdmin: boolean) => {
    try {
      setIsLoading(true)
      const { data } = await $axios.put(`/auth/update/${userId}`, { isAdmin: !isAdmin })
      setUsers(users => users.map(user => (user.id === userId ? data.user : user)))
      toast.success(
        isAdmin
          ? 'Admin role changed to user role successfully'
          : 'User role changed to admin role successfully'
      )
    } catch (err) {
      // @ts-ignore
      toast.error(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async (userId: string) => {
    try {
      const confirmed = confirm('Are you sure to delete this user')
      if (!confirmed) return
      setIsLoading(true)
      await $api.delete(`/auth/delete/${userId}`)
      setUsers(users => users.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
    } catch (err) {
      // @ts-ignore
      toast.error(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await $api.get('/auth/getusers')
      setUsers(data.users)
      setIsLoading(false)
    }
    getAllUsers()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Isadmin</TableHead>
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
        ) : users.length > 0 ? (
          users.map(({ id, username, image, createdAt, email, phone, isAdmin }, idx) => (
            <TableRow key={id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell className='flex items-center gap-x-2'>
                <Avatar>
                  <AvatarImage src={image} />
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    {username.at(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Label>@{username}</Label>
              </TableCell>
              <TableCell>{format(createdAt, 'dd/MM/yyyy')}</TableCell>
              <TableCell>{email}</TableCell>
              <TableCell>{phone}</TableCell>
              <TableCell>
                {isAdmin ? (
                  <CheckCheck className='text-green-500' />
                ) : (
                  <X className='text-red-500' />
                )}
              </TableCell>
              <TableCell className='flex items-center gap-x-2'>
                <Button
                  variant={'outline'}
                  size={'sm'}
                  className={cn(
                    isAdmin
                      ? 'border-red-500 hover:bg-red-500 text-red-500'
                      : 'border-green-500 hover:bg-green-500 text-green-500'
                  )}
                  onClick={() => onApproveAndDisapprove(id, isAdmin)}
                >
                  {isAdmin ? 'Disapprove' : 'Approve'}
                </Button>
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
