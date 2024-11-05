import HouseCard from '@/components/cards/house.card'
import AddHouseModal from '@/components/modals/add-house.modal'
import Nothing from '@/components/shared/nothing'
import HouseSkeleton from '@/components/skeletons/house.skeleton'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { RootState } from '@/lib/store'
import { setOpenAddHouseModal } from '@/slices/house-modal.slice'
import { setMyHouses } from '@/slices/house.slice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

export default function MyHouses() {
  const { user } = useSelector((state: RootState) => state.user)
  const { houses, myHouses } = useSelector((state: RootState) => state.house)
  const [isLoading, setIsLoading] = useState(true)
  const { userId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      navigate('/')
    } else {
      dispatch(
        setMyHouses(
          houses
            .filter(house => house.user._id === userId)
            .slice()
            .reverse()
        )
      )
    }
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(user).length])

  return (
    <div className='relative mt-[10vh] min-h-[90vh]'>
      <div className='container grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading && Array.from({ length: 12 }).map((_, idx) => <HouseSkeleton key={idx} />)}
        {myHouses.length !== 0 &&
          myHouses
            .slice()
            .reverse()
            .map(myHouse => <HouseCard {...myHouse} />)}
      </div>
      <AddHouseModal />
      {isLoading ? (
        <Skeleton className='fixed bottom-8 right-8 size-12 rounded-full bg-secondary' />
      ) : (
        <Button
          className='fixed bottom-8 right-8 size-12 rounded-full'
          onClick={() => dispatch(setOpenAddHouseModal(true))}
        >
          <span className='mt-[-4px] text-3xl font-bold'>+</span>
        </Button>
      )}
      {!isLoading && myHouses.length === 0 && Object.keys(user).length !== 0 && <Nothing />}
    </div>
  )
}
