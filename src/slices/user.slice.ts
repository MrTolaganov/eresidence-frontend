import { IUser } from '@/types/user.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  loading: boolean
  user: IUser
  error: string
}

const initialState: User = {
  loading: false,
  user: {} as IUser,
  error: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
})

export const { setLoading, setUser, setError } = userSlice.actions
export default userSlice.reducer
