import ForgotPassModal from '@/components/modals/forgot-pass.modal'
import SigninModal from '@/components/modals/signin.modal'
import SignupModal from '@/components/modals/signup.modal'
import { RootState } from '@/lib/store'
import {
  setOpenForgotPassModal,
  setOpenSigninModal,
  setOpenSignupModal,
} from '@/slices/auth-modal.slice'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'

export default function Auth() {
  const { authState } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  useQuery({
    queryKey: ['auth-state'],
    queryFn: () => {
      authState === 'signin' && dispatch(setOpenSigninModal(true))
      authState === 'signup' && dispatch(setOpenSignupModal(true))
      authState === 'forgot-pass' && dispatch(setOpenForgotPassModal(true))
      return authState
    },
  })

  return (
    <div className='flex h-screen items-center justify-center'>
      {authState === 'signin' && <SigninModal />}
      {authState === 'signup' && <SignupModal />}
      {authState === 'forgot-pass' && <ForgotPassModal />}
    </div>
  )
}
