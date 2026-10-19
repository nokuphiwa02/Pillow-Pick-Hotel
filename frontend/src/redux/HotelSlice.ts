import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Hotel {
  id: number;
  hotel_name: string;
  address: string;
  city: string;
  rating: number;
  description: string;
  image_url?: string; 
  created_at?: string;
}

interface HotelState {
  hotels: Hotel[];
  loading: boolean;
  error: string | null;
}

const initialState: HotelState = {
  hotels: [],
  loading: false,
  error: null,
};

const API_URL = 'http://localhost:5000/api/hotels'; 


export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (hotelData: any, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Token'); 
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
         body: JSON.stringify(hotelData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || 'failed to create new hotel');
      }

      const data = await response.json();
      return data as Hotel;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to connect to the server');
    }
  }
);


export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels', 
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Token'); 
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || 'Error fetching hotels');
      }

      const data = await response.json();
      return data as Hotel[];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to connect to the server');
    }
  }
);

export const updateHotelById = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, hotelData }: { id: number; hotelData: any }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Token'); 
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(hotelData), 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || 'Failed to review the hote');
      }

      const data = await response.json();
      return data as Hotel; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to connect to the server');
    }
  }
);

// 4. Deleting a hotel by ID
export const deleteHotelById = createAsyncThunk(
  'hotels/deleteHotel',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('Token');
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.message || 'Error deleting hotel');
      }

      await response.json().catch(() => ({}));
      return id; 
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to connect to the server');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action: PayloadAction<Hotel[]>) => {
        state.loading = false;
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Hotel
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action: PayloadAction<Hotel>) => {
        state.loading = false;
        state.hotels.push(action.payload);
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Hotel 
      .addCase(updateHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHotelById.fulfilled, (state, action: PayloadAction<Hotel>) => {
        state.loading = false;
        const index = state.hotels.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
          state.hotels[index] = action.payload; 
        }
      })
      .addCase(updateHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Hotel
      .addCase(deleteHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotelById.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.hotels = state.hotels.filter((h) => h.id !== action.payload);
      })
      .addCase(deleteHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default hotelSlice.reducer;
