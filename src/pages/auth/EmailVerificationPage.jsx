"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { verifyEmailCode, requestEmailVerificationCode, clearError } from "../../redux/slices/authSlice"
import { motion } from "framer-motion"
import { FiMail, FiArrowRight } from "react-icons/fi"
import toast from "react-hot-toast"

export default function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(0)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, isEmailVerified } = useSelector((state) => state.auth)
  const email = location.state?.email || ""

  useEffect(() => {
    if (isEmailVerified) {
      toast.success("Email verified successfully! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    }
  }, [isEmailVerified])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())

    const verificationCode = code.join("")
    if (verificationCode.length !== 6) {
      toast.error("Please enter all 6 digits")
      return
    }

    const result = await dispatch(verifyEmailCode({ email, verificationCode }))
    if (result.payload) {
      toast.error(result.payload)
    }
  }

  const handleResend = async () => {
    dispatch(clearError())
    const result = await dispatch(requestEmailVerificationCode(email))
    if (!result.payload) {
      toast.success("Verification code sent to your email")
      setResendTimer(60)
    } else {
      toast.error(result.payload)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-green-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">We sent a 6-digit code to {email}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || code.join("").length !== 6}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Verify Email"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0 || loading}
              className="text-green-600 hover:text-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
