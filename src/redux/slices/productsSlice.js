import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("http://localhost:3000/products")
    if (!response.ok) throw new Error("Failed to fetch products")
    const data = await response.json()
    return {
      data: data.data,
      timestamp: Date.now(),
    }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 24 * 60 * 60 * 1000,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = []
      state.lastFetch = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data
        state.lastFetch = action.payload.timestamp
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProducts } = productsSlice.actions
export default productsSlice.reducer
