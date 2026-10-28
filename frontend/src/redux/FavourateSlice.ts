
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Favourite {
  id: number;
  user_id: number;
  hotel_id: number;
  created_at?: string;
}

interface FavouriteState {
  favourites: Favourite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouriteState = {
  favourites: [],
  loading: false,
  error: null,
};

const API_URL = "/api/favourites";

const getAuthHeaders = () => {
  const token = localStorage.getItem("Token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getLoggedInUserId = (): number => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    throw new Error("Please log in to manage favourites.");
  }

  const user = JSON.parse(savedUser);
  const userId = Number(user.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("Could not identify the logged-in user.");
  }

  return userId;
};

// Fetch favourites
export const fetchFavourites = createAsyncThunk<
  Favourite[],
  void,
  { rejectValue: string }
>("favourites/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const userId = getLoggedInUserId();

    const response = await fetch(`${API_URL}?user_id=${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to load favourites.");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected favourites response.");
    }

    return data.filter(
      (favourite: Favourite) => Number(favourite.user_id) === userId
    );
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load favourites."
    );
  }
});

// Add a favourite
export const addFavourite = createAsyncThunk<
  Favourite,
  number,
  { rejectValue: string }
>("favourites/add", async (hotelId, { rejectWithValue }) => {
  try {
    const userId = getLoggedInUserId();

    // Debugging: check the IDs before sending the request.
    console.log("User ID:", userId);
    console.log("Hotel ID received by thunk:", hotelId);

    if (!Number.isInteger(Number(hotelId)) || Number(hotelId) <= 0) {
      throw new Error(
        `Invalid hotel ID: ${String(hotelId)}. Check GuestDashboard.tsx.`
      );
    }

    const requestBody = {
      user_id: userId,
      hotel_id: Number(hotelId),
    };

    console.log("Request body:", requestBody);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(
        data?.message || `Failed to add favourite (${response.status}).`
      );
    }

    const savedFavourite: Favourite = await response.json();

    if (!savedFavourite.hotel_id) {
      throw new Error(
        "The server did not return a valid hotel_id. Check the backend controller."
      );
    }

    return savedFavourite;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to add favourite."
    );
  }
});

// Remove a favourite using its favourite record ID
export const removeFavourite = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("favourites/remove", async (favouriteId, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${favouriteId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to remove favourite.");
    }

    return favouriteId;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to remove favourite."
    );
  }
});

const favouriteSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load favourites.";
      })
      .addCase(addFavourite.pending, (state) => {
        state.error = null;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        const alreadyExists = state.favourites.some(
          (favourite) =>
            favourite.hotel_id === action.payload.hotel_id &&
            favourite.user_id === action.payload.user_id
        );

        if (!alreadyExists) {
          state.favourites.push(action.payload);
        }
      })
      .addCase(addFavourite.rejected, (state, action) => {
        state.error = action.payload || "Failed to add favourite.";
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(
          (favourite) => favourite.id !== action.payload
        );
      })
      .addCase(removeFavourite.rejected, (state, action) => {
        state.error = action.payload || "Failed to remove favourite.";
      });
  },
});

export default favouriteSlice.reducer;
