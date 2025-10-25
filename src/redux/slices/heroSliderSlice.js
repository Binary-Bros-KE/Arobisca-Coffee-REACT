import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunk for fetching hero sliders
export const fetchHeroSliders = createAsyncThunk("heroSlider/fetchHeroSliders", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:5000/api/hero-sliders")
    if (!response.ok) throw new Error("Failed to fetch hero sliders")
    const data = await response.json()
    return {
      data,
      timestamp: Date.now(),
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const heroSliderSlice = createSlice({
  name: "heroSlider",
  initialState: {
    sliders: [],
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  reducers: {
    clearHeroSliders: (state) => {
      state.sliders = []
      state.lastFetch = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroSliders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHeroSliders.fulfilled, (state, action) => {
        state.loading = false
        state.sliders = action.payload.data
        state.lastFetch = action.payload.timestamp
      })
      .addCase(fetchHeroSliders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearHeroSliders } = heroSliderSlice.actions
export default heroSliderSlice.reducer
