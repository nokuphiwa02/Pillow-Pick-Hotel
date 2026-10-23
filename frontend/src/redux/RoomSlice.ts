
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Room {
  id: number;
  hotel_id: number;
  room_type: string;
  capacity: number;
  quantity: number;
  description: string;
  facilities: string;
  price_per_night: number;
}

interface RoomState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

interface UpdateRoomPayload {
  id: number;
  roomData: FormData;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const API_URL = "/api/rooms";

// Authorization headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("Token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// Read API error messages
const getErrorMessage = async (
  response: Response,
  defaultMessage: string,
): Promise<string> => {
  const errorData = await response.json().catch(() => null);

  return errorData?.message || errorData?.error || defaultMessage;
};

// CREATE ROOM

type CreateRoomPayload = Omit<Room, "id">;

export const createRoom = createAsyncThunk<
  Room,
  CreateRoomPayload,
  { rejectValue: string }
>(
  "rooms/createRoom",
  async (roomData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token");

      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response, "Failed to create room"),
        );
      }

      return (await response.json()) as Room;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  },
);

// FETCH ROOMS
export const fetchRooms = createAsyncThunk<
  Room[],
  void,
  { rejectValue: string }
>(
  "rooms/fetchRooms",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response, "Failed to fetch rooms"),
        );
      }

      const data = await response.json();

      // Supports either an array or an object containing rooms
      return Array.isArray(data) ? (data as Room[]) : (data.rooms as Room[]);
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  },
);

// UPDATE ROOM BY ID

export const updateRoomById = createAsyncThunk<
  Room,
  UpdateRoomPayload,
  { rejectValue: string }
>(
  "rooms/updateRoomById",
  async ({ id, roomData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token");

      const response = await fetch(`/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response, "Failed to update room"),
        );
      }

      return (await response.json()) as Room;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  },
);

// DELETE ROOM BY ID
export const deleteRoomById = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "rooms/deleteRoom",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        return rejectWithValue(
          await getErrorMessage(response, "Failed to delete room"),
        );
      }

      // Return the ID so Redux can remove the room
      return id;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  },
);

// ROOM SLICE
const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    clearRoomError(state) {
      state.error = null;
    },

    clearRooms(state) {
      state.rooms = [];
      state.error = null;
      state.loading = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH ROOMS
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRooms.fulfilled,
        (state, action: PayloadAction<Room[]>) => {
          state.loading = false;
          state.rooms = action.payload;
        },
      )
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch rooms";
      })

      // CREATE ROOM
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.loading = false;

        const newRoom = action.payload;
        const exists = state.rooms.some(
          (room) => room.id === newRoom.id,
        );

        if (!exists) {
          state.rooms.push(newRoom);
        }
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to create room";
      })

      // UPDATE ROOM
      .addCase(updateRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoomById.fulfilled, (state, action) => {
        state.loading = false;

        const updatedRoom = action.payload;
        const index = state.rooms.findIndex(
          (room) => room.id === updatedRoom.id,
        );

        if (index !== -1) {
          state.rooms[index] = updatedRoom;
        }
      })
      .addCase(updateRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to update room";
      })

      // DELETE ROOM
      .addCase(deleteRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoomById.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = state.rooms.filter(
          (room) => room.id !== action.payload,
        );
      })
      .addCase(deleteRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to delete room";
      });
  },
});

export const { clearRoomError, clearRooms } = roomSlice.actions;

export default roomSlice.reducer;
