"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { addShippingAddress, deleteShippingAddress, logout, updateUserPassword, updateUserProfile } from "../../redux/slices/authSlice"
import { motion, AnimatePresence } from "framer-motion"
import { FiLogOut, FiUser, FiShoppingBag, FiSettings, FiEdit2, FiLock } from "react-icons/fi"
import EmailVerificationModal from "../../components/EmailVerificationModal"
import toast from "react-hot-toast"
import { MdDeleteOutline } from "react-icons/md"
import { FiEye, FiEyeOff } from "react-icons/fi"
import UserOrdersWidget from "./UserOrdersWidget"

const PersonalInfoWidget = ({ user, editMode, setEditMode, formData, setFormData, handleUpdateProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {user.accountType === "business" ?
            "Business Information" :
            "Personal Information"
          }
        </h3>
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
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {user.accountType === "business" && (
            <>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Company Name</p>
                <p className="text-lg font-semibold text-gray-800">{user?.companyName}</p>
              </div>
              <div className="pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600">Company Address</p>
                <p className="text-lg font-semibold text-gray-800">{user?.address}</p>
              </div>
            </>
          )}
          {user.accountType === "personal" && (
            <div className="pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">Username</p>
              <p className="text-lg font-semibold text-gray-800">{user?.username}</p>
            </div>
          )}
          <div className="pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Email</p>
            <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
          </div>
          <div className="pb-4 border-b border-gray-200">
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="text-lg font-semibold text-gray-800">{user?.phoneNumber}</p>
          </div>

        </div>
      )}
    </motion.div>
  )
}


const ShippingAddressesWidget = ({
  user,
  shippingAddress,
  setShippingAddress,
  showAddressForm,
  setShowAddressForm,
  shippingAddresses,
  handleAddShippingAddress,
  handleDeleteShippingAddress, // ⬅️ add this
}) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Shipping Addresses</h3>
        <button
          onClick={() => setShowAddressForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all cursor-pointer"
        >
          <FiEdit2 className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {showAddressForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleAddShippingAddress}
          className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3 border border-gray-200"
        >
          <h4 className="font-semibold text-gray-800 mb-2">Add New Address</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, Suite, etc. (Optional)</label>
            <input
              type="text"
              value={shippingAddress.apartment}
              onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all font-medium cursor-pointer"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowAddressForm(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all font-medium cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {shippingAddresses.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FiEdit2 className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">No shipping addresses added yet.</p>
          <button
            onClick={() => setShowAddressForm(true)}
            className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
          >
            Add your first address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {shippingAddresses.map((address, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-lg">
                    {address.firstName} {address.lastName}
                  </p>
                  <p className="text-gray-600 mt-1">{address.address}</p>
                  {address.apartment && (
                    <p className="text-gray-600 text-sm">{address.apartment}</p>
                  )}
                  <p className="text-gray-600 mt-1">
                    {address.city}, {address.postalCode}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleDeleteShippingAddress(address._id)}
                    className="text-red-600 hover:text-red-700 p-2 bg-red-600/20 rounded-full cursor-pointer"
                  >
                    <MdDeleteOutline className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {index === 0 && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  Default
                </span>
              )}
            </div>
          ))}
        </div>
      )
      }
    </motion.div >
  )
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({})
  const [newPassword, setNewPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [searchParams] = useSearchParams()
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
  })
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [shippingAddresses, setShippingAddresses] = useState([])
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)


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

    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    })
  }, [isAuthenticated, user, dispatch, navigate])

  // Add these functions to your UserDashboard component
  const handleAddShippingAddress = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(
        addShippingAddress({
          userId: user._id,
          addressData: shippingAddress,
        })
      ).unwrap();

      console.log("Address Results", result);

      toast.success("Shipping address added successfully!");
      setShowAddressForm(false);
      setShippingAddress({
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        postalCode: "",
      });
    } catch (error) {
      console.error("Add Address Error:", error);
      toast.error(error || "Failed to add shipping address");
    }
  };

  const handleDeleteShippingAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      await dispatch(deleteShippingAddress({ userId: user._id, addressId })).unwrap();

      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Delete Address Error:", error);
      toast.error(error || "Failed to delete address");
    }
  };



  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    try {
      await dispatch(updateUserProfile({
        userId: user._id,
        userData: formData
      })).unwrap()

      toast.success("Profile updated successfully!")
      setEditMode(false)
    } catch (error) {
      toast.error(error || "Failed to update profile")
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateUserPassword({
      userId: user._id,
      currentPassword,
      newPassword
    }));

    if (updateUserPassword.fulfilled.match(result)) {
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      console.error("Change Password Error:", result.payload || result.error);
      toast.error(result.payload || "Failed to change password");
    }
  };



  // Load shipping addresses when user data is available
  useEffect(() => {
    if (user?.shippingAddresses) {
      setShippingAddresses(user.shippingAddresses)
    }
  }, [user])

  const handleLogout = () => {
    dispatch(logout())
    toast.success("You have been successfully logged out")
    navigate("/")
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

      <div className="max-w-7xl mx-auto">
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
                <p className="text-sm text-gray-600 mb-2">{user?.email}</p>
                <span className="bg-green-600/10 border border-green-600 rounded-full px-2 w-fit py-0 text-green-600 capitalize">{user?.accountType} Account</span>
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${activeTab === id ? "bg-amber-100 text-amber-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
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
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Personal Info Widget */}
                <PersonalInfoWidget
                  user={user}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  formData={formData}
                  setFormData={setFormData}
                  handleUpdateProfile={handleUpdateProfile}
                />

                {/* Shipping Addresses Widget */}
                <ShippingAddressesWidget
                  user={user}
                  shippingAddress={shippingAddress}
                  setShippingAddress={setShippingAddress}
                  showAddressForm={showAddressForm}
                  setShowAddressForm={setShowAddressForm}
                  shippingAddresses={shippingAddresses}
                  handleAddShippingAddress={handleAddShippingAddress}
                  handleDeleteShippingAddress={handleDeleteShippingAddress} // ⬅️ add this line
                />

              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <UserOrdersWidget user={user} />
            )}

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
                  {/* --- Current Password Field --- */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10 placeholder:text-gray-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>

                  {/* --- New Password Field --- */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10 placeholder:text-gray-300"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
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
