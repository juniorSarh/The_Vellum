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
  hotel_id?: number; // from backend

  check_in_date: string; // ISO strings from backend
  check_out_date: string;

  status: string;
  additional_requests?: string | null;

  // PG numeric usually comes back as a string; allow both
  total_cost: number | string;

  // Joined fields from backend (BookingWithDetails)
  customer_first_name?: string;
  customer_last_name?: string;
  hotel_name?: string;
  room_type?: string;
}

interface BookingState {
  bookings: Booking[];
  booking: Booking | null;
  // used for Paystack flow (data to create booking after successful payment)
  pendingBooking: Omit<
    Booking,
    | "booking_id"
    | "hotel_id"
    | "customer_first_name"
    | "customer_last_name"
    | "hotel_name"
    | "room_type"
  > | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  booking: null,
  pendingBooking: null,
  loading: false,
  error: null,
};

const API_URL = "http://localhost:4040/api/bookings";

// ----------------------------
// Async Thunks (fetch-based)
// ----------------------------

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
      console.error("Fetch bookings failed:", response.status, result);
      return rejectWithValue(result.error || "Failed to fetch bookings");
    }

    return result as Booking[];
  } catch (err) {
    console.error("Fetch bookings error:", err);
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
      console.error("Fetch booking by ID failed:", response.status, result);
      return rejectWithValue(result.error || "Failed to fetch booking");
    }

    return result as Booking;
  } catch (err) {
    console.error("Fetch booking by ID error:", err);
    return rejectWithValue("Failed to fetch booking");
  }
});

// 3️⃣ Create booking (called AFTER Paystack success)
export const createBooking = createAsyncThunk<
  Booking,
  Omit<
    Booking,
    | "booking_id"
    | "hotel_id"
    | "customer_first_name"
    | "customer_last_name"
    | "hotel_name"
    | "room_type"
  >,
  { rejectValue: string }
>("bookings/create", async (bookingData, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    let result: any = {};
    try {
      result = await response.json();
    } catch {
      result = {};
    }

    if (!response.ok) {
      console.error("Create booking failed:", response.status, result);
      return rejectWithValue(result.error || "Failed to create booking");
    }

    console.log("Create booking success:", result);
    return result as Booking;
  } catch (err) {
    console.error("Create booking network error:", err);
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
      console.error("Update booking failed:", response.status, result);
      return rejectWithValue(result.error || "Failed to update booking");
    }

    return result as Booking;
  } catch (err) {
    console.error("Update booking error:", err);
    return rejectWithValue("Failed to update booking");
  }
});

// 5️⃣ Delete booking
export const deleteBooking = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("bookings/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      console.error("Delete booking failed:", response.status, result);
      return rejectWithValue(result.error || "Failed to delete booking");
    }

    return id;
  } catch (err) {
    console.error("Delete booking error:", err);
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

    // Store booking payload while user is on payment gateway
    setPendingBooking(
      state,
      action: PayloadAction<
        Omit<
          Booking,
          | "booking_id"
          | "hotel_id"
          | "customer_first_name"
          | "customer_last_name"
          | "hotel_name"
          | "room_type"
        >
      >
    ) {
      state.pendingBooking = action.payload;
    },

    clearPendingBooking(state) {
      state.pendingBooking = null;
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
        console.log(action.payload);
      }
    );
    builder.addCase(fetchBookings.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to fetch bookings";
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
      state.error = (action.payload as string) || "Failed to fetch booking";
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
        state.pendingBooking = null;
      }
    );
    builder.addCase(createBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to create booking";
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
      state.error = (action.payload as string) || "Failed to update booking";
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
      state.error = (action.payload as string) || "Failed to delete booking";
    });
  },
});

export const {
  clearBookingError,
  clearBooking,
  setBookings,
  setPendingBooking,
  clearPendingBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
