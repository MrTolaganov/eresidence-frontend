import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IHouseModal {
  openAddHouseModal: boolean
  openEditHouseModal: boolean
}

const initialState: IHouseModal = {
  openAddHouseModal: false,
  openEditHouseModal: false,
}

export const houseModalSlice = createSlice({
  name: 'houseModal',
  initialState,
  reducers: {
    setOpenAddHouseModal: (state, action: PayloadAction<boolean>) => {
      state.openAddHouseModal = action.payload
    },
    setOpenEditHouseModal: (state, action: PayloadAction<boolean>) => {
      state.openEditHouseModal = action.payload
    },
  },
})

export const { setOpenAddHouseModal, setOpenEditHouseModal } = houseModalSlice.actions
export default houseModalSlice.reducer
