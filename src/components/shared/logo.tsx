import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link to={'/'}>
      <span className='text-3xl font-bold text-primary md:text-4xl'>Eresidence</span>
    </Link>
  )
}
