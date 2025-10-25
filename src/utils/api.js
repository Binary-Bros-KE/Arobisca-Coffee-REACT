// API service for fetching data from backend
const API_BASE_URL = "http://localhost:3000"

export const apiService = {
  // Fetch all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) throw new Error("Failed to fetch categories")
      return await response.json()
    } catch (error) {
      console.error("Error fetching categories:", error)
      throw error
    }
  },

  // Fetch all products
  getProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) throw new Error("Failed to fetch products")
      return await response.json()
    } catch (error) {
      console.error("Error fetching products:", error)
      throw error
    }
  },

  // Fetch products by category
  getProductsByCategory: async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?category=${categoryId}`)
      if (!response.ok) throw new Error("Failed to fetch products by category")
      return await response.json()
    } catch (error) {
      console.error("Error fetching products by category:", error)
      throw error
    }
  },

  // Fetch single product by ID
  getProductById: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`)
      if (!response.ok) throw new Error("Failed to fetch product")
      return await response.json()
    } catch (error) {
      console.error("Error fetching product:", error)
      throw error
    }
  },

  // Auth endpoints
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error logging in:", error)
      throw error
    }
  },

  register: async (username, email, phoneNumber, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, phoneNumber, password }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error registering:", error)
      throw error
    }
  },

  // Password reset endpoints
  requestPasswordReset: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/password/requestPasswordReset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error requesting password reset:", error)
      throw error
    }
  },

  verifyResetCode: async (email, resetCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/password/verifyResetCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error verifying reset code:", error)
      throw error
    }
  },

  resetPassword: async (email, resetCode, newPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/password/resetPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, resetCode, newPassword }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  },

  verifyEmailCode: async (email, verificationCode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verifyEmailCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error verifying email code:", error)
      throw error
    }
  },

  requestEmailVerificationCode: async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/requestEmailVerificationCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error requesting email verification code:", error)
      throw error
    }
  },

  // User endpoints
  getUserProfile: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return await response.json()
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  },

  updateUserProfile: async (userId, userData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })
      return await response.json()
    } catch (error) {
      console.error("Error updating user profile:", error)
      throw error
    }
  },

  // Orders endpoints
  getUserOrders: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/orderByUserId/${userId}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching user orders:", error)
      throw error
    }
  },
}

// Cache management utility
export const cacheManager = {
  set: (key, value, expiryHours = 24) => {
    const expiryTime = Date.now() + expiryHours * 60 * 60 * 1000
    localStorage.setItem(key, JSON.stringify({ value, expiryTime }))
  },

  get: (key) => {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { value, expiryTime } = JSON.parse(cached)
    if (Date.now() > expiryTime) {
      localStorage.removeItem(key)
      return null
    }

    return value
  },

  clear: (key) => {
    localStorage.removeItem(key)
  },
}
