import HouseCard from '@/components/cards/house.card'
import Nothing from '@/components/shared/nothing'
import HouseSkeleton from '@/components/skeletons/house.skeleton'
import $axios from '@/http/axios'
import { RootState } from '@/lib/store'
import { setHouses } from '@/slices/house.slice'
import { IHouse } from '@/types/house.type'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const { houses } = useSelector((state: RootState) => state.house)
  const { user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading } = useQuery({
    queryKey: ['get-houses'],
    queryFn: async () => {
      const { data } = await $axios.get('/house/gethouses')
      dispatch(setHouses(data.houses as IHouse[]))
      return houses
    },
  })

  if (Object.keys(user).length && !user.activated && localStorage.getItem('accessToken')) {
    navigate(`/activate/${user.id}`)
    return null
  }

  return (
    <div className='relative mt-[10vh] min-h-[90vh]'>
      <div className='container grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && Array.from({ length: 12 }).map((_, idx) => <HouseSkeleton key={idx} />)}
        {houses.length !== 0 &&
          houses
            .slice()
            .reverse()
            .map(house => <HouseCard {...house} />)}
      </div>
      {!isLoading && houses.length === 0 && <Nothing />}
    </div>
  )
}
