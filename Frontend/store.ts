import { configureStore } from "@reduxjs/toolkit";
import customerReducer from "./src/storeSlices/customerSlice";
import adminReducer from "./src/storeSlices/adminSlice";
import hotelReducer from "./src/storeSlices/hotelSlice";
import roomReducer from "./src/storeSlices/roomSlice";

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    admin : adminReducer,
    hotel: hotelReducer,
    room: roomReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
