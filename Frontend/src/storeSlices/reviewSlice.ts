// src/storeSlices/reviewSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

// -------------------- Types --------------------
export interface Review {
  review_id?: number;
  user_id: number;
  hotel_id: number;
  star_rating?: number | null;
  comment?: string | null;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

const BASE_URL = "http://localhost:4040/api/reviews";

// ==============================================================
// 1️⃣ FETCH REVIEWS (optional filters)
// ==============================================================
export const fetchReviews = createAsyncThunk<
  Review[],
  { user_id?: number; hotel_id?: number } | void,
  { rejectValue: string }
>("reviews/fetchReviews", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    if (filters && filters.user_id)
      params.append("user_id", String(filters.user_id));
    if (filters && filters.hotel_id)
      params.append("hotel_id", String(filters.hotel_id));

    const url = params.toString()
      ? `${BASE_URL}?${params.toString()}`
      : BASE_URL;
    const response = await fetch(url);
    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to fetch reviews");
    }

    return result as Review[];
  } catch {
    return rejectWithValue("Failed to fetch reviews");
  }
});

// ==============================================================
// 2️⃣ ADD REVIEW
// ==============================================================
export const addReview = createAsyncThunk<
  Review,
  Omit<Review, "review_id">,
  { rejectValue: string }
>("reviews/addReview", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to add review");
    }

    return result as Review;
  } catch {
    return rejectWithValue("Failed to add review");
  }
});

// ==============================================================
// 3️⃣ UPDATE REVIEW
// ==============================================================
export const updateReview = createAsyncThunk<
  Review,
  { id: number; updates: Partial<Review> },
  { rejectValue: string }
>("reviews/updateReview", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to update review");
    }

    return result as Review;
  } catch {
    return rejectWithValue("Failed to update review");
  }
});

// ==============================================================
// 4️⃣ DELETE REVIEW
// ==============================================================
export const deleteReview = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("reviews/deleteReview", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return rejectWithValue(result.error || "Failed to delete review");
    }

    return id;
  } catch {
    return rejectWithValue("Failed to delete review");
  }
});

// ==============================================================
// SLICE
// ==============================================================
const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewError(state) {
      state.error = null;
    },
    setReviews(state, action: PayloadAction<Review[]>) {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ------- fetchReviews -------
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchReviews.fulfilled,
      (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      }
    );
    builder.addCase(fetchReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch reviews";
    });

    // ------- addReview -------
    builder.addCase(addReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addReview.fulfilled,
      (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      }
    );
    builder.addCase(addReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add review";
    });

    // ------- updateReview -------
    builder.addCase(updateReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateReview.fulfilled,
      (state, action: PayloadAction<Review>) => {
        state.loading = false;
        const idx = state.reviews.findIndex(
          (r) => r.review_id === action.payload.review_id
        );
        if (idx !== -1) state.reviews[idx] = action.payload;
      }
    );
    builder.addCase(updateReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update review";
    });

    // ------- deleteReview -------
    builder.addCase(deleteReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteReview.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (r) => r.review_id !== action.payload
        );
      }
    );
    builder.addCase(deleteReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete review";
    });
  },
});

export const { clearReviewError, setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;

/*
dispatch(fetchReviews({ hotel_id: 10 }));
dispatch(addReview({ user_id: 1, hotel_id: 10, star_rating: 5, comment: "Great!" }));
dispatch(updateReview({ id: 3, updates: { star_rating: 4, comment: "Updated" } }));
dispatch(deleteReview(3));
*/
