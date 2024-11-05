import { Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import $axios from '@/http/axios'
import { useEffect, useState } from 'react'
import { IHouse } from '@/types/house.type'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Label } from '../ui/label'
import Nothing from '../shared/nothing'
import $api from '@/http/api'
import { toast } from 'sonner'

export default function HousesTable() {
  const [houses, setHouses] = useState<IHouse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const onDelete = async (houseId: string) => {
    try {
      const confirmed = confirm('Are you sure to delete this house')
      if (!confirmed) return
      setIsLoading(true)
      await $api.delete(`/house/remove/${houseId}`)
      setHouses(houses => houses.filter(house => house.id !== houseId))
      toast.success('House deleted successfully')
    } catch (err) {
      // @ts-ignore
      toast.error(err.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getAllUsers = async () => {
      const { data } = await $axios.get('/house/gethouses')
      setHouses(data.houses)
      setIsLoading(false)
    }
    getAllUsers()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Price</TableHead>
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
        ) : houses.length > 0 ? (
          houses.map(({ id, label, image, createdAt, price, user }, idx) => (
            <TableRow key={id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{label}</TableCell>
              <TableCell>
                <img src={image} alt={label} width={64} />
              </TableCell>
              <TableCell>{format(createdAt, 'dd/MM/yyyy')}</TableCell>
              <TableCell>${price}</TableCell>
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
