
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Review {
  id: number;
  user_id: number;
  hotel_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface NewReview {
  hotel_id: number;
  rating: number;
  comment: string;
}

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
};

const API_URL = "/api/reviews";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("Token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Fetch all reviews
export const fetchReviews = createAsyncThunk<
  Review[],
  void,
  { rejectValue: string }
>("reviews/fetchReviews", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to fetch reviews");
    }

    return data as Review[];
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

// Create a review
export const createReview = createAsyncThunk<
  Review,
  NewReview,
  { rejectValue: string }
>("reviews/createReview", async (review, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(review),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to create review");
    }

    return data as Review;
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

// Delete a review
export const deleteReview = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("reviews/deleteReview", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Failed to delete review");
    }

    return id;
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch reviews";
      })

      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create review";
      })

      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete review";
      });
  },
});

export const { clearReviewsError } = reviewsSlice.actions;

export default reviewsSlice.reducer;
