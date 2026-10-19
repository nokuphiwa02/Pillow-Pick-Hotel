import { configureStore } from '@reduxjs/toolkit'
import registerReducer  from './src/redux/registerSlice'
import loginReducer from './src/redux/LoginSlice'
import hotelReducer from './src/redux/HotelSlice'



export const store = configureStore({
  reducer: { 
    signUp: registerReducer,
    signIn: loginReducer,
    hotels: hotelReducer

   
}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch