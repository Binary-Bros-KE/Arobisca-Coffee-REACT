"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiMail } from "react-icons/fi"
import { useEffect, useState } from "react"
import { clearCart } from "../../../redux/slices/cartSlice"
import { useDispatch } from "react-redux"

export default function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
     window.scrollTo(0, 0)

    // Check both possible locations for order data
    const orderData = location.state?.order || location.state?.order?.data

    console.log('Location state:', location.state)
    console.log('Order data found:', orderData)

    if (orderData) {
      setOrder(orderData)
    }
    setLoading(false)
  }, [location.state])

  useEffect(() => {
    dispatch(clearCart())
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't retrieve your order details. Please check your email for confirmation or contact support.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
            >
              Check My Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Safely access order properties with fallbacks
  const orderNumber = order.orderNumber || order._id?.slice(-8)?.toUpperCase() || 'N/A'
  const itemCount = order.items?.length || 0
  const totalAmount = order.total?.toLocaleString() || '0'
  const shippingMethod = order.shippingMethod || 'Standard Shipping'
  const address = order.shippingAddress || {}
  const contactEmail = order.shippingAddress?.email || order.user?.email || 'N/A'

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <FiCheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase</p>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-amber-600">{orderNumber}</p>
          </div>

          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <FiPackage className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">{itemCount} Item{itemCount !== 1 ? 's' : ''}</p>
                <p className="text-sm text-gray-600">Total: KES {totalAmount}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <FiTruck className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Shipping Method</p>
                <p className="text-sm text-gray-600">{shippingMethod}</p>
                {order.deliveryTime && (
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Estimated: {order.deliveryTime}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
              <FiHome className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Delivery Address</p>
                <p className="text-sm text-gray-600">
                  {address.address}, {address.city}
                  {address.apartment && `, ${address.apartment}`}
                </p>
                <p className="text-sm text-gray-600">
                  {address.firstName} {address.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FiMail className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Contact Email</p>
                <p className="text-sm text-gray-600">{contactEmail}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full border-2 border-amber-600 text-amber-600 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-all"
            >
              Continue Shopping
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-6">
            A confirmation email has been sent to {contactEmail}
          </p>
        </motion.div>
      </div>
    </div>
  )
}