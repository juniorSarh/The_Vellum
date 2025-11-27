// src/storeSlices/bookingSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

// ----------------------------
// Types
// ----------------------------
export interface Booking {
  booking_id?: number;
  customer_id: number;
  room_id: number;
  check_in_date: string; // ISO string
  check_out_date: string; // ISO string
  status: string; // e.g. "pending", "confirmed", "cancelled"
  additional_requests?: string;
  total_cost: number;
}

interface BookingState {
  bookings: Booking[];
<<<<<<< HEAD
  booking: Booking | null;
=======
  booking?: Booking;
  pendingBooking?: Booking; 
>>>>>>> feat/details
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  booking: null,
  loading: false,
  error: null,
};

const API_URL = "http://localhost:4040/api/bookings";

// ----------------------------
// API
// ----------------------------
const API_URL = "http://localhost:4000/api/bookings";

// ----------------------------
// Async Thunks
// ----------------------------
<<<<<<< HEAD

// 1️⃣ Fetch all bookings
export const fetchBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>("bookings/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to fetch bookings");
=======
export const fetchBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data as Booking[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
>>>>>>> feat/details
    }

    return result as Booking[];
  } catch {
    return rejectWithValue("Failed to fetch bookings");
  }
});

// 2️⃣ Fetch booking by ID
export const fetchBookingById = createAsyncThunk<
  Booking,
  number,
  { rejectValue: string }
>("bookings/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to fetch booking");
    }

    return result as Booking;
  } catch {
    return rejectWithValue("Failed to fetch booking");
  }
});

// 3️⃣ Create booking
export const createBooking = createAsyncThunk<
  Booking,
  Omit<Booking, "booking_id">,
  { rejectValue: string }
>("bookings/create", async (bookingData, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to create booking");
    }

    return result as Booking;
  } catch {
    return rejectWithValue("Failed to create booking");
  }
});

// 4️⃣ Update booking
export const updateBooking = createAsyncThunk<
  Booking,
  { id: number; updates: Partial<Booking> },
  { rejectValue: string }
>("bookings/update", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to update booking");
    }

    return result as Booking;
  } catch {
    return rejectWithValue("Failed to update booking");
  }
});

// 5️⃣ Delete booking
export const deleteBooking = createAsyncThunk<
  number, // return deleted booking_id
  number, // argument: id
  { rejectValue: string }
>("bookings/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return rejectWithValue(result.error || "Failed to delete booking");
    }

    return id;
  } catch {
    return rejectWithValue("Failed to delete booking");
  }
});

// ----------------------------
// Slice
// ----------------------------
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = null;
    },
    clearBooking(state) {
      state.booking = null;
    },
    setBookings(state, action: PayloadAction<Booking[]>) {
      state.bookings = action.payload;
    },

    // STORE CHECKOUT BOOKING DETAILS
    setPendingBooking(state, action: PayloadAction<Booking>) {
      state.pendingBooking = action.payload;
    },

    //  PENDING AFTER PAYMENT OR CANCEL
    clearPendingBooking(state) {
      state.pendingBooking = undefined;
    },
  },

  extraReducers: (builder) => {
    // Fetch all
    builder.addCase(fetchBookings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchBookings.fulfilled,
      (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.bookings = action.payload;
      }
    );
    builder.addCase(fetchBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch bookings";
    });

    // Fetch by ID
    builder.addCase(fetchBookingById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchBookingById.fulfilled,
      (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.booking = action.payload;
      }
    );
    builder.addCase(fetchBookingById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch booking";
    });

    // Create
    builder.addCase(createBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createBooking.fulfilled,
      (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
<<<<<<< HEAD
=======
        state.pendingBooking = undefined; // clear after payment
      }
    );
    builder.addCase(
      createBooking.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
>>>>>>> feat/details
      }
    );
    builder.addCase(createBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to create booking";
    });

    // Update
    builder.addCase(updateBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateBooking.fulfilled,
      (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.bookings = state.bookings.map((b) =>
          b.booking_id === action.payload.booking_id ? action.payload : b
        );
        if (
          state.booking &&
          state.booking.booking_id === action.payload.booking_id
        ) {
          state.booking = action.payload;
        }
      }
    );
    builder.addCase(updateBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update booking";
    });

    // Delete
    builder.addCase(deleteBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteBooking.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (b) => b.booking_id !== action.payload
        );
        if (state.booking && state.booking.booking_id === action.payload) {
          state.booking = null;
        }
      }
    );
    builder.addCase(deleteBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete booking";
    });
  },
});

<<<<<<< HEAD
export const { clearBookingError, clearBooking, setBookings } =
  bookingSlice.actions;
=======
export const {
  clearBookingError,
  clearBooking,
  setPendingBooking,
  clearPendingBooking,
} = bookingSlice.actions;
>>>>>>> feat/details

export default bookingSlice.reducer;
