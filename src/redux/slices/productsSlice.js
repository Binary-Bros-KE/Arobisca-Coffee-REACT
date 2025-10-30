import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const API_URL = import.meta.env.VITE_SERVER_URL

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()

      return {
        data: data.data,
        timestamp: Date.now(),
        fromCache: false
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = []
      state.lastFetch = null
    },
    forceRefresh: (state) => {
      state.lastFetch = null
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex(item => item._id === action.payload._id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        if (!action.payload.fromCache) {
          state.items = action.payload.data
          state.lastFetch = action.payload.timestamp
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProducts, forceRefresh, updateProduct } = productsSlice.actions
export default productsSlice.reducer