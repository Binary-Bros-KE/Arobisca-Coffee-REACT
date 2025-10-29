"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { requestPasswordReset, clearError } from "../../redux/slices/authSlice"
import { motion } from "framer-motion"
import { FiMail, FiArrowLeft } from "react-icons/fi"
import toast from "react-hot-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(requestPasswordReset(email))
    if (result.meta.requestStatus === "fulfilled") {
      toast.success(result.payload)
      setSubmitted(true)
      setTimeout(() => navigate("/verify-code", { state: { email } }), 1000)
    } else {
      const errorMessage = result.payload || "An error occured. Try again later";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Link to="/login" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 font-medium">
            <FiArrowLeft className="mr-2" /> Back to Login
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your email to receive a reset code</p>
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

          {submitted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            >
              Reset code sent! Redirecting...
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
