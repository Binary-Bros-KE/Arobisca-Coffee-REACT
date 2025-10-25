"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { logout } from "../../redux/slices/authSlice"
import { fetchUserOrders } from "../../redux/slices/ordersSlice"
import { motion, AnimatePresence } from "framer-motion"
import { FiLogOut, FiUser, FiShoppingBag, FiSettings, FiEdit2, FiLock } from "react-icons/fi"
import EmailVerificationModal from "../../components/EmailVerificationModal"
import toast from "react-hot-toast"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const [newPassword, setNewPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [searchParams] = useSearchParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated, isEmailVerified } = useSelector((state) => state.auth)
  const { orders, loading: ordersLoading } = useSelector((state) => state.orders)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) setActiveTab(tab)
  }, [searchParams])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (user?._id) {
      dispatch(fetchUserOrders(user._id))
    }

    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    })
  }, [isAuthenticated, user, dispatch, navigate])

  const handleLogout = () => {
    dispatch(logout())
    toast.success("You have been successfully logged out")
    navigate("/")
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    toast.success("Profile updated successfully!")
    setEditMode(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    toast.success("Password changed successfully!")
    setCurrentPassword("")
    setNewPassword("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 py-12 px-4">
      <AnimatePresence>
        {!isEmailVerified && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
          />
        )}
      </AnimatePresence>

      <EmailVerificationModal isOpen={!isEmailVerified} userEmail={user?.email} />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
        >
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FiUser className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user?.username}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className="mt-3">
                  {isEmailVerified ? (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                      Unverified
                    </span>
                  )}
                </div>
              </div>

              <nav className="space-y-2">
                {[
                  { id: "profile", label: "Profile", icon: FiUser },
                  { id: "orders", label: "Orders", icon: FiShoppingBag },
                  { id: "settings", label: "Settings", icon: FiSettings },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === id ? "bg-amber-100 text-amber-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-semibold"
              >
                <FiLogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Profile Information</h3>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-all"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    {editMode ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Username</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.username}</p>
                    </div>
                    <div className="pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h3>

                {ordersLoading ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Order ID: {order._id.slice(-8)}</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.orderStatus === "shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-600">₦{order.totalPrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{order.items.length} item(s)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiLock className="w-6 h-6" />
                  Change Password
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Update Password
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
