import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Booking {
  id: number;
  user_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  guest_number: number;
  total_price: number;
  booking_status: "Pending" | "Cancelled" | "Approve";
  created_at: string;
}

export interface CreateBookingPayload {
  room_id: number;
  check_in: string;
  check_out: string;
  guest_number: number;
}

export interface UpdateBookingPayload {
  id: number;
  data: Partial<CreateBookingPayload> & {
  booking_status?: Booking["booking_status"];
  };
}

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
  success: false,
};

const API_URL = "/api/bookings";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("Token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

// create Bookings
export const createBooking = createAsyncThunk<
  Booking,
  CreateBookingPayload,
  { rejectValue: string }
>(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to create booking"
        );
      }

      return data as Booking;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  }
);

// FETCH ALL BOOKINGS 

export const fetchBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>(
  "bookings/fetchBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to fetch bookings"
        );
      }

      return Array.isArray(data) ? (data as Booking[]) : [];
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  }
);

// FETCH BOOKING BY ID 

export const fetchBookingById = createAsyncThunk<
  Booking,
  number,
  { rejectValue: string }
>(
  "bookings/fetchBookingById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "GET",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to fetch booking"
        );
      }

      return data as Booking;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  }
);

// UPDATE BOOKING 

export const updateBooking = createAsyncThunk<
  Booking,
  UpdateBookingPayload,
  { rejectValue: string }
>(
  "bookings/updateBooking",
  async ({ id, data: bookingData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to update booking"
        );
      }

      return data as Booking;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  }
);

//  DELETE BOOKING 

export const deleteBooking = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "bookings/deleteBooking",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to delete booking"
        );
      }

      return id;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  }
);

//  REDUX SLICE 

const bookingSlice = createSlice({
  name: "bookings",
  initialState,

  reducers: {
    clearBookingError(state) {
      state.error = null;
    },

    resetBookingSuccess(state) {
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to create booking";
      })

      // FETCH ALL
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch bookings";
      })

      // FETCH BY ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );

        if (index !== -1) {
          state.bookings[index] = action.payload;
        } else {
          state.bookings.push(action.payload);
        }
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to fetch booking";
      })

      // UPDATE
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );

        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to update booking";
      })

      // DELETE
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.payload
        );
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to delete booking";
      });
  },
});



export const {
  clearBookingError,
  resetBookingSuccess,
} = bookingSlice.actions;

export default bookingSlice.reducer;