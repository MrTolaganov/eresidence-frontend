import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IMobile {
  openSheet: boolean
}

const initialState: IMobile = {
  openSheet: false,
}

export const mobileSlice = createSlice({
  name: 'mobile',
  initialState,
  reducers: {
    setOpenSheet: (state, action: PayloadAction<boolean>) => {
      state.openSheet = action.payload
    },
  },
})

export const { setOpenSheet } = mobileSlice.actions
export default mobileSlice.reducer
