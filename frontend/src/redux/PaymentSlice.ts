
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Payment {
  id: number;
  booking_id: number;
  user_id: number;
  amount: number | string;
  currency: string;
  payment_method: string | null;
  status: "pending" | "successful" | "failed" | "cancelled" | "refunded";
  transaction_reference: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentPayload {
  booking_id: number;
  payment_method: string;
}

interface CreatePaymentResponse {
  message: string;
  payment: Payment;
  authorization_url?: string;
  reference?: string;
}

interface PaymentState {
  payment: Payment | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  payment: null,
  loading: false,
  error: null,
};

const API_URL = "/api/payments";

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("Token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const createPayment = createAsyncThunk<
  CreatePaymentResponse,
  CreatePaymentPayload,
  { rejectValue: string }
>(
  "payments/createPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        return rejectWithValue(
          data?.message || "Failed to create payment"
        );
      }

      return data as CreatePaymentResponse;
    } catch {
      return rejectWithValue("Failed to connect to the server");
    }
  }
);

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    clearPaymentError(state) {
      state.error = null;
    },
    resetPayment(state) {
      state.payment = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload.payment;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create payment";
      });
  },
});

export const { clearPaymentError, resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
