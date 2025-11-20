import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

// -------------------- Types --------------------
export interface Admin {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
}

interface AdminState {
  admin: Admin | null;
  loading: boolean;
  error: string | null;
}

// Load admin from localStorage
const savedAdmin = localStorage.getItem("admin");

const initialState: AdminState = {
  admin: savedAdmin ? JSON.parse(savedAdmin) : null,
  loading: false,
  error: null,
};

// ==============================================================
// 1️⃣ REGISTER ADMIN  (optional – keep if you register admins via UI)
// ==============================================================

export const registerAdmin = createAsyncThunk<
  Admin, // return type
  {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }, // argument type
  { rejectValue: string }
>("admin/register", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:4040/api/admins/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) return rejectWithValue(result.error);

    return result.data as Admin;
  } catch {
    return rejectWithValue("Admin registration failed");
  }
});

// ==============================================================
// 2️⃣ LOGIN ADMIN
// ==============================================================

export const loginAdmin = createAsyncThunk<
  Admin, // return type
  { email: string; password: string }, // argument type
  { rejectValue: string }
>("admin/login", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:4040/api/admins/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!result.success) return rejectWithValue(result.error);

    return result.data as Admin;
  } catch {
    return rejectWithValue("Admin login failed");
  }
});

// ==============================================================
// 3️⃣ UPDATE ADMIN PROFILE
// ==============================================================

export const updateAdminProfile = createAsyncThunk<
  Admin,
  { id: number; updates: Partial<Admin> },
  { rejectValue: string }
>("admin/updateProfile", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await fetch(`http://localhost:4040/api/admins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    if (!result.success) return rejectWithValue(result.error);

    return result.data as Admin;
  } catch {
    return rejectWithValue("Admin profile update failed");
  }
});

// ==============================================================
// SLICE
// ==============================================================

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logout(state) {
      state.admin = null;
      localStorage.removeItem("admin");
    },
  },
  extraReducers: (builder) => {
    // REGISTER
    builder.addCase(registerAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      registerAdmin.fulfilled,
      (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        state.admin = action.payload;
        localStorage.setItem("admin", JSON.stringify(action.payload));
      }
    );
    builder.addCase(registerAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Admin registration error";
    });

    // LOGIN
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      loginAdmin.fulfilled,
      (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        state.admin = action.payload;
        localStorage.setItem("admin", JSON.stringify(action.payload));
      }
    );
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Admin login error";
    });

    // UPDATE PROFILE
    builder.addCase(updateAdminProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateAdminProfile.fulfilled,
      (state, action: PayloadAction<Admin>) => {
        state.loading = false;
        state.admin = action.payload;
        localStorage.setItem("admin", JSON.stringify(action.payload));
      }
    );
    builder.addCase(updateAdminProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Admin update failed";
    });
  },
});

// Export logout action
export const { logout } = adminSlice.actions;

export default adminSlice.reducer;
