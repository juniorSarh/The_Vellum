import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// ----------------------------
// Types
// ----------------------------
export interface Booking {
  booking_id?: number;
  customer_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string;
  status: string;
  additional_requests?: string;
  total_cost: number;
}

interface BookingState {
  bookings: Booking[];
  booking?: Booking;
  loading: boolean;
  error?: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

// ----------------------------
// Async Thunks
// ----------------------------

const API_URL = "http://localhost:4000/api/bookings"; // change to your backend URL

export const fetchBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data as Booking[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  "bookings/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data as Booking;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData: Booking, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, bookingData);
      return response.data as Booking;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  "bookings/update",
  async (
    { id, bookingData }: { id: number; bookingData: Partial<Booking> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, bookingData);
      return response.data as Booking;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return { id, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ----------------------------
// Slice
// ----------------------------
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    clearBookingError(state) {
      state.error = undefined;
    },
    clearBooking(state) {
      state.booking = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch all bookings
    builder.addCase(fetchBookings.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      fetchBookings.fulfilled,
      (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.bookings = action.payload;
      }
    );
    builder.addCase(
      fetchBookings.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );

    // Fetch by ID
    builder.addCase(fetchBookingById.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      fetchBookingById.fulfilled,
      (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.booking = action.payload;
      }
    );
    builder.addCase(
      fetchBookingById.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );

    // Create booking
    builder.addCase(createBooking.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      createBooking.fulfilled,
      (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.bookings.unshift(action.payload); // add new booking to the start
      }
    );
    builder.addCase(
      createBooking.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );

    // Update booking
    builder.addCase(updateBooking.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      updateBooking.fulfilled,
      (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.bookings = state.bookings.map((b) =>
          b.booking_id === action.payload.booking_id ? action.payload : b
        );
      }
    );
    builder.addCase(
      updateBooking.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );

    // Delete booking
    builder.addCase(deleteBooking.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      deleteBooking.fulfilled,
      (state, action: PayloadAction<{ id: number }>) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (b) => b.booking_id !== action.payload.id
        );
      }
    );
    builder.addCase(
      deleteBooking.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { clearBookingError, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
