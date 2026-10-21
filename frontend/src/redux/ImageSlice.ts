
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/hotelImage";

export interface HotelImage {
  id: number;
  hotel_id: number;
  is_primary: boolean;
  img_url: string;
  created_at?: string;
}

export interface NewHotelImage {
  hotel_id: number;
  is_primary: boolean;
  pictures: File[];
}

export interface UpdateHotelImageData {
  hotel_id?: number;
  is_primary?: boolean;
  img_url?: string;
}

interface ImageState {
  images: HotelImage[];
  selectedImage: HotelImage | null;
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  selectedImage: null,
  loading: false,
  error: null,
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("Token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getErrorMessage = async (
  response: Response,
  fallback: string
): Promise<string> => {
  const data = await response.json().catch(() => ({}));
  return data.message || fallback;
};

// GET: Retrieve all hotel images
export const getAllImages = createAsyncThunk<
  HotelImage[],
  void,
  { rejectValue: string }
>("images/getAllImages", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return rejectWithValue(
        await getErrorMessage(response, "Failed to retrieve hotel images")
      );
    }

    return (await response.json()) as HotelImage[];
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

// GET: Retrieve an image by ID
export const getImageById = createAsyncThunk<
  HotelImage,
  number,
  { rejectValue: string }
>("images/getImageById", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return rejectWithValue(
        await getErrorMessage(response, "Hotel image not found")
      );
    }

    return (await response.json()) as HotelImage;
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

// POST: Upload one or multiple images for a hotel
export const addHotelImage = createAsyncThunk<
  HotelImage[],
  NewHotelImage,
  { rejectValue: string }
>("images/addHotelImage", async (imageData, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("hotel_id", String(imageData.hotel_id));
    formData.append("is_primary", String(imageData.is_primary));

    imageData.pictures.forEach((file) => {
      formData.append("pictures", file);
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      return rejectWithValue(
        await getErrorMessage(response, "Failed to upload hotel images")
      );
    }

    const result = await response.json();

    // The backend may return one record or an array of records.
    return (Array.isArray(result) ? result : [result]) as HotelImage[];
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

// PUT: Update image details
export const updateHotelImage = createAsyncThunk<
  HotelImage,
  { id: number; data: UpdateHotelImageData },
  { rejectValue: string }
>("images/updateHotelImage", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return rejectWithValue(
        await getErrorMessage(response, "Failed to update hotel image")
      );
    }

    return (await response.json()) as HotelImage;
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

// DELETE: Delete an image
export const deleteHotelImage = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("images/deleteHotelImage", async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      return rejectWithValue(
        await getErrorMessage(response, "Failed to delete hotel image")
      );
    }

    return id;
  } catch {
    return rejectWithValue("Unable to connect to the server");
  }
});

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    clearSelectedImage: (state) => {
      state.selectedImage = null;
    },
    clearImageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all images
      .addCase(getAllImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload;
      })
      .addCase(getAllImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to retrieve images";
      })

      // Fetch one image
      .addCase(getImageById.pending, (state) => {
        state.error = null;
      })
      .addCase(getImageById.fulfilled, (state, action) => {
        state.selectedImage = action.payload;
      })
      .addCase(getImageById.rejected, (state, action) => {
        state.error = action.payload ?? "Image not found";
      })

      // Add images
      .addCase(addHotelImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHotelImage.fulfilled, (state, action) => {
        state.loading = false;

        for (const image of action.payload) {
          const existing = state.images.some(
            (item) => item.id === image.id
          );

          if (!existing) {
            state.images.push(image);
          }
        }
      })
      .addCase(addHotelImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to upload images";
      })

      // Update image
      .addCase(updateHotelImage.pending, (state) => {
        state.error = null;
      })
      .addCase(updateHotelImage.fulfilled, (state, action) => {
        const index = state.images.findIndex(
          (image) => image.id === action.payload.id
        );

        if (index !== -1) {
          state.images[index] = action.payload;
        }

        if (state.selectedImage?.id === action.payload.id) {
          state.selectedImage = action.payload;
        }
      })
      .addCase(updateHotelImage.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to update image";
      })

      // Delete image
      .addCase(deleteHotelImage.fulfilled, (state, action) => {
        state.images = state.images.filter(
          (image) => image.id !== action.payload
        );

        if (state.selectedImage?.id === action.payload) {
          state.selectedImage = null;
        }
      })
      .addCase(deleteHotelImage.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to delete image";
      });
  },
});

export const { clearSelectedImage, clearImageError } =
  imageSlice.actions;

export default imageSlice.reducer;
