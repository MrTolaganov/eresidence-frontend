import { IHouse } from '@/types/house.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface House {
  isLoading: boolean
  houses: IHouse[]
  myHouses: IHouse[]
  error: string
}

const initialState: House = {
  isLoading: false,
  houses: [] as IHouse[],
  myHouses: [] as IHouse[],
  error: '',
}

export const houseSlice = createSlice({
  name: 'house',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setHouses: (state, action: PayloadAction<IHouse[]>) => {
      state.houses = action.payload
    },
    setMyHouses: (state, action: PayloadAction<IHouse[]>) => {
      state.myHouses = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },
  },
})

export const { setIsLoading, setHouses, setMyHouses, setError } = houseSlice.actions
export default houseSlice.reducer
