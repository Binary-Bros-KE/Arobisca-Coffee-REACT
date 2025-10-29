import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Async thunk for fetching hero sliders with cache check
export const fetchHeroSliders = createAsyncThunk(
  "heroSlider/fetchHeroSliders", 
  async (_, { getState, rejectWithValue }) => {
    try {
      const { heroSlider } = getState()
      const cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
      
      // Check if we have recent data (within 24 hours)
      if (heroSlider.lastFetch && (Date.now() - heroSlider.lastFetch) < cacheExpiry) {
        return { data: heroSlider.sliders, fromCache: true }
      }

      const response = await fetch("http://localhost:5000/api/hero-sliders")
      if (!response.ok) throw new Error("Failed to fetch hero sliders")
      const data = await response.json()
      
      return {
        data,
        timestamp: Date.now(),
        fromCache: false
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const heroSliderSlice = createSlice({
  name: "heroSlider",
  initialState: {
    sliders: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  reducers: {
    clearHeroSliders: (state) => {
      state.sliders = []
      state.lastFetch = null
    },
    forceRefresh: (state) => {
      state.lastFetch = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroSliders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchHeroSliders.fulfilled, (state, action) => {
        state.loading = false
        // Only update data if it's not from cache
        if (!action.payload.fromCache) {
          state.sliders = action.payload.data
          state.lastFetch = action.payload.timestamp
        }
      })
      .addCase(fetchHeroSliders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearHeroSliders, forceRefresh } = heroSliderSlice.actions
export default heroSliderSlice.reducer