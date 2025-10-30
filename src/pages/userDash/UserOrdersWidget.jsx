// UserOrdersWidget.jsx
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserOrders } from "../../redux/slices/ordersSlice"
import { motion } from "framer-motion"
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiInfo
} from "react-icons/fi"

const UserOrdersWidget = ({ user }) => {
  const dispatch = useDispatch()
  const { userOrders, userOrdersLoading, error } = useSelector((state) => state.orders)

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserOrders(user._id))
    }
  }, [dispatch, user?._id])

  const getStatusIcon = (status) => {
    const icons = {
      pending: FiClock,
      confirmed: FiCheckCircle,
      processing: FiPackage,
      shipped: FiTruck,
      delivered: FiCheckCircle,
      cancelled: FiXCircle
    }
    return icons[status] || FiPackage
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-purple-100 text-purple-800 border-purple-200',
      shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (userOrdersLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h3>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h3>
        <div className="text-center py-12 text-red-600">
          <p>Error loading orders: {error}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-lg p-8 max-md:p-4"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h3>

      {userOrders.length === 0 ? (
        <div className="text-center py-12">
          <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No orders yet</p>
          <p className="text-gray-500">Your orders will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {userOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.orderStatus)

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
              >
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-4">
                    <StatusIcon className={`w-8 h-8 ${getStatusColor(order.orderStatus).split(' ')[1]}`} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        Order #{order.orderNumber}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border capitalize ${getStatusColor(order.orderStatus)}`}>
                      Order Status: {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                      Payment Status: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Items */}
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Items ({order.items.length})</h5>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity} × KES {(item.offerPrice || item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Delivery */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">KES {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">KES {order.shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span className="text-amber-600">KES {order.total.toLocaleString()}</span>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Delivery:</span> {order.shippingMethod}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Est. Delivery:</span> {order.deliveryTime}
                      </p>
                    </div>
                    <div className="pt-2">
                      <h1 className="font-semibold text-green-900">Payment Terms</h1>
                      <p className="text-sm text-gray-600 capitalize">
                        <span className="font-medium">Payment Method:</span> {order.paymentMethod}
                      </p>
                      {order?.creditTerms && (
                        <>
                          <p className="text-sm text-gray-600 capitalize">
                            <span className="font-medium">Credit Period:</span> {order.creditTerms.creditDays} Days
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            <span className="font-medium">Payment Method:</span> {order.creditTerms.paymentMethod}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Notes - Very Important! */}
                {order.adminNotes && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <FiInfo className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Update from Store:</p>
                        <p className="text-sm text-blue-700">{order.adminNotes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Note */}
                {order.deliveryNote && (
                  <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-amber-800">
                      <span className="font-medium">Your Note:</span> {order.deliveryNote}
                    </p>
                  </div>
                )}

                {/* Delivery Address */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address:</p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName} •
                    {order.shippingAddress.address}, {order.shippingAddress.city}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

export default UserOrdersWidget