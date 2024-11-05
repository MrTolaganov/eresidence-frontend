import { RootState } from '@/lib/store'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function DashboardRoute() {
  const { user } = useSelector((state: RootState) => state.user)

  return user.isAdmin ? <Outlet /> : <Navigate to={'/'} />
}
