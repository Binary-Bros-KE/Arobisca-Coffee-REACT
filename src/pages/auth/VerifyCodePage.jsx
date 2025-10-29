"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { verifyResetCode, clearError } from "../../redux/slices/authSlice"
import { motion } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"
import toast from "react-hot-toast"

export default function VerifyCodePage() {
  const [code, setCode] = useState("")
  const [email, setEmail] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())
    const result = await dispatch(verifyResetCode({ email, resetCode: code }))
    console.log(`code result`, result);

    if (result.meta.requestStatus === "fulfilled") {
      toast.success(`Code Verified successfully`)
      navigate("/reset-password", { state: { email, resetCode: code } })
    } else {
      const errorMessage = result.payload || "Login failed";
      toast.error(errorMessage);
    }
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center px-4 py-12 max-md:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Link
            to="/forgot-password"
            className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 font-medium"
          >
            <FiArrowLeft className="mr-2" /> Back
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Verify Code</h1>
            <p className="text-gray-600">Enter the 4-digit code sent to your email</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reset Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength="4"
                required
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="0000"
              />
              <p className="text-xs text-gray-500 mt-2">Enter the 4-digit code</p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 4}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
