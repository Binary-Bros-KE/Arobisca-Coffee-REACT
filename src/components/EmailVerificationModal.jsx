"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { verifyEmailCode, requestEmailVerificationCode } from "../redux/slices/authSlice"
import { motion } from "framer-motion"
import { FiX } from "react-icons/fi"
import toast from "react-hot-toast"

export default function EmailVerificationModal({ isOpen, userEmail }) {
  const [code, setCode] = useState(["", "", "", ""])
  const [resendTimer, setResendTimer] = useState(0)
  const dispatch = useDispatch()
  const { loading, error } = useSelector((state) => state.auth)

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      document.getElementById(`modal-code-${index + 1}`)?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const verificationCode = code.join("")
    if (verificationCode.length !== 6) {
      toast.error("Please enter all 6 digits")
      return
    }

    const result = await dispatch(verifyEmailCode({ email: userEmail, verificationCode }))
    if (!result.payload) {
      toast.success("Email verified successfully!")
      setCode(["", "", "", ""])
    }
  }

  const handleResend = async () => {
    const result = await dispatch(requestEmailVerificationCode(userEmail))
    if (!result.payload) {
      toast.success("Verification code sent to your email"),
      setResendTimer(60)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amber-900">Verify Your Email</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <FiX size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          We sent a 6-digit code to <span className="font-semibold">{userEmail}</span>
        </p>

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
                id={`modal-code-${index}`}
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
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
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
      </motion.div>
    </motion.div>
  )
}
