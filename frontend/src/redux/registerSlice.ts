import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";




export interface OAuthUser {
  id: string;
  password: string;
  email: string;
  name: string;
  phone: number;
}

interface UserState extends OAuthUser {
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  password: "",
  phone : 0,
  isLoading: false,
  error: null,
};

export const RegisterThunk = createAsyncThunk(
  "users/RegisterThunk",
  async (newUser: Omit<OAuthUser, "id">) => {
    const response = await fetch("/api/autho/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!response.ok) {
      throw new Error("failed to add user");
    }
    const data = await response.json();
    return data;
  },
);

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
    builder.addCase(RegisterThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(RegisterThunk.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(RegisterThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
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