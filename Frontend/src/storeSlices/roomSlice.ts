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
  price: number;
  status: string; // e.g. "available", "booked", "maintenance"
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

const BASE_URL = "http://localhost:4040/api/rooms";

// ==============================================================
// 1️⃣ ADD ROOM (adroom)
// ==============================================================
export const adroom = createAsyncThunk<
  Room, // return type
  Omit<Room, "room_id">, // argument type
  { rejectValue: string }
>("rooms/adroom", async (data, { rejectWithValue }) => {
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

    // controller returns the room directly
    return result as Room;
  } catch {
    return rejectWithValue("Failed to add room");
  }
});

// ==============================================================
// 2️⃣ UPDATE ROOM (updateroom)
// ==============================================================
export const updateroom = createAsyncThunk<
  Room,
  { id: number; updates: Partial<Room> },
  { rejectValue: string }
>("rooms/updateroom", async ({ id, updates }, { rejectWithValue }) => {
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
// 3️⃣ DELETE ROOM (deleteroom)
// ==============================================================
export const deleteroom = createAsyncThunk<
  number, // return deleted room_id
  number, // param: id
  { rejectValue: string }
>("rooms/deleteroom", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

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
// Optional: FETCH ROOMS (for page load)
// ==============================================================
export const fetchRooms = createAsyncThunk<
  Room[],
  { hotelId?: number } | void,
  { rejectValue: string }
>("rooms/fetchRooms", async (arg, { rejectWithValue }) => {
  try {
    const hotelId = arg && "hotelId" in arg ? arg.hotelId : undefined;
    const url = hotelId ? `${BASE_URL}?hotelId=${hotelId}` : BASE_URL;

    const response = await fetch(url);
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
    // ------- fetchRooms -------
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

    // ------- adroom -------
    builder.addCase(adroom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(adroom.fulfilled, (state, action: PayloadAction<Room>) => {
      state.loading = false;
      state.rooms.push(action.payload);
    });
    builder.addCase(adroom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to add room";
    });

    // ------- updateroom -------
    builder.addCase(updateroom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateroom.fulfilled,
      (state, action: PayloadAction<Room>) => {
        state.loading = false;
        const index = state.rooms.findIndex(
          (r) => r.room_id === action.payload.room_id
        );
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
      }
    );
    builder.addCase(updateroom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update room";
    });

    // ------- deleteroom -------
    builder.addCase(deleteroom.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteroom.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.rooms = state.rooms.filter(
          (room) => room.room_id !== action.payload
        );
      }
    );
    builder.addCase(deleteroom.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to delete room";
    });
  },
});

export const { clearRoomError, setRooms } = roomSlice.actions;
export default roomSlice.reducer;
