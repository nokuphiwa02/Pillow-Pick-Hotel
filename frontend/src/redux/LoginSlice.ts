import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type PayloadAction } from "@reduxjs/toolkit";
import { type OAuthUser } from "./registerSlice"

interface LoginState {
  currentUser: OAuthUser | null;
  emailInput: string;
  passwordInput: string;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: LoginState = {
  currentUser: null,
  emailInput: "",
  passwordInput: "",
  isLoading: false,
  error: null,
  isAuthenticated: false,
};


export const LoginThunk = createAsyncThunk(
  "users/LoginThunk",
  async (
    login: { email: string; password: Required<OAuthUser>["password"] },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/autho/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
           body: JSON.stringify(login)
        },
      );

      if (!response.ok) throw new Error("Failed to connect to the server");

      const users: OAuthUser[] = await response.json();

      const user = users.find((u) => u.password === login.password);

      if (!user) {
        return rejectWithValue("Invalid email or password.");
      }

      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  },
);

export const LoginSlice = createSlice({
  name: "signIn",
  initialState,
  reducers: {
    updateEmailAddress: (state, action: PayloadAction<string>) => {
      state.emailInput = action.payload;
    },
    updatePassword: (state, action: PayloadAction<string>) => {
      state.passwordInput = action.payload;
    },
    clearLoginInputs: (state) => {
      state.emailInput = "";
      state.passwordInput = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(LoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload;
        state.emailInput = "";
        state.passwordInput = "";
      })
      .addCase(LoginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateEmailAddress, updatePassword, clearLoginInputs } =
  LoginSlice.actions;
export default LoginSlice.reducer;