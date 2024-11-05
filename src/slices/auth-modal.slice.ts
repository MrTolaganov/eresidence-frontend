import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAuthModal {
  openSigninModal: boolean
  openSignupModal: boolean
  openForgotPassModal: boolean
}

const initialState: IAuthModal = {
  openSigninModal: false,
  openSignupModal: false,
  openForgotPassModal: false,
}

export const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    setOpenSigninModal: (state, action: PayloadAction<boolean>) => {
      state.openSigninModal = action.payload
    },
    setOpenSignupModal: (state, action: PayloadAction<boolean>) => {
      state.openSignupModal = action.payload
    },
    setOpenForgotPassModal: (state, action: PayloadAction<boolean>) => {
      state.openForgotPassModal = action.payload
    },
  },
})

export const { setOpenSigninModal, setOpenSignupModal, setOpenForgotPassModal } =
  authModalSlice.actions
export default authModalSlice.reducer
