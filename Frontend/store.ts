import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./src/storeSlices/customerSlice";
import adminReducer from "./src/storeSlices/adminSlice";
import hotelReducer from "./src/storeSlices/hotelSlice";
import roomReducer from "./src/storeSlices/roomSlice";
import bookingSLice from "./src/storeSlices/bookingSlice";
import paymentSlice from "./src/storeSlices/paymentSlice";

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    admin : adminReducer,
    hotel: hotelReducer,
    payment: paymentSlice,
    room: roomReducer,
    Booking: bookingSLice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
