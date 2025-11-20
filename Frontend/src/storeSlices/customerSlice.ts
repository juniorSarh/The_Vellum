// src/store/customerSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Customer, CustomerState } from "./customerTypes";

// Initial state
const initialState: CustomerState = {
  user: null,
  loading: false,
  error: null,
};

// Base URL for API
const API_BASE = "http://localhost:4040/api/customers";


// ================== THUNKS ==================

// Register
export const registerCustomer = createAsyncThunk<
  Customer, // Return type
  {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    phone?: string;
    address?: string;
  }, // Argument type
  { rejectValue: string }
>("customer/register", async (data, thunkAPI) => {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(result.error || "Failed");
    return result.data as Customer;
  } catch (err) {
    return thunkAPI.rejectWithValue("Network error");
    console.error("Error in registerCustomer thunk:", err);
  }
});

// Login
export const loginCustomer = createAsyncThunk<
  Customer,
  { email: string; password: string },
  { rejectValue: string }
>("customer/login", async (data, thunkAPI) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(result.error || "Failed");
    return result.data as Customer;
  } catch (err) {
    return thunkAPI.rejectWithValue("Network error");
    console.error("Error in loginCustomer thunk:", err);    
  }
});

// Update profile
export const updateProfile = createAsyncThunk<
  Customer,
  { id: number; formData: Partial<Customer> },
  { rejectValue: string }
>("customer/updateProfile", async ({ id, formData }, thunkAPI) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    if (!res.ok) return thunkAPI.rejectWithValue(result.error || "Failed");
    return result.data as Customer;
  } catch (err) {
    return thunkAPI.rejectWithValue("Network error");
    console.error("Error in updateProfile thunk:", err);
  }
});
// ================== SLICE ==================
export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerCustomer.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(registerCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to register";
      })

      // Login
      .addCase(loginCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginCustomer.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(loginCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to login";
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<Customer>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });
  },
});

export const { logout } = customerSlice.actions;
export default customerSlice.reducer;