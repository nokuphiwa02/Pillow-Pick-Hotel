
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

export interface Profile {
  id: number;
  user_id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  profile_picture: string;
  address: string;
  created_at: string;
}

interface UserState extends OAuthUser {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  password: "",
  phone: 0,
  profile: null,
  isLoading: false,
  error: null,
};

// CREATE PROFILE
export const CreateProfileThunk = createAsyncThunk<
  Profile,
  Omit<Profile, "id" | "created_at">,
  { rejectValue: string }
>(
  "users/CreateProfileThunk",
  async (newProfile, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProfile),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message ||
            data?.error ||
            "Failed to create profile."
        );
      }

      return data as Profile;
    } catch {
      return rejectWithValue(
        "Unable to connect to the server."
      );
    }
  }
);

// GET PROFILE BY ID
export const GetProfileByIdThunk = createAsyncThunk<
  Profile,
  number,
  { rejectValue: string }
>(
  "users/GetProfileByIdThunk",
  async (id, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("Token") ??
        localStorage.getItem("token");

      const response = await fetch(`/api/profile/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message ||
            data?.error ||
            `Failed to retrieve profile (${response.status}).`
        );
      }

      return data as Profile;
    } catch {
      return rejectWithValue(
        "Unable to connect to the server."
      );
    }
  }
);

// UPDATE PROFILE
export const UpdateProfileThunk = createAsyncThunk<
  Profile,
  {
    id: number;
    profileData: Partial<Profile>;
  },
  { rejectValue: string }
>(
  "users/UpdateProfileThunk",
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("Token") ??
        localStorage.getItem("token");

      const response = await fetch(`/api/profile/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message ||
            data?.error ||
            `Failed to update profile (${response.status}).`
        );
      }

      return data as Profile;
    } catch {
      return rejectWithValue(
        "Unable to connect to the server. Please try again."
      );
    }
  }
);

// REDUX SLICE
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
    AddEmailAddress: (
      state,
      action: PayloadAction<string>
    ) => {
      state.email = action.payload;
    },
    AddPassword: (
      state,
      action: PayloadAction<string>
    ) => {
      state.password = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(CreateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(CreateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(CreateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to create profile.";
      })

      // GET
      .addCase(GetProfileByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetProfileByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(GetProfileByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to retrieve profile.";
      })

      // UPDATE
      .addCase(UpdateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(UpdateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to update profile.";
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
