import { configureStore } from '@reduxjs/toolkit'
import registerReducer  from './src/redux/registerSlice'
import loginReducer from './src/redux/LoginSlice'
import hotelReducer from './src/redux/HotelSlice'
import imageReducer from './src/redux/ImageSlice'
import roomReducer from './src/redux/RoomSlice'
import bookingReducer from './src/redux/BookingSlice'
import profileReducer from './src/redux/ProfileSlice'
import PaymentReducer  from './src/redux/PaymentSlice'
import FavourateReducer from './src/redux/FavourateSlice'
import ReviewReducer from './src/redux/ReviewSlice'
import userReducer from './src/redux/UserSlice'



export const store = configureStore({
  reducer: { 
    signUp: registerReducer,
    signIn: loginReducer,
    hotels: hotelReducer,
    images:imageReducer,
    rooms: roomReducer,
    bookings: bookingReducer,
    profile: profileReducer,
    payments: PaymentReducer,
    favourates: FavourateReducer,
    reviews: ReviewReducer,
    users: userReducer,
}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch