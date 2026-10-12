import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface OAuthUser {
  id: string;
  authoId: number;
  authoProvider: string;
  password: string;
  email: string;
  name: string;
  role: UserRoleType;
  phone: number;
  createdAt?: Date;
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
  authoId : 0,
  authoProvider:"",
  role: UserRole.USER,
  createdAt: new Date(),
  isLoading: false,
  error: null,
};

export const RegisterThunk = createAsyncThunk(
  "users/RegisterThunk",
  async (newUser: Omit<OAuthUser, "id">) => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Contene-Type": "application/json",
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
    AddauthoId: (state, action: PayloadAction<number>) => {
      state.authoId = action.payload;
    },
     AddauthoProvider: (state, action: PayloadAction<string>) => {
      state.authoProvider = action.payload;
    },
     updateRole: (state, action: PayloadAction<UserRoleType>) => {
      state.role = action.payload;
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
   AddauthoId,
   AddauthoProvider,
   updateRole
} = RegisterSlice.actions;

export default RegisterSlice.reducer;