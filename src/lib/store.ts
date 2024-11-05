import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/slices/auth.slice'
import authModalReducer from '@/slices/auth-modal.slice'
import mobileReducer from '@/slices/mobile.slice'
import userReducer from '@/slices/user.slice'
import houseModalReducer from '@/slices/house-modal.slice'
import houseReducer from '@/slices/house.slice'
import feedbackReduer from '@/slices/feedback.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authModal: authModalReducer,
    mobile: mobileReducer,
    user: userReducer,
    house: houseReducer,
    houseModal: houseModalReducer,
    feedback: feedbackReduer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
