import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:3000/categories")
    if (!response.ok) throw new Error("Failed to fetch categories")
    const data = await response.json()
    return {
      data: data.data,
      timestamp: Date.now(),
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 24 * 60 * 60 * 1000,
  },
  reducers: {
    clearCategories: (state) => {
      state.items = []
      state.lastFetch = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.lastFetch = action.payload.timestamp
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCategories } = categoriesSlice.actions
export default categoriesSlice.reducer
