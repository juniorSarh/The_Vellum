// src/storeSlices/hotelSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

// -------------------- Types --------------------
export interface Hotel {
  hotel_id?: number;
  admin_id?: number | null;
  name: string;
  location: string;
  star_rating?: number | null;
  description?: string | null;
  images?: string[] | null;
}

interface HotelState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
}

const initialState: HotelState = {
  hotels: [],
  loading: false,
  error: null,
};

// Base URL (match your backend port / path)
const BASE_URL = "http://localhost:4040/api/hotels";

// ==============================================================
// 1️⃣ ADD HOTEL  (adhotel)
// ==============================================================
export const addhotel = createAsyncThunk<
  Hotel, // return type
  Omit<Hotel, "hotel_id">, // argument type
  { rejectValue: string }
>("hotels/adhotel", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // If your backend returns { success, data }, use this:
    // if (!result.success) return rejectWithValue(result.error || "Failed to add hotel");
    // return result.data as Hotel;

    // With the current controller we wrote, it returns the Hotel directly:
    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to add hotel");
    }

    return result as Hotel;
  } catch {
    return rejectWithValue("Failed to add hotel");
  }
});

// ==============================================================
// 2️⃣ UPDATE HOTEL  (updatehotel)
// ==============================================================
export const updatehotel = createAsyncThunk<
  Hotel,
  { id: number; updates: Partial<Hotel> },
  { rejectValue: string }
>("hotels/updatehotel", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT", // matches your backend router.put("/:id", ...)
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json();

    // If backend wraps:
    // if (!result.success) return rejectWithValue(result.error || "Failed to update hotel");
    // return result.data as Hotel;

    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to update hotel");
    }

    return result as Hotel;
  } catch {
    return rejectWithValue("Failed to update hotel");
  }
});

// ==============================================================
// 3️⃣ DELETE HOTEL  (deletehotel)
// ==============================================================
export const deletehotel = createAsyncThunk<
  number, // return deleted hotel_id
  number, // argument: id
  { rejectValue: string }
>("hotels/deletehotel", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return rejectWithValue(result.error || "Failed to delete hotel");
    }

    return id;
  } catch {
    return rejectWithValue("Failed to delete hotel");
  }
});

// ==============================================================
// SLICE
// ==============================================================
const hotelSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    clearHotelError(state) {
      state.error = null;
    },
    // optional: setHotels if you later add a "fetchHotels" thunk
    setHotels(state, action: PayloadAction<Hotel[]>) {
      state.hotels = action.payload;
    },
  },
  extraReducers: (builder) => {
    // -------- ADD HOTEL --------
    builder.addCase(addhotel.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addhotel.fulfilled,
      (state, action: PayloadAction<Hotel>) => {
        state.loading = false;
        state.hotels.push(action.payload);
      }
    );
    builder.addCase(addhotel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add hotel";
    });

    // -------- UPDATE HOTEL --------
    builder.addCase(updatehotel.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updatehotel.fulfilled,
      (state, action: PayloadAction<Hotel>) => {
        state.loading = false;
        const index = state.hotels.findIndex(
          (h) => h.hotel_id === action.payload.hotel_id
        );
        if (index !== -1) {
          state.hotels[index] = action.payload;
        }
      }
    );
    builder.addCase(updatehotel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update hotel";
    });

    // -------- DELETE HOTEL --------
    builder.addCase(deletehotel.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deletehotel.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.hotels = state.hotels.filter(
          (hotel) => hotel.hotel_id !== action.payload
        );
      }
    );
    builder.addCase(deletehotel.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete hotel";
    });
  },
});

export const { clearHotelError, setHotels } = hotelSlice.actions;
export default hotelSlice.reducer;
