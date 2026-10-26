import { configureStore } from '@reduxjs/toolkit'
import registerReducer  from './src/redux/registerSlice'
import loginReducer from './src/redux/LoginSlice'
import hotelReducer from './src/redux/HotelSlice'
import imageReducer from './src/redux/ImageSlice'
import roomReducer from './src/redux/RoomSlice'
import bookingReducer from './src/redux/BookingSlice'



export const store = configureStore({
  reducer: { 
    signUp: registerReducer,
    signIn: loginReducer,
    hotels: hotelReducer,
    images:imageReducer,
    rooms: roomReducer,
    bookings: bookingReducer,
   
}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch