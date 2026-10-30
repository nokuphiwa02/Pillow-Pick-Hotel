
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface User {
  id: number;
  authoId?: number | null;
  authoProvider?: string | null;
  name: string;
  email: string;
  role: string;
  createdat?: string | null;
}

interface UserState {
  users: User[];
  loading: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  deleting: false,
  error: null,
};

// Keep the same API URL used by fetchUsers.
const API_URL = "/api/autho/users";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("Token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// FETCH ALL USERS
export const fetchUsers = createAsyncThunk<
  User[],
  void,
  { rejectValue: string }
>(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to fetch users."
        );
      }

      if (!Array.isArray(data)) {
        return rejectWithValue(
          "The server returned an invalid users response."
        );
      }

      return data as User[];
    } catch {
      return rejectWithValue(
        "Failed to connect to the server."
      );
    }
  }
);

// DELETE USER
export const deleteUser = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "users/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/${userId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to delete user."
        );
      }

      return userId;
    } catch {
      return rejectWithValue(
        "Failed to connect to the server."
      );
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch users.";
      })

      .addCase(deleteUser.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleting = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload ?? "Failed to delete user.";
      });
  },
});

export const { clearUserError } = userSlice.actions;

export default userSlice.reducer;
