import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

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

// Create Profile
export const CreateProfileThunk = createAsyncThunk(
  "users/CreateProfileThunk",
  async (newProfile: Omit<Profile, "id" | "created_at">) => {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProfile),
    });

    if (!response.ok) {
      throw new Error("Failed to create profile");
    }

    return (await response.json()) as Profile;
  },
);

// Get Profile By ID

export const GetProfileByIdThunk = createAsyncThunk(
  "users/GetProfileByIdThunk",
  async (id: number, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("Token") ??
        localStorage.getItem("token");

      const response = await fetch(`/api/profile/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const message = await response.text();
        return rejectWithValue(
          `Failed to retrieve profile (${response.status}): ${message}`
        );
      }

      return (await response.json()) as Profile;
    } catch {
      return rejectWithValue("Unable to connect to the server.");
    }
  }
);


// Update Profile
export const UpdateProfileThunk = createAsyncThunk(
  "users/UpdateProfileThunk",
  async ({
    id,
    profileData,
  }: {
    id: number;
    profileData: Partial<Profile>;
  }) => {
    const response = await fetch(`/api/profile/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return (await response.json()) as Profile;
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
    builder
      .addCase(CreateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(CreateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(CreateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to create profile";
      })

      .addCase(GetProfileByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(GetProfileByIdThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(GetProfileByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to retrieve profile";
      })

      .addCase(UpdateProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(UpdateProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(UpdateProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to update profile";
      });
  },
});

export const { AddName, AddPhone, AddEmailAddress,AddPassword,} = RegisterSlice.actions;

export default RegisterSlice.reducer;