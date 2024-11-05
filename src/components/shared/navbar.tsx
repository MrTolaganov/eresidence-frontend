import { Button } from '../ui/button'
import Logo from './logo'
import ModeToggle from './mode-toggle'
import { LogIn, Search } from 'lucide-react'
import Mobile from './mobile'
import { Input } from '../ui/input'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setOpenSigninModal } from '@/slices/auth-modal.slice'
import { setOpenSheet } from '@/slices/mobile.slice'
import { RootState } from '@/lib/store'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Skeleton } from '../ui/skeleton'
import { setLoading, setUser } from '@/slices/user.slice'
import $api from '@/http/api'
import { toast } from 'sonner'
import { IUser } from '@/types/user.type'
import { useEffect, useState } from 'react'
import { setHouses } from '@/slices/house.slice'
import { IHouse } from '@/types/house.type'
import { useQuery } from '@tanstack/react-query'
import $axios from '@/http/axios'
import { Dialog, DialogTrigger } from '../ui/dialog'
import EditProfileModal from '../modals/edit-profile.modal'

export default function Navbar() {
  const { isLoading } = useSelector((state: RootState) => state.auth)
  const { user, loading } = useSelector((state: RootState) => state.user)
  const [allHouses, setAllHouses] = useState<IHouse[]>([])
  const [searchVal, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useQuery({
    queryKey: ['get-allhouses'],
    queryFn: async () => {
      const { data } = await $axios.get('/house/gethouses')
      setAllHouses(data.houses as IHouse[])
      return data
    },
  })

  const onSignout = async () => {
    try {
      dispatch(setLoading(true))
      await $api.delete('/auth/signout')
      dispatch(setUser({} as IUser))
      localStorage.removeItem('accessToken')
      dispatch(setLoading(false))
      navigate('/auth')
      dispatch(setOpenSigninModal(true))
    } catch (err) {
      // @ts-ignore
      toast.error(err.response.data.message)
    }
  }

  useEffect(() => {
    if (searchVal.trim()) {
      navigate('/')
      dispatch(
        setHouses(
          allHouses.filter(house => house.label.toLowerCase().includes(searchVal.toLowerCase()))
        )
      )
    } else {
      dispatch(setHouses(allHouses))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal.trim()])

  return (
    <div className='fixed inset-0 z-50  h-[10vh]  bg-background'>
      <div className='container flex h-full items-center justify-between  border-b border-muted-foreground'>
        <Logo />
        <span className='hidden w-1/3 items-center md:flex'>
          <Input
            placeholder='Search...'
            className='rounded-full bg-secondary'
            value={searchVal}
            onChange={e => setSearchValue(e.target.value)}
          />
          <Search className='ml-[-32px] cursor-pointer' />
        </span>
        <div className='flex items-center max-md:space-x-4 md:gap-4'>
          <Button
            variant={'ghost'}
            size={'icon'}
            className='md:hidden'
            asChild
            onClick={() => dispatch(setOpenSheet(true))}
          >
            <Search className='size-6' />
          </Button>
          <ModeToggle />
          {isLoading ? (
            <Skeleton className='size-10 rounded-full bg-secondary' />
          ) : Object.keys(user).length ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.image} />
                  <AvatarFallback className='bg-primary text-xl font-bold text-white'>
                    {user.username.at(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>@{user.username}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{user.phone}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className='cursor-pointer'>
                  <Link to={`/my-houses/${user.id}`}>My apartments</Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className='cursor-pointer text-primary'>
                      <Link to={`/dashboard`}>Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Dialog>
                    <DialogTrigger className='w-full p-2 text-start text-sm hover:bg-secondary'>
                      Edit profile
                    </DialogTrigger>
                    <EditProfileModal {...user} />
                  </Dialog>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='text-red-500' disabled={loading} onClick={onSignout}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                size={'lg'}
                asChild
                onClick={() => dispatch(setOpenSigninModal(true))}
                className='max-md:hidden'
              >
                <Link to={'/auth'}>Sign in</Link>
              </Button>
              <Link to={'/auth'} className='hover:bg-secondary md:hidden'>
                <LogIn className='size-7 text-primary' />
              </Link>
            </>
          )}
        </div>
      </div>
      <Mobile />
    </div>
  )
}
