// Updated Redux slice - ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
const API_URL = import.meta.env.VITE_SERVER_URL

// Fetch ALL orders at once
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/orders?limit=1000`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to fetch orders")
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, orderStatus, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, adminNotes }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to update order")
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Update payment status
export const updatePaymentStatus = createAsyncThunk(
  "orders/updatePaymentStatus",
  async ({ orderId, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/payment-status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to update payment status")
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Get order statistics
export const fetchOrderStats = createAsyncThunk(
  "orders/fetchOrderStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/orders/stats/overview`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to fetch stats")
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


// Fetch orders by user ID
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/orders/user/${userId}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.message || "Failed to fetch user orders")
      return data.data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    allOrders: [], // Store ALL orders here
    userOrders: [],
    currentTab: 'all',
    loading: false,
    userOrdersLoading: false,
    error: null,
    stats: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0
    },
    filters: {
      paymentMethod: 'all',
      paymentStatus: 'all',
      dateRange: 'all'
    }
  },
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    },
    refreshOrders: (state) => {
      // This will trigger a refetch when manually refreshed
      state.allOrders = []
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.allOrders = action.payload
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload
        const index = state.allOrders.findIndex(order => order._id === updatedOrder._id)
        if (index !== -1) {
          state.allOrders[index] = updatedOrder
        }
      })
      // Update payment status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload
        const index = state.allOrders.findIndex(order => order._id === updatedOrder._id)
        if (index !== -1) {
          state.allOrders[index] = updatedOrder
        }
      })
      // Fetch stats
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrdersLoading = false
        state.userOrders = action.payload
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false
        state.error = action.payload
      })
  },
})

export const { setCurrentTab, setFilters, clearError, refreshOrders } = ordersSlice.actions
export default ordersSlice.reducer