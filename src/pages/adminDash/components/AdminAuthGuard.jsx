import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi"

export default function AdminAuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showIdleWarning, setShowIdleWarning] = useState(false)
  const [idleCountdown, setIdleCountdown] = useState(60)

  // Timers
  const idleTimerRef = useRef(null)
  const warningTimerRef = useRef(null)
  const countdownIntervalRef = useRef(null)

  // Configuration
  const IDLE_TIMEOUT = 10 * 60 * 1000 // 10 minutes in milliseconds
  const WARNING_BEFORE_LOGOUT = 60 * 1000 // 60 seconds warning
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123" // Fallback for demo

  // Reset all timers
  const resetIdleTimer = useCallback(() => {
    // Clear existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    
    setShowIdleWarning(false)
    setIdleCountdown(60)

    if (!isAuthenticated) return

    // Set warning timer (9 minutes)
    warningTimerRef.current = setTimeout(() => {
      setShowIdleWarning(true)
      setIdleCountdown(60)
      
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setIdleCountdown((prev) => {
          if (prev <= 1) {
            handleLogout()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, IDLE_TIMEOUT - WARNING_BEFORE_LOGOUT)

    // Set logout timer (10 minutes)
    idleTimerRef.current = setTimeout(() => {
      handleLogout()
    }, IDLE_TIMEOUT)
  }, [isAuthenticated])

  // Handle user activity
  const handleActivity = useCallback(() => {
    if (isAuthenticated && !showIdleWarning) {
      resetIdleTimer()
    }
  }, [isAuthenticated, showIdleWarning, resetIdleTimer])

  // Handle logout
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false)
    setPassword("")
    setShowIdleWarning(false)
    sessionStorage.removeItem("adminAuth")
    
    // Clear all timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
  }, [])

  // Stay active - dismiss warning
  const handleStayActive = () => {
    setShowIdleWarning(false)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    resetIdleTimer()
  }

  // Handle password submission
  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate slight delay for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        sessionStorage.setItem("adminAuth", "true")
        setPassword("")
        resetIdleTimer()
      } else {
        setError("Incorrect password. Please try again.")
        setPassword("")
      }
      setIsLoading(false)
    }, 500)
  }

  // Check session storage on mount
  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth")
    if (savedAuth === "true") {
      setIsAuthenticated(true)
      resetIdleTimer()
    }
  }, [resetIdleTimer])

  // Activity listeners
  useEffect(() => {
    if (!isAuthenticated) return

    const events = ["mousedown", "keydown", "scroll", "touchstart", "mousemove"]
    
    events.forEach((event) => {
      document.addEventListener(event, handleActivity)
    })

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
      
      // Cleanup timers
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }, [isAuthenticated, handleActivity])

  // Render login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-coffee flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-coffee/10 p-4 rounded-full">
              <FiLock className="w-12 h-12 text-coffee" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Admin Access
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your password to access the admin panel
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent outline-none transition"
                  placeholder="Enter admin password"
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2"
                >
                  <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-coffee text-white py-3 rounded-lg font-semibold hover:bg-coffee/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <FiLock size={18} />
                  <span>Access Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              🔒 Secured admin area • Session expires after 10 minutes of inactivity
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  // Render idle warning modal
  return (
    <>
      {children}
      
      <AnimatePresence>
        {showIdleWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              {/* Warning Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-amber-100 p-4 rounded-full">
                  <FiAlertCircle className="w-12 h-12 text-amber-600" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Are you still there?
              </h3>
              <p className="text-center text-gray-600 mb-6">
                You'll be logged out due to inactivity in
              </p>

              {/* Countdown */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-amber-600 mb-2">
                    {idleCountdown}
                  </div>
                  <div className="text-sm text-amber-700 font-medium">
                    seconds remaining
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium cursor-pointer"
                >
                  Logout Now
                </button>
                <button
                  onClick={handleStayActive}
                  className="flex-1 px-4 py-3 bg-coffee text-white rounded-lg hover:bg-coffee/90 transition font-medium cursor-pointer"
                >
                  Stay Active
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}