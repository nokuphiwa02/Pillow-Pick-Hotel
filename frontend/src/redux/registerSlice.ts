
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface OAuthUser {
  id: string;
  password: string;
  email: string;
  name: string;
  phone: number;
  role?: "admin" | "guest";
}

type RegisterPayload = Omit<OAuthUser, "id" | "role">;

interface UserState extends OAuthUser {
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  password: "",
  phone: 0,
  isLoading: false,
  error: null,
};

// NORMAL REGISTRATION
export const RegisterThunk = createAsyncThunk<
  unknown,
  RegisterPayload,
  { rejectValue: string }
>(
  "users/RegisterThunk",
  async (newUser, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/autho/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to register user"
        );
      }

      return data;
    } catch {
      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

// ADMIN REGISTRATION
export const RegisterAdminThunk = createAsyncThunk<
  unknown,
  RegisterPayload,
  { rejectValue: string }
>(
  "users/RegisterAdminThunk",
  async (newAdmin, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("Token");

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please log in again."
        );
      }

      const response = await fetch("/api/autho/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(
          data.message || "Failed to register administrator"
        );
      }

      return data;
    } catch {
      return rejectWithValue(
        "Admin registration failed. Please try again."
      );
    }
  }
);

// REGISTER SLICE
export const RegisterSlice = createSlice({
  name: "signUp",
  initialState,

  reducers: {
    AddName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },

    AddPhone: (state, action: PayloadAction<number>) => {
      state.phone = action.payload;
    },

    AddEmailAddress: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },

    AddPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // NORMAL REGISTRATION
      .addCase(RegisterThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(RegisterThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(RegisterThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ?? action.error.message ?? "Registration failed";
      })

      // ADMIN REGISTRATION
      .addCase(RegisterAdminThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(RegisterAdminThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(RegisterAdminThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Admin registration failed";
      });
  },
});

export const {
  AddName,
  AddPhone,
  AddEmailAddress,
  AddPassword,
} = RegisterSlice.actions;

export default RegisterSlice.reducer;
