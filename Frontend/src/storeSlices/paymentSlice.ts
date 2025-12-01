import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface InitPaymentResponse {
  message: string;
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaymentState {
  loading: boolean;
  error: string | null;
  reference: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  reference: null,
};

// Async thunk to initialize payment
export const initializePayment = createAsyncThunk<
  InitPaymentResponse,
  { email: string; amount: number | string }, // 👈 allow string or number
  { rejectValue: string }
>(
  "payment/initializePayment",
  async ({ email, amount }, { rejectWithValue }) => {
    try {
      // Ensure we send a valid number to the backend
      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return rejectWithValue("Invalid payment amount");
      }

      const res = await axios.post<InitPaymentResponse>(
        "http://localhost:4040/api/initialize",
        { email, amount: numericAmount }
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Payment init failed"
      );
    }
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.loading = false;
      state.error = null;
      state.reference = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        initializePayment.fulfilled,
        (state, action: PayloadAction<InitPaymentResponse>) => {
          state.loading = false;
          state.reference = action.payload.reference;
        }
      )
      .addCase(initializePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Payment init failed";
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
