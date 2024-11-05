import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { Input } from '../ui/input'
import { Search } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { setOpenSheet } from '@/slices/mobile.slice'
import { useEffect, useState } from 'react'
import { setHouses } from '@/slices/house.slice'
import { IHouse } from '@/types/house.type'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import $axios from '@/http/axios'

export default function Mobile() {
  const { openSheet } = useSelector((state: RootState) => state.mobile)
  const [allHouses, setAllHouses] = useState<IHouse[]>([])
  const [searchVal, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useQuery({
    queryKey: ['get-all-mobile-houses'],
    queryFn: async () => {
      const { data } = await $axios.get('/house/gethouses')
      setAllHouses(data.houses as IHouse[])
      return data
    },
  })

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
  }, [searchVal.trim().length])

  return (
    <Sheet open={openSheet} onOpenChange={() => dispatch(setOpenSheet(false))}>
      <SheetContent side={'top'}>
        <SheetHeader>
          <SheetTitle className='text-start text-2xl'>Search houses that you need</SheetTitle>
        </SheetHeader>
        <SheetDescription className='mt-4 flex flex-col gap-4'>
          <span className='flex items-center'>
            <Input
              placeholder='Search...'
              className='rounded-full bg-secondary'
              value={searchVal}
              onChange={e => setSearchValue(e.target.value)}
            />
            <Search className='ml-[-32px] cursor-pointer' />
          </span>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  )
}
