import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IAuth {
  isLoading: boolean
  authState: 'signin' | 'signup' | 'forgot-pass'
  passState: 'hide' | 'show'
}

const initialState: IAuth = {
  isLoading: false,
  authState: 'signin',
  passState: 'hide',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setAuthState: (state, action: PayloadAction<'signin' | 'signup' | 'forgot-pass'>) => {
      state.authState = action.payload
    },
    setPassState: (state, action: PayloadAction<'hide' | 'show'>) => {
      state.passState = action.payload
    },
  },
})

export const { setAuthState, setPassState, setIsLoading } = authSlice.actions
export default authSlice.reducer
