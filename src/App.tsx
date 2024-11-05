import { Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './components/providers/theme.provider'
import Auth from './pages/auth.page'
import Home from './pages/home.page'
import Navbar from './components/shared/navbar'
import { Toaster } from 'sonner'
import Activate from './pages/activate.page'
import RecAcc from './pages/rec-acc.page'
import $axios from './http/axios'
import { setUser } from './slices/user.slice'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './lib/store'
import { useEffect } from 'react'
import { setIsLoading } from './slices/auth.slice'
import House from './pages/house.page'
import Footer from './components/shared/footer'
import MyHouses from './pages/my-houses.page'
import Dashboard from './pages/dashboard.page'
import DashboardRoute from './private-routes/dashboard.route'
import Nothing from './components/shared/nothing'

export default function App() {
  const { user } = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch(setIsLoading(true))
        const { data } = await $axios.get('/auth/refresh')
        dispatch(setUser(data.user))
        localStorage.setItem('accessToken', data.accessToken)
      } catch {
        localStorage.removeItem('accessToken')
      } finally {
        dispatch(setIsLoading(false))
      }
    }
    if (localStorage.getItem('accessToken')) {
      checkAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log(user)

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/rec-acc/:token' element={<RecAcc />} />
        <Route path='/house/:houseId' element={<House />} />
        <Route path='/my-houses/:userId' element={<MyHouses />} />
        <Route path='/activate/:userId' element={<Activate />} />
        <Route element={<DashboardRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
        </Route>
        <Route
          path='*'
          element={
            <div className='mt-[10vh] h-[90vh]'>
              <Nothing />
            </div>
          }
        />
      </Routes>
      <Footer />
      <Toaster position='bottom-center' />
    </ThemeProvider>
  )
}
