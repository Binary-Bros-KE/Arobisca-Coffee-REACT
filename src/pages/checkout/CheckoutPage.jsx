"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FiBriefcase, FiDollarSign, FiMapPin, FiUser } from "react-icons/fi"
import { Loader } from "lucide-react"
import toast from "react-hot-toast"
import MpesaPayment from "./components/MpesaPayment"
import { MdOutlinePermContactCalendar } from "react-icons/md"
import { LiaShippingFastSolid } from "react-icons/lia"
import { GoCreditCard } from "react-icons/go"
import { FaRegNoteSticky } from "react-icons/fa6"
import { logout } from "../../redux/slices/authSlice"

const API_URL = import.meta.env.VITE_SERVER_URL

export default function CheckoutPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
  })
  const [billingAddress, setBillingAddress] = useState(null)
  const [useDifferentBilling, setUseDifferentBilling] = useState(false)
  const [shippingMethod, setShippingMethod] = useState("within")
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [deliveryNote, setDeliveryNote] = useState("")
  const [shippingMethods, setShippingMethods] = useState([])
  const [showMpesaPopup, setShowMpesaPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [transactionData, setTransactionData] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(false)
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  // Add these near your other state declarations
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError] = useState("")

  // Business Info
  const [accountType, setAccountType] = useState("personal") // "personal" or "business"
  const [businessInfo, setBusinessInfo] = useState({
    companyName: "",
    kraPin: "",
    businessAddress: ""
  })
  const [creditTerms, setCreditTerms] = useState({
    enabled: false,
    paymentMethod: "", // "cheque", "bank_transfer", "mpesa", "cash"
    creditDays: 0
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { items: cartItems, totalPrice } = useSelector((state) => state.cart)

  // Check if cart contains Business Supply products
  const hasBusinessSupplyProducts = () => {
    return cartItems.some(item => item.proCategoryId?._id === "690af3de95c9811f74993d69")
  }

  // Check if user can checkout with current account type
  const canCheckout = () => {
    const isPersonalAccount = isAuthenticated ? user?.accountType === 'personal' : accountType === 'personal'
    return !(hasBusinessSupplyProducts() && isPersonalAccount)
  }


  // Add this near your other state declarations
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null)

  // Add this function to check COD availability
  const isCodAvailableForSelectedLocation = () => {
    if (!selectedShippingMethod) return false
    return selectedShippingMethod.codAvailable === true
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const selectedShipping = shippingMethods.find((m) => m._id === shippingMethod)
  const shippingCost = selectedShipping ? selectedShipping.amount : 0
  const totalWithShipping = totalPrice + shippingCost

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty")
      navigate("/products")
      return
    }

    if (isAuthenticated && user) {
      setEmail(user.email)
      setPhone(user.phoneNumber)
    }

    fetchShippingMethods()
  }, [cartItems, isAuthenticated, user, navigate])

  useEffect(() => {
    // If COD is selected but becomes unavailable, switch to M-Pesa
    if (paymentMethod === "cod" && !isCodAvailableForSelectedLocation()) {
      setPaymentMethod("mpesa")
      toast.error("Cash on Delivery not available for selected location. Switched to M-Pesa.")
    }
  }, [selectedShippingMethod, paymentMethod])

  const fetchShippingMethods = async () => {
    try {
      const response = await fetch(`${API_URL}/shipping-fees`) // ✅ match your backend route
      const data = await response.json()
      if (data.success) {
        setShippingMethods(data.data)
      }
    } catch (error) {
      console.error("Error fetching shipping methods:", error)
    }
  }

  // Coupon calculation logic
  const calculateDiscount = () => {
    if (!appliedCoupon) return 0

    if (appliedCoupon.discountType === 'percentage') {
      return (totalPrice * appliedCoupon.discountAmount) / 100
    } else {
      return appliedCoupon.discountAmount
    }
  }

  const calculateVAT = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.offerPrice || item.price || 0;
      const itemVAT = item.vat || 0; // Assuming product.vat is a percentage (e.g., 16)
      const vatAmount = (itemPrice * item.quantity * itemVAT) / 100;
      return total + vatAmount;
    }, 0);
  };

  const calculateSubtotalBeforeVAT = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.offerPrice || item.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };


  const handleLogout = () => {
    dispatch(logout())
    toast.success("You have been successfully logged out")
  }

  const vatTotal = calculateVAT();
  const subtotalBeforeVAT = calculateSubtotalBeforeVAT(); // or use totalPrice if it already excludes VAT

  // With these:
  const discountAmount = calculateDiscount()
  const totalAfterDiscount = Math.max(0, totalPrice - discountAmount)
  const totalAfterVAT = totalAfterDiscount + vatTotal
  const finalTotal = totalAfterVAT + shippingCost

  // Check if coupon meets minimum purchase requirement
  const meetsMinimumPurchase = appliedCoupon ?
    totalPrice >= appliedCoupon.minimumPurchaseAmount : true


  // Apply coupon function
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }

    setCouponLoading(true)
    setCouponError("")

    try {
      const productIds = cartItems.map(item => item._id)
      const purchaseAmount = totalPrice

      const response = await fetch(`${API_URL}/couponCodes/check-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponCode: couponCode.trim().toUpperCase(),
          productIds,
          purchaseAmount
        })
      })

      const data = await response.json()

      if (data.success) {
        setAppliedCoupon(data.data)
        toast.success("Coupon applied successfully!")
        setCouponCode("")
      } else {
        setCouponError(data.message)
        setAppliedCoupon(null)
      }
    } catch (error) {
      console.error("Error applying coupon:", error)
      setCouponError("Failed to apply coupon. Please try again.")
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  // Remove coupon function
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError("")
    toast.success("Coupon removed")
  }

  const validateForm = () => {
    const errors = {}
    if (!email) errors.email = "Email is required"
    if (!phone) errors.phone = "Phone is required"
    if (!shippingAddress.firstName) errors.firstName = "First name is required"
    if (!shippingAddress.address) errors.address = "Address is required"
    if (!shippingAddress.city) errors.city = "City is required"
    if (useDifferentBilling && !billingAddress?.firstName) errors.billingFirstName = "Billing first name is required"

    // Validate business fields for guest business users
    if ((!isAuthenticated && accountType === "business") ||
      (isAuthenticated && user?.accountType === 'business')) {
      if (!businessInfo.companyName && !user?.companyName) errors.companyName = "Company name is required"
      if (!businessInfo.kraPin && !user?.kraPin) errors.kraPin = "KRA pin is required"
      if (!businessInfo.businessAddress && !user?.address) errors.businessAddress = "Business address is required"
    }

    // Validate credit terms if credit payment is selected
    if (paymentMethod === "credit") {
      if (!creditTerms.creditDays) {
        toast.error("Please select credit period")
        return false
      }
      if (!creditTerms.paymentMethod) {
        toast.error("Please select preferred payment method")
        return false
      }
    }

    // Add COD validation
    if (paymentMethod === "cod" && !isCodAvailableForSelectedLocation()) {
      toast.error("Cash on Delivery is not available for the selected location")
      return false
    }

    if (!selectedShippingMethod) {
      toast.error("Please Select a Shipping Location");
      return false
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // ✅ UPDATE: Make handleOrderSubmit accept transaction data as parameter
  const handleOrderSubmit = async (mpesaTransactionData = null) => {
    try {
      setIsSubmitting(true)

      // Check if COD is selected but not available for location
      if (paymentMethod === "cod" && !isCodAvailableForSelectedLocation()) {
        toast.error("Cash on delivery not available for selected location")
        setIsSubmitting(false)
        return
      }

      // Check if coupon doesn't meet minimum purchase requirement
      if (appliedCoupon && !meetsMinimumPurchase) {
        toast.error(`Coupon requires minimum purchase of KES ${appliedCoupon.minimumPurchaseAmount}`)
        setIsSubmitting(false)
        return
      }

      const orderData = {
        user: isAuthenticated ? user._id : null,
        items: cartItems,
        shippingAddress: { ...shippingAddress, email, phone },
        billingAddress: useDifferentBilling ? billingAddress : { ...shippingAddress, email, phone },
        shippingMethod,
        paymentMethod,
        deliveryNote,
        transactionData: mpesaTransactionData, // Use the structured M-Pesa data
        coupon: appliedCoupon ? {
          code: appliedCoupon.couponCode,
          discountType: appliedCoupon.discountType,
          discountAmount: appliedCoupon.discountAmount,
          appliedDiscount: discountAmount
        } : null,
        subtotal: totalPrice,
        vatTotal, // Add VAT total
        discount: discountAmount,
        shipping: shippingCost,
        total: finalTotal,

        // Add new fields
        accountType: isAuthenticated ? user.accountType : accountType,
        ...((!isAuthenticated && accountType === "business") && {
          businessInfo: businessInfo
        }),
        ...(paymentMethod === "credit" && {
          creditTerms: creditTerms
        })
      }

      console.log('🔄 Sending order data to server:', orderData)

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()
      console.log('🔄 Order response from server:', data)

      if (response.ok) {
        toast.success("Order placed successfully!")
        navigate("/checkout/success", { state: { order: data.data } })
      } else {
        toast.error(data.message || "Order failed")
      }
    } catch (error) {
      toast.error("An error occurred while placing the order")
      console.error("❌ Order submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix errors in the form")
      return
    }

    // Validate coupon minimum purchase
    if (appliedCoupon && !meetsMinimumPurchase) {
      toast.error(`Coupon requires minimum purchase of KES ${appliedCoupon.minimumPurchaseAmount}`)
      return
    }

    if (paymentMethod === "mpesa") {
      setShowMpesaPopup(true)
    } else {
      setPaymentStatus(true)
      handleOrderSubmit()
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={(e) => {
              e.preventDefault()

              // Check if personal account trying to checkout business products
              if (!canCheckout()) {
                toast.error("Business Supply products require a Business Account")
                return
              }

              handleSubmit(e)
            }} className="space-y-6">

              {/* Business Supply Alert */}
              {hasBusinessSupplyProducts() && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-2xl shadow-lg p-6 border-2 ${canCheckout()
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-amber-50 border-amber-400'
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <FiBriefcase className={`w-8 h-8 flex-shrink-0 ${canCheckout() ? 'text-blue-600' : 'text-amber-600'
                      }`} />
                    <div className="flex-1">
                      {canCheckout() ? (
                        <>
                          <h3 className="text-lg font-bold text-blue-800 mb-2">
                            Business Supply Order
                          </h3>
                          <p className="text-blue-700">
                            Your cart contains Business Supply products. You're checking out with a Business Account. ✓
                          </p>
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold text-amber-800 mb-2">
                            ⚠️ Business Account Required
                          </h3>
                          <p className="text-amber-700 mb-3">
                            Your cart contains Business Supply products that can only be purchased with a Business Account.
                          </p>
                          {!isAuthenticated ? (
                            <button
                              type="button"
                              onClick={() => {
                                setAccountType("business")
                                toast.success("Switched to Business Account")
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
                            >
                              Switch to Business Account
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                handleLogout()
                                setAccountType("business")
                              }}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2 cursor-pointer"
                            >
                              <FiUser className="w-4 h-4" />
                              Logout & Register Business Account
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <MdOutlinePermContactCalendar className="w-6 h-6 text-amber-600" />
                    Contact Information
                  </div>
                  {!user && !isAuthenticated &&
                    <span className="text-primary text-xs font-light ">(Login to use saved info)</span>
                  }
                </h2>

                {/* Account Type Toggle - Only for guest users */}
                {!isAuthenticated && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setAccountType("personal")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${accountType === "personal"
                          ? "border-amber-500 bg-amber-50 text-amber-700"
                          : "border-gray-300 bg-white text-gray-600 hover:border-amber-300"
                          }`}
                      >
                        <FiUser className="inline-block mr-2" />
                        Personal
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType("business")}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${accountType === "business"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 bg-white text-gray-600 hover:border-green-300"
                          }`}
                      >
                        <FiBriefcase className="inline-block mr-2" />
                        Business
                      </button>
                    </div>
                  </div>
                )}

                {/* For logged-in users, show account type info */}
                {isAuthenticated && user && (
                  <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-700 font-medium">
                      {user.accountType === 'business' ? 'Business Account' : 'Personal Account'}
                      {user.accountType === 'business' && user.companyName && ` - ${user.companyName}`}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300 ${formErrors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="your@email.com"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300 ${formErrors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="+254..."
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                </div>

                {/* Business Information Fields - Show for guest business or logged-in business users */}
                {(accountType === "business" || (isAuthenticated && user?.accountType === 'business')) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-green-800 flex items-center">
                      <FiBriefcase className="mr-2" />
                      Business Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={businessInfo.companyName || (isAuthenticated && user?.companyName) || ""}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, companyName: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-green-300 bg-white"
                        placeholder="Your Company Ltd"
                        disabled={isAuthenticated && user?.companyName} // Disable if already set in user profile
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">KRA Pin</label>
                      <input
                        type="text"
                        value={businessInfo.kraPin || (isAuthenticated && user?.kraPin) || ""}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, kraPin: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-green-300 bg-white"
                        placeholder="A123456789X"
                        disabled={isAuthenticated && user?.kraPin}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">Business Address</label>
                      <input
                        type="text"
                        value={businessInfo.businessAddress || (isAuthenticated && user?.address) || ""}
                        onChange={(e) => setBusinessInfo({ ...businessInfo, businessAddress: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-green-300 bg-white"
                        placeholder="Full business address"
                        disabled={isAuthenticated && user?.address}
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>


              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiMapPin className="w-6 h-6 text-amber-600" />
                  Delivery Address
                </h2>

                {/* Address Selection */}
                {user?.shippingAddresses?.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <p className="text-gray-700 font-medium mb-2">Select a saved address:</p>

                    {user.shippingAddresses.map((addr, idx) => (
                      <label
                        key={addr._id || idx}
                        className={`block border-2 rounded-xl p-4 cursor-pointer transition-all ${shippingAddress._id === addr._id
                          ? "border-amber-600 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                          }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={shippingAddress._id === addr._id}
                          onChange={() => setShippingAddress(addr)}
                          className="hidden"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {addr.firstName} {addr.lastName}
                          </span>
                          <span className="text-gray-600 text-sm">
                            {addr.address}, {addr.city}
                          </span>
                          {addr.apartment && (
                            <span className="text-gray-500 text-sm">{addr.apartment}</span>
                          )}
                          <span className="text-gray-600 text-sm">Postal Code: {addr.postalCode}</span>
                        </div>
                      </label>
                    ))}

                    {/* Toggle Add New Address Button */}
                    {user.shippingAddresses.length < 3 ? (
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm((prev) => !prev)}
                        className="mt-2 px-4 py-2 border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition cursor-pointer"
                      >
                        {showAddAddressForm ? "Cancel" : "Add New Address"}
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2 italic">
                        You’ve reached the maximum of 3 saved addresses.
                      </p>
                    )}
                  </div>
                )}

                {/* Add New Address Form */}
                {(!user?.shippingAddresses?.length || showAddAddressForm) && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                        <input
                          type="text"
                          value={shippingAddress.firstName}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-gray-300 ${formErrors.firstName ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="John"
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                        <input
                          type="text"
                          value={shippingAddress.lastName}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                          }
                          className="placeholder:text-gray-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, address: e.target.value })
                        }
                        className={`placeholder:text-gray-300 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${formErrors.address ? "border-red-500" : "border-gray-300"
                          }`}
                        placeholder="123 Main Street"
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment/Suite (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.apartment}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, apartment: e.target.value })
                        }
                        className="placeholder:text-gray-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Apt 4B"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, city: e.target.value })
                          }
                          className={`placeholder:text-gray-300 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${formErrors.city ? "border-red-500" : "border-gray-300"
                            }`}
                          placeholder="Nairobi"
                        />
                        {formErrors.city && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) =>
                            setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                          }
                          className="placeholder:text-gray-300 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="00100"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>


              {/* Shipping Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 ">
                  <LiaShippingFastSolid className="w-6 h-6 text-amber-600" />
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method._id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${shippingMethod === method._id
                        ? "border-amber-600 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method._id}
                        checked={shippingMethod === method._id}
                        onChange={(e) => {
                          setShippingMethod(e.target.value)
                          setSelectedShippingMethod(method) // Store the selected method object
                        }}
                        className="w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <span className="font-medium text-gray-800">
                          {method.destination}
                        </span>
                        <p className="text-sm text-amber-600 font-medium">
                          Pickup: <span className="text-sm text-gray-600 font-normal">{method.pickupStation}</span>
                        </p>
                        <p className="text-sm text-amber-600 font-medium">
                          Distance: <span className="text-sm text-gray-600 font-normal">{method.distance} km</span>
                        </p>
                        {/* COD Availability Badge */}
                        {method.codAvailable && (
                          <p className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block mt-1">
                            COD Available
                          </p>
                        )}
                      </div>
                      <span className="text-amber-600 font-bold">
                        {method.amount === 0 ? "FREE!" : `KES ${method.amount.toLocaleString()}`}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Payment Method */}
              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FiDollarSign className="w-6 h-6 text-amber-600" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    { id: "mpesa", label: "M-Pesa", description: "Pay via M-Pesa STK Push" },
                    {
                      id: "cod",
                      label: "Cash on Delivery",
                      description: "Pay when you receive your order",
                      disabled: !isCodAvailableForSelectedLocation()
                    },
                    // Add Credit option only for business accounts
                    ...((accountType === "business" || (isAuthenticated && user?.accountType === 'business'))
                      ? [{
                        id: "credit",
                        label: "Credit Purchase",
                        description: "Pay later with credit terms (B2B Only)",
                        disabled: false
                      }]
                      : [])
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-lg transition-all ${paymentMethod === method.id
                        ? method.disabled
                          ? "border-gray-400 bg-gray-100"
                          : method.id === "credit"
                            ? "border-blue-600 bg-blue-50"
                            : "border-green-600 bg-green-50"
                        : method.disabled
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : method.id === "credit"
                            ? "border-gray-200 hover:border-blue-300 cursor-pointer"
                            : "border-gray-200 hover:border-green-300 cursor-pointer"
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => !method.disabled && setPaymentMethod(e.target.value)}
                        disabled={method.disabled}
                        className={`w-4 h-4 ${method.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      />
                      <div className="ml-3 flex-1">
                        <p className={`font-medium ${method.disabled ? 'text-gray-500' : 'text-gray-800'}`}>
                          {method.label}
                          {method.disabled && (
                            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              Unavailable
                            </span>
                          )}
                        </p>
                        <p className={`text-sm ${method.disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                          {method.description}
                        </p>

                        {/* COD Unavailable Message */}
                        {method.id === "cod" && method.disabled && (
                          <p className="text-xs text-red-500 mt-1 bg-red-50 px-2 py-1 rounded border border-red-200">
                            Selected location does not have Cash on Delivery
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {/* Credit Terms Section - Only show when credit is selected and user is business */}
                {paymentMethod === "credit" && (accountType === "business" || (isAuthenticated && user?.accountType === 'business')) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-blue-800">Credit Terms</h3>

                    {/* Credit Days Selection */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Credit Period</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[5, 10, 20, 30].map((days) => (
                          <button
                            type="button"
                            key={days}
                            onClick={() => setCreditTerms({ ...creditTerms, creditDays: days })}
                            className={`py-2 px-3 rounded-lg border-2 transition-all ${creditTerms.creditDays === days
                              ? "border-blue-600 bg-blue-100 text-blue-700"
                              : "border-gray-300 bg-white text-gray-600 hover:border-blue-300"
                              }`}
                          >
                            {days} Days
                          </button>
                        ))}
                      </div>
                      {!creditTerms.creditDays && (
                        <p className="text-red-500 text-sm mt-1">Please select a credit period</p>
                      )}
                    </div>

                    {/* Payment Method Selection for Credit */}
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">Preferred Payment Method</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: "cheque", label: "Cheque" },
                          { id: "bank_transfer", label: "Bank Transfer" },
                          { id: "mpesa", label: "M-Pesa" },
                          { id: "cash", label: "Cash" }
                        ].map((method) => (
                          <button
                            type="button"
                            key={method.id}
                            onClick={() => setCreditTerms({ ...creditTerms, paymentMethod: method.id })}
                            className={`py-2 px-3 rounded-lg border-2 transition-all ${creditTerms.paymentMethod === method.id
                              ? "border-blue-600 bg-blue-100 text-blue-700"
                              : "border-gray-300 bg-white text-gray-600 hover:border-blue-300"
                              }`}
                          >
                            {method.label}
                          </button>
                        ))}
                      </div>
                      {!creditTerms.paymentMethod && (
                        <p className="text-red-500 text-sm mt-1">Please select a payment method</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Billing Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <GoCreditCard className="h-6 w-6 text-amber-600" />
                  Billing Address
                </h2>
                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={!useDifferentBilling}
                    onChange={(e) => setUseDifferentBilling(!e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 text-gray-700">Same as shipping address</span>
                </label>

                <AnimatePresence>
                  {useDifferentBilling && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="First Name"
                          value={billingAddress?.firstName || ""}
                          onChange={(e) => setBillingAddress({ ...billingAddress, firstName: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Last Name"
                          value={billingAddress?.lastName || ""}
                          onChange={(e) => setBillingAddress({ ...billingAddress, lastName: e.target.value })}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Address"
                        value={billingAddress?.address || ""}
                        onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={billingAddress?.city || ""}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Delivery Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FaRegNoteSticky className="w-6 h-6 text-amber-600" />
                  Delivery Instructions (Optional)
                </h2>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="Add any special instructions for delivery..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </motion.div>

              {/* Place Order Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                type="submit"
                disabled={isSubmitting || (appliedCoupon && !meetsMinimumPurchase) || !canCheckout()}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${!canCheckout()
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:shadow-lg cursor-pointer'
                  } disabled:opacity-50`}
              >
                {!canCheckout() ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiBriefcase className="w-5 h-5" />
                    Business Account Required for Checkout
                  </span>
                ) : isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Place Order - KES ${finalTotal.toLocaleString()}`
                )}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-8 sticky top-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h3>

              {/* Coupon Section */}
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={couponLoading || !!appliedCoupon}
                  />
                  {!appliedCoupon ? (
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50 cursor-pointer"
                    >
                      {couponLoading ? <Loader className="w-5 h-5 animate-spin text-white" /> : "Apply"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="text-red-500 text-sm mt-1">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-green-800">
                          {appliedCoupon.couponCode} Applied
                        </p>
                        <p className="text-sm text-green-600">
                          {appliedCoupon.discountType === 'percentage'
                            ? `${appliedCoupon.discountAmount}% off`
                            : `KES ${appliedCoupon.discountAmount} off`
                          }
                        </p>
                        {!meetsMinimumPurchase && (
                          <p className="text-xs text-red-500 mt-1">
                            Minimum purchase of KES {appliedCoupon.minimumPurchaseAmount} required
                          </p>
                        )}
                      </div>
                      <span className="text-green-600 font-bold">
                        - KES {discountAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {/* Inside the cart items display in Order Summary */}
                {cartItems.map((item) => {
                  const isBusinessSupply = item.proCategoryId?._id === "690af3de95c9811f74993d69"
                  const itemPrice = item.offerPrice || item.price || 0;
                  const itemTotal = itemPrice * item.quantity;
                  const itemVAT = item.vat || 0;
                  const itemVATAmount = (itemTotal * itemVAT) / 100;

                  return (
                    <div key={item._id} className="flex gap-4 pb-4 border-b border-gray-200">
                      <div className="relative">
                        <img
                          src={item.images?.[0]?.url}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        {isBusinessSupply && (
                          <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                            B2B
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 line-clamp-2">{item.name}</p>
                        {isBusinessSupply && (
                          <p className="text-xs text-blue-600 font-medium">Business Supply</p>
                        )}
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        {itemVAT > 0 && (
                          <p className="text-xs text-gray-500">VAT: {itemVAT}%</p>
                        )}
                        <p className="font-bold text-amber-600">
                          KES {itemTotal.toLocaleString()}
                          {itemVATAmount > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                              (incl. VAT: KES {itemVATAmount.toFixed(2)})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>KES {totalPrice.toLocaleString()}</span>
                </div>

                {/* Discount Line */}
                {appliedCoupon && meetsMinimumPurchase && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- KES {discountAmount.toLocaleString()}</span>
                  </div>
                )}

                {/* Add VAT Line */}
                <div className="flex justify-between text-gray-700">
                  <span>VAT ({cartItems.map(item => item.vat || 0).filter((v, i, a) => a.indexOf(v) === i).join('/')}%)</span>
                  <span>KES {vatTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>KES {shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-amber-600 border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>KES {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* M-Pesa Payment Modal */}
      <AnimatePresence>
        {showMpesaPopup && (
          <MpesaPayment
            onClose={() => setShowMpesaPopup(false)}
            total={finalTotal} // Changed from totalWithShipping to finalTotal
            setTransactionData={setTransactionData}
            setPaymentStatus={setPaymentStatus}
            handleOrderSubmit={handleOrderSubmit}
          />
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {paymentStatus && isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-2xl p-8 text-center">
              <Loader className="w-12 h-12 animate-spin text-amber-600 mx-auto mb-4" />
              <p className="text-gray-800 font-semibold">Processing your order...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
