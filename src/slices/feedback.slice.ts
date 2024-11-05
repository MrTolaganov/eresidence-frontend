import { IFeedback } from '@/types/feedback.type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FeedbackSlice {
  feedback: IFeedback
}

const initialState: FeedbackSlice = {
  feedback: {} as IFeedback,
}

export const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedback(state, action: PayloadAction<IFeedback>) {
      state.feedback = action.payload
    },
  },
})

export const { setFeedback } = feedbackSlice.actions
export default feedbackSlice.reducer
