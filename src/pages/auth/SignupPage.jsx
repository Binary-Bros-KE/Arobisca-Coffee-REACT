"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { registerUser, clearError } from "../../redux/slices/authSlice"
import { motion } from "framer-motion"
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiBriefcase, FiMapPin, FiFileText } from "react-icons/fi"
import toast from "react-hot-toast"

export default function SignupPage() {
  const [accountType, setAccountType] = useState("personal") // "personal" or "business"
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    // Business fields
    companyName: "",
    address: "",
    kraPin: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAccountTypeChange = (type) => {
    setAccountType(type)
    // Clear business fields when switching to personal account
    if (type === "personal") {
      setFormData(prev => ({
        ...prev,
        companyName: "",
        address: "",
        kraPin: ""
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(clearError())

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Validate business fields if business account
    if (accountType === "business") {
      if (!formData.companyName || !formData.address || !formData.kraPin) {
        toast.error("Please fill all business fields")
        return
      }
    }

    const userData = {
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      accountType: accountType,
      // Include business fields only for business accounts
      ...(accountType === "business" && {
        companyName: formData.companyName,
        address: formData.address,
        kraPin: formData.kraPin
      })
    }

    const result = await dispatch(registerUser(userData))

    console.log(`result`, result)

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Account created successfully!")
      navigate("/verify-email", { state: { email: formData.email } })
    } else if (result.error) {
      toast.error(result.payload)
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join AROBISCA Coffee community</p>
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

          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleAccountTypeChange("personal")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all cursor-pointer ${accountType === "personal"
                  ? "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-amber-300"
                  }`}
              >
                <FiUser className="inline-block mr-2" />
                Personal
              </button>
              <button
                type="button"
                onClick={() => handleAccountTypeChange("business")}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all cursor-pointer ${accountType === "business"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-green-300"
                  }`}
              >
                <FiBriefcase className="inline-block mr-2" />
                Business
              </button>
            </div>
          </div>


          {/* Business Fields - Conditionally Rendered */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200 mb-4"
          >
            <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
              <FiBriefcase className="mr-2" />
              Benefits of a Business Account
            </h3>
            <ul className="text-xs list-disc ml-5">
              <li>Enjoy Bulk Orders</li>
              <li>Payment Options: Cheque, Bank Transfer, M-pesa, Cash </li>
              <li>Credit: 5, 10, 20, 30 Days</li>
              <li>B2B Offers </li>
            </ul>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}

            {accountType === "personal" &&
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            }

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {/* Business Fields - Conditionally Rendered */}
            {accountType === "business" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200"
              >
                <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                  <FiBriefcase className="mr-2" />
                  Business Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Company Name</label>
                  <div className="relative">
                    <FiBriefcase className="absolute left-3 top-3.5 text-green-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required={accountType === "business"}
                      className="w-full pl-10 pr-4 py-2.5 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-green-300 bg-white"
                      placeholder="Your Company Ltd"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">Business Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3.5 text-green-400" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required={accountType === "business"}
                      className="w-full pl-10 pr-4 py-2.5 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-green-300 bg-white"
                      placeholder="Full business address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">KRA Pin</label>
                  <div className="relative">
                    <FiFileText className="absolute left-3 top-3.5 text-green-400" />
                    <input
                      type="text"
                      name="kraPin"
                      value={formData.kraPin}
                      onChange={handleChange}
                      required={accountType === "business"}
                      className="w-full pl-10 pr-4 py-2.5 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-green-300 bg-white"
                      placeholder="A123456789X"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Password Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3.5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer ${accountType === "business"
                ? "bg-gradient-to-r from-green-600 to-green-700"
                : "bg-gradient-to-r from-amber-600 to-amber-700"
                }`}
            >
              {loading ? "Creating Account..." : `Create ${accountType === "business" ? "Business" : "Personal"} Account`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}