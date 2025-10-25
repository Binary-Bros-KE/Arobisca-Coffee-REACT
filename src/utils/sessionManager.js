export const sessionManager = {
  // Set session with expiry
  setSession: (rememberMe = false) => {
    const expiryHours = rememberMe ? 7 * 24 : 24
    const sessionExpiry = Date.now() + expiryHours * 60 * 60 * 1000
    localStorage.setItem("sessionExpiry", sessionExpiry)
    localStorage.setItem("rememberMe", rememberMe)
  },

  // Check if session is expired
  isSessionExpired: () => {
    const expiry = localStorage.getItem("sessionExpiry")
    if (!expiry) return false
    return Date.now() > Number.parseInt(expiry)
  },

  // Get remaining session time in minutes
  getSessionTimeRemaining: () => {
    const expiry = localStorage.getItem("sessionExpiry")
    if (!expiry) return 0
    const remaining = Number.parseInt(expiry) - Date.now()
    return Math.max(0, Math.floor(remaining / 60000))
  },

  // Clear session
  clearSession: () => {
    localStorage.removeItem("sessionExpiry")
    localStorage.removeItem("rememberMe")
  },
}
