import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Favourite {
  favourite_id: number;
  customer_id: number;
  hotel_id: number;
  created_at: string;
  hotel_name?: string;
  location?: string;
  star_rating?: number;
  description?: string;
  images?: string[];
  customer_email?: string;
}

interface FavouritesState {
  list: Favourite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouritesState = {
  list: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchUserFavourites = createAsyncThunk(
  "favourites/fetchUserFavourites",
  async (customer_id: number, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/favourites/customers/${customer_id}`);
      return res.data as Favourite[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const fetchAllFavourites = createAsyncThunk(
  "favourites/fetchAllFavourites",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/favourites");
      return res.data as Favourite[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const removeFavourite = createAsyncThunk(
  "favourites/removeFavourite",
  async (
    { customer_id, hotel_id }: { customer_id: number; hotel_id: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.delete("/api/favourites", {
        data: { customer_id, hotel_id },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    clearFavourites: (state) => {
      state.list = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUserFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserFavourites.fulfilled,
        (state, action: PayloadAction<Favourite[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchUserFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch All
      .addCase(fetchAllFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllFavourites.fulfilled,
        (state, action: PayloadAction<Favourite[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchAllFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove Favourite
      .addCase(removeFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.loading = false;
        if ("favourite_id" in action.payload) {
          state.list = state.list.filter(
            (f) => f.favourite_id !== action.payload.favourite_id
          );
        }
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
