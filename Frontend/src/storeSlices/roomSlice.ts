// src/storeSlices/roomSlice.ts
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

// -------------------- Types --------------------
export interface Room {
  room_id?: number;
  hotel_id: number;
  room_type: string;
  price: number; // using number in FE; backend stores NUMERIC(10,2)
  status: string;
}

interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

// Base URL for rooms API
const BASE_URL = "http://localhost:4040/api/rooms";

// ==============================================================
// 1️⃣ FETCH ALL ROOMS
// ==============================================================
export const fetchRooms = createAsyncThunk<
  Room[],
  void,
  { rejectValue: string }
>("rooms/fetchRooms", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}`);
    const result = await response.json();

    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to fetch rooms");
    }

    return result as Room[];
  } catch {
    return rejectWithValue("Failed to fetch rooms");
  }
});

// ==============================================================
// 2️⃣ ADD ROOM (create)
// ==============================================================
export const addRoom = createAsyncThunk<
  Room,
  Omit<Room, "room_id">,
  { rejectValue: string }
>("rooms/addRoom", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to add room");
    }

    return result as Room;
  } catch {
    return rejectWithValue("Failed to add room");
  }
});

// ==============================================================
// 3️⃣ UPDATE ROOM (update)
// ==============================================================
export const updateRoom = createAsyncThunk<
  Room,
  { id: number; updates: Partial<Room> },
  { rejectValue: string }
>("rooms/updateRoom", async ({ id, updates }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    if (!response.ok) {
      return rejectWithValue(result.error || "Failed to update room");
    }

    return result as Room;
  } catch {
    return rejectWithValue("Failed to update room");
  }
});

// ==============================================================
// 4️⃣ DELETE ROOM (delete)
// ==============================================================
export const deleteRoom = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("rooms/deleteRoom", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      return rejectWithValue(result.error || "Failed to delete room");
    }

    return id;
  } catch {
    return rejectWithValue("Failed to delete room");
  }
});

// ==============================================================
// SLICE
// ==============================================================
const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearRoomError(state) {
      state.error = null;
    },
    setRooms(state, action: PayloadAction<Room[]>) {
      state.rooms = action.payload;
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL
    builder.addCase(fetchRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchRooms.fulfilled,
      (state, action: PayloadAction<Room[]>) => {
        state.loading = false;
        state.rooms = action.payload;
      }
    );
    builder.addCase(fetchRooms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch rooms";
    });

    // ADD
    builder.addCase(addRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addRoom.fulfilled, (state, action: PayloadAction<Room>) => {
      state.loading = false;
      state.rooms.push(action.payload);
    });
    builder.addCase(addRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add room";
    });

    // UPDATE
    builder.addCase(updateRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateRoom.fulfilled,
      (state, action: PayloadAction<Room>) => {
        state.loading = false;
        const idx = state.rooms.findIndex(
          (r) => r.room_id === action.payload.room_id
        );
        if (idx !== -1) {
          state.rooms[idx] = action.payload;
        }
      }
    );
    builder.addCase(updateRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update room";
    });

    // DELETE
    builder.addCase(deleteRoom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteRoom.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.rooms = state.rooms.filter((r) => r.room_id !== action.payload);
      }
    );
    builder.addCase(deleteRoom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete room";
    });
  },
});

export const { clearRoomError, setRooms } = roomSlice.actions;
export default roomSlice.reducer;

