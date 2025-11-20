import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
//import type { RootState } from "../../store";

// -------------------- Types --------------------
export interface Customer {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}

interface CustomerState {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
}

// Load user from localStorage
const savedCustomer = localStorage.getItem("customer");

const initialState: CustomerState = {
  customer: savedCustomer ? JSON.parse(savedCustomer) : null,
  loading: false,
  error: null,
};

// ==============================================================
// 1️⃣ REGISTER CUSTOMER
// ==============================================================
export const registerCustomer = createAsyncThunk<
  Customer, // return type
  {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }, // argument type
  { rejectValue: string }
>("customer/register", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(
      "http://localhost:4040/api/customers/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (!result.success) return rejectWithValue(result.error);

    return result.data as Customer;
  } catch {
    return rejectWithValue("Registration failed");
  }
});

// ==============================================================
// 2️⃣ LOGIN CUSTOMER
// ==============================================================
export const loginCustomer = createAsyncThunk<
  Customer, // return type
  { email: string; password: string }, // argument type
  { rejectValue: string }
>("customer/login", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:4040/api/customers/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) return rejectWithValue(result.error);

    return result.data as Customer;
  } catch {
    return rejectWithValue("Login failed");
  }
});

// ==============================================================
// 3️⃣ UPDATE CUSTOMER PROFILE
// ==============================================================
export const updateCustomerProfile = createAsyncThunk<
  Customer,
  { id: number; updates: Partial<Customer> },
  { rejectValue: string }
>("customer/updateProfile", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:4040/api/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    if (!result.success) return rejectWithValue(result.error);

    return result.data as Customer;
  } catch {
    return rejectWithValue("Profile update failed");
  }
});

// ==============================================================
// SLICE
// ==============================================================
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    logout(state) {
      state.customer = null;
      localStorage.removeItem("customer");
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(registerCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      registerCustomer.fulfilled,
      (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.customer = action.payload;
        localStorage.setItem("customer", JSON.stringify(action.payload));
      }
    );
    builder.addCase(registerCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Registration error";
    });

    // LOGIN
    builder.addCase(loginCustomer.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      loginCustomer.fulfilled,
      (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.customer = action.payload;
        localStorage.setItem("customer", JSON.stringify(action.payload));
      }
    );
    builder.addCase(loginCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login error";
    });

    // UPDATE PROFILE
    builder.addCase(updateCustomerProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateCustomerProfile.fulfilled,
      (state, action: PayloadAction<Customer>) => {
        state.loading = false;
        state.customer = action.payload;
        localStorage.setItem("customer", JSON.stringify(action.payload));
      }
    );
    builder.addCase(updateCustomerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Update failed";
    });
  },
});

// Export logout action
export const { logout } = customerSlice.actions;

export default customerSlice.reducer;
