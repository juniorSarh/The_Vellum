import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Favourite {
  favourite_id: number;
  customer_id: number;
  hotel_id: number;
  created_at: string;
  hotel_name?: string;
  location?: string;
  images?: string[];
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

// Fetch favourites for a customer
export const fetchUserFavourites = createAsyncThunk(
  "favourites/fetchUserFavourites",
  async (customer_id: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://the-vellum.onrender.com/api/favourites/customers/${customer_id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch favourites");
      return data as Favourite[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Add a favourite
export const addToFavourites = createAsyncThunk(
  "favourites/addToFavourites",
  async (
    { customer_id, hotel_id }: { customer_id: number; hotel_id: number },
    { rejectWithValue }
  ) => {
    try {
        console.log("Adding to favourites:", { customer_id, hotel_id });
      const res = await fetch("https://the-vellum.onrender.com/api/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id, hotel_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add favourite");
      return data as Favourite;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Remove a favourite
export const removeFavourite = createAsyncThunk(
  "favourites/removeFavourite",
  async (
    { customer_id, hotel_id }: { customer_id: number; hotel_id: number },
    { rejectWithValue }
  ) => {
    try {
        console.log("Removing from favourites:", { customer_id, hotel_id });
      const res = await fetch("https://the-vellum.onrender.com/api/favourites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id, hotel_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove favourite");
      return data as Favourite;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
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

      // add
      .addCase(addToFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToFavourites.fulfilled,
        (state, action: PayloadAction<Favourite>) => {
          state.loading = false;
          if (
            !state.list.find(
              (f) => f.favourite_id === action.payload.favourite_id
            )
          ) {
            state.list.unshift(action.payload);
          }
        }
      )
      .addCase(addToFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // remove
      .addCase(removeFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFavourite.fulfilled,
        (state, action: PayloadAction<Favourite>) => {
          state.loading = false;
          state.list = state.list.filter(
            (f) => f.favourite_id !== action.payload.favourite_id
          );
        }
      )
      .addCase(removeFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default favouritesSlice.reducer;
