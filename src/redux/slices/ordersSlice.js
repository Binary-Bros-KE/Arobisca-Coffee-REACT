import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "../../utils/api"

export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (userId, { rejectWithValue }) => {
  try {
    const response = await apiService.getUserOrders(userId)
    if (response.success) {
      return response.data
    }
    return rejectWithValue(response.message)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  orders: [],
  loading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = ordersSlice.actions
export default ordersSlice.reducer
