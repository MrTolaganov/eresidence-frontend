import { IHouse } from '@/types/house.type'
import { Card } from '../ui/card'
import { Link } from 'react-router-dom'

export default function HouseCard(house: IHouse) {
  return (
    <Link to={`/house/${house.id}`}>
      <Card className='h-72 bg-secondary'>
        <img src={house.image} alt={house.label} className='h-60 w-full rounded-t-xl' />
        <div className='flex h-12 items-center justify-between px-4'>
          <div className='text-2xl font-semibold'>{house.label}</div>
          <div className='text-xl'>${house.price}</div>
        </div>
      </Card>
    </Link>
  )
}
