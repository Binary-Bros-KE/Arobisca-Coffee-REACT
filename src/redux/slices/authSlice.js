import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { apiService } from "../../utils/api"

export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await apiService.login(email, password)
    if (response.success) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response.data))
      return response.data
    }
    return rejectWithValue(response.message)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ username, email, phoneNumber, password, accountType, companyName, address, kraPin }, { rejectWithValue }) => {
    try {
      const response = await apiService.register(username, email, phoneNumber, password, accountType, companyName, address, kraPin)
      if (response.success) {
        return response.data
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.requestPasswordReset(email)
      if (response.success) {
        return response.message
      }
      return rejectWithValue("Failed to send reset code")
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const verifyResetCode = createAsyncThunk(
  "auth/verifyResetCode",
  async ({ email, resetCode }, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyResetCode(email, resetCode)
      if (response.success) {
        return { email, resetCode }
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, resetCode, newPassword }, { rejectWithValue }) => {
    try {
      const response = await apiService.resetPassword(email, resetCode, newPassword)
      if (response.success) {
        return response.message
      }
      return rejectWithValue("Failed to reset password")
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const verifyEmailCode = createAsyncThunk(
  "auth/verifyEmailCode",
  async ({ email, verificationCode }, { rejectWithValue }) => {
    try {
      const response = await apiService.verifyEmailCode(email, verificationCode)
      if (response.success) {
        return response.data
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const requestEmailVerificationCode = createAsyncThunk(
  "auth/requestEmailVerificationCode",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.requestEmailVerificationCode(email)
      if (response.success) {
        return response.message
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Add these new async thunks to your existing authSlice
export const addShippingAddress = createAsyncThunk(
  "auth/addShippingAddress",
  async ({ userId, addressData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const token = auth.token

      const response = await apiService.addShippingAddress(userId, addressData, token)
      if (response.success) {
        return response.data // Updated user with new shipping address
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteShippingAddress = createAsyncThunk(
  "auth/deleteShippingAddress",
  async ({ userId, addressId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const response = await apiService.deleteShippingAddress(userId, addressId, token);
      if (response.success) {
        return response.data; // updated user object from backend
      }
      return rejectWithValue(response.message);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const updateUserPassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ userId, currentPassword, newPassword }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const token = auth.token

      const response = await apiService.updatePassword(userId, currentPassword, newPassword, token)
      if (response.success) {
        return response.message
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ userId, userData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState()
      const token = auth.token

      const response = await apiService.updateUserProfile(userId, userData, token)
      if (response.success) {
        return response.data // Updated user data
      }
      return rejectWithValue(response.message)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
  isAuthenticated: !!(localStorage.getItem("token") && localStorage.getItem("user")),
  resetEmail: null,
  resetCode: null,
  isEmailVerified: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).isEmailVerified : false,
  verificationEmail: null,
  sessionExpiry: localStorage.getItem("sessionExpiry") || null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      state.isEmailVerified = false
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      localStorage.removeItem("sessionExpiry")
    },
    clearError: (state) => {
      state.error = null
    },
    checkSessionExpiry: (state) => {
      const expiry = localStorage.getItem("sessionExpiry")
      if (expiry && Date.now() > Number.parseInt(expiry)) {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.isEmailVerified = false
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("sessionExpiry")
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.isEmailVerified = action.payload.isEmailVerified
        const rememberMe = localStorage.getItem("rememberMe") === "true"
        const expiryHours = rememberMe ? 7 * 24 : 24
        const sessionExpiry = Date.now() + expiryHours * 60 * 60 * 1000
        state.sessionExpiry = sessionExpiry
        localStorage.setItem("sessionExpiry", sessionExpiry)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.verificationEmail = action.payload?.email
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(verifyEmailCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyEmailCode.fulfilled, (state, action) => {
        state.loading = false
        state.isEmailVerified = true
        state.user = { ...state.user, isEmailVerified: true }
        localStorage.setItem("user", JSON.stringify(state.user))
      })
      .addCase(verifyEmailCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(requestEmailVerificationCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestEmailVerificationCode.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(requestEmailVerificationCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(verifyResetCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(verifyResetCode.fulfilled, (state, action) => {
        state.loading = false
        state.resetEmail = action.payload.email
        state.resetCode = action.payload.resetCode
      })
      .addCase(verifyResetCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
        state.resetEmail = null
        state.resetCode = null
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isEmailVerified = action.payload.isEmailVerified // 👈 sync top-level field
        localStorage.setItem("user", JSON.stringify(state.user))
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Add shipping address
      .addCase(addShippingAddress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addShippingAddress.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        localStorage.setItem("user", JSON.stringify(state.user))
      })
      .addCase(addShippingAddress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Delete shipping address
      .addCase(deleteShippingAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShippingAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(deleteShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // Update password
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, clearError, checkSessionExpiry } = authSlice.actions
export default authSlice.reducer
