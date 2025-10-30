"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchAllOrders,
  fetchOrderStats,
  updateOrderStatus,
  updatePaymentStatus,
  setCurrentTab,
  setFilters,
  refreshOrders
} from "../../redux/slices/ordersSlice"
import AdminSidebar from "./components/AdminSidebar"
import {
  FiEdit2,
  FiTruck,
  FiDollarSign,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiRefreshCw,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiShoppingBag,
  FiCreditCard
} from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function AdminOrdersPage() {
  const dispatch = useDispatch()
  const {
    allOrders,
    currentTab,
    loading,
    error,
    stats,
    filters
  } = useSelector((state) => state.orders)

  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

  const tabs = [
    { id: 'all', label: 'All Orders', icon: FiPackage, count: stats.totalOrders },
    { id: 'pending', label: 'Pending', icon: FiPackage, count: stats.pendingOrders },
    { id: 'confirmed', label: 'Confirmed', icon: FiCheckCircle },
    { id: 'processing', label: 'Processing', icon: FiRefreshCw },
    { id: 'shipped', label: 'Shipped', icon: FiTruck },
    { id: 'delivered', label: 'Delivered', icon: FiCheckCircle, count: stats.completedOrders },
    { id: 'cancelled', label: 'Cancelled', icon: FiXCircle }
  ]

  useEffect(() => {
    // Fetch all orders and stats only once
    if (allOrders.length === 0) {
      dispatch(fetchAllOrders())
    }
    dispatch(fetchOrderStats())
  }, [dispatch, allOrders.length])

  const handleTabChange = (tabId) => {
    dispatch(setCurrentTab(tabId))
  }

  const handleRefresh = () => {
    dispatch(refreshOrders())
    dispatch(fetchAllOrders())
    dispatch(fetchOrderStats())
    toast.success("Orders refreshed!")
  }

  const handleStatusUpdate = async (orderStatus, adminNotes = '') => {
    if (!selectedOrder) return

    setStatusLoading(true)
    try {
      await dispatch(updateOrderStatus({
        orderId: selectedOrder._id,
        orderStatus,
        adminNotes
      })).unwrap()

      toast.success(`Order status updated to ${orderStatus}`)
      setShowStatusModal(false)
      setSelectedOrder(null)
    } catch (error) {
      console.log(`Status eror`, error);
      toast.error(error.message || "Failed to update order status")
    } finally {
      setStatusLoading(false)
    }
  }

  const handlePaymentUpdate = async (paymentStatus) => {
    if (!selectedOrder) return

    setPaymentLoading(true)
    try {
      await dispatch(updatePaymentStatus({
        orderId: selectedOrder._id,
        paymentStatus
      })).unwrap()

      toast.success(`Payment status updated to ${paymentStatus}`)
      setShowPaymentModal(false)
      setSelectedOrder(null)
    } catch (error) {
      toast.error(error.message || "Failed to update payment status")
    } finally {
      setPaymentLoading(false)
    }
  }

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }))
  }

  const getFilteredOrders = () => {
    let orders = allOrders

    // Apply status filter
    if (currentTab !== 'all') {
      orders = orders.filter(order => order.orderStatus === currentTab)
    }

    // Apply account type filter
    console.log(`accountType`, filters.accountType);
    if (filters.accountType !== 'all') {
      orders = orders.filter(order => order.user?.accountType === filters.accountType)
    }

    // Apply payment method filter
    if (filters.paymentMethod !== 'all') {
      orders = orders.filter(order => order.paymentMethod === filters.paymentMethod)
    }

    // Apply payment status filter
    if (filters.paymentStatus !== 'all') {
      orders = orders.filter(order => order.paymentStatus === filters.paymentStatus)
    }

    return orders
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
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

  const getPaymentMethodColor = (method) => {
    const colors = {
      mpesa: 'bg-green-100 text-green-800',
      cod: 'bg-orange-100 text-orange-800',
      credit: 'bg-blue-100 text-blue-800'
    }
    return colors[method] || 'bg-gray-100 text-gray-800'
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-2">Manage and track customer orders</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-coffee text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer"
          >
            <FiRefreshCw size={16} />
            Refresh Orders
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <FiPackage className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <FiPackage className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allOrders.filter(order => order.paymentStatus === 'paid').length}
                </p>
              </div>
              <FiCreditCard className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  KES {allOrders
                    .filter(order => order.paymentStatus === 'paid')
                    .reduce((sum, order) => sum + order.subtotal, 0)
                    .toLocaleString()}
                </p>
              </div>
              <FiDollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = currentTab === tab.id
                const orderCount = tab.count || allOrders.filter(order => order.orderStatus === tab.id).length

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap cursor-pointer ${isActive
                      ? 'border-coffee text-coffee'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                    {orderCount > 0 && (
                      <span className={`px-2 py-1 rounded-full text-xs ${isActive ? 'bg-coffee text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                        {orderCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <FiFilter size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>

              {/* New: Account Type Filter */}
              <select
                value={filters.accountType}
                onChange={(e) => handleFilterChange('accountType', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
              >
                <option value="all">All Account Types</option>
                <option value="business">Business Accounts</option>
                <option value="personal">Personal Accounts</option>
              </select>

              {/* Enhanced Payment Method Filter */}
              <select
                value={filters.paymentMethod}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
              >
                <option value="all">All Payment Methods</option>
                <option value="mpesa">M-Pesa</option>
                <option value="cod">Cash on Delivery</option>
                <option value="credit">Credit Purchase</option>
              </select>

              <select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
              >
                <option value="all">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>

              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>Error loading orders: {error}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiPackage className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="divide-y-20 divide-gray-100">
              <AnimatePresence>
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    isExpanded={expandedOrder === order._id}
                    onToggleExpand={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    onUpdateStatus={() => {
                      setSelectedOrder(order)
                      setShowStatusModal(true)
                    }}
                    onUpdatePayment={() => {
                      setSelectedOrder(order)
                      setShowPaymentModal(true)
                    }}
                    getStatusColor={getStatusColor}
                    getPaymentStatusColor={getPaymentStatusColor}
                    getPaymentMethodColor={getPaymentMethodColor}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        <AnimatePresence>
          {showStatusModal && selectedOrder && (
            <StatusUpdateModal
              order={selectedOrder}
              onClose={() => {
                setShowStatusModal(false)
                setSelectedOrder(null)
              }}
              onStatusUpdate={handleStatusUpdate}
              loading={statusLoading}
            />
          )}
        </AnimatePresence>

        {/* Payment Status Update Modal */}
        <AnimatePresence>
          {showPaymentModal && selectedOrder && (
            <PaymentUpdateModal
              order={selectedOrder}
              onClose={() => {
                setShowPaymentModal(false)
                setSelectedOrder(null)
              }}
              onPaymentUpdate={handlePaymentUpdate}
              loading={paymentLoading}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// Order Card Component with Expandable Details
function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
  onUpdateStatus,
  onUpdatePayment,
  getStatusColor,
  getPaymentStatusColor,
  getPaymentMethodColor
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6"
    >
      {/* Order Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              Payment: {order.paymentStatus}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(order.paymentMethod)}`}>
              {order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'COD'}
            </span>
          </div>

          {/* Customer and Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <p className="font-medium flex items-center gap-2">
                <FiUser size={14} />
                Customer
                {order.user?.accountType === 'business' ? (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">B 2 B</span>
                ) : (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">Personal Account</span>
                )}
              </p>
              <p>{order.user?.firstName} {order.user?.lastName}</p>
              <p>{order.user?.email}</p>
              <p>{order.user?.phoneNumber}</p>
              {/* Business Info */}
              {order.user?.accountType === 'business' && order.user?.companyName && (
                <p className="text-green-600 font-medium mt-1">{order.user.companyName}</p>
              )}
            </div>
            <div>
              <p className="font-medium">Delivery Address</p>
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
            <div>
              <p className="font-medium">Order Details</p>
              <p>{order.items.length} items</p>
              <p>Subtotal: KES {order.subtotal.toLocaleString()}</p>
              <p>Discount: KES {order.discount.toLocaleString()}</p>
              <p>Shipping: KES {order.shipping.toLocaleString()}</p>
              <p className="font-semibold text-gray-900">Total: KES {order.total.toLocaleString()}</p>
            </div>
          </div>


          {order.deliveryNote && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                <span className="font-medium">Delivery Note:</span> {order.deliveryNote}
              </p>
            </div>
          )}

          {order.coupon && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800 flex flex-col">
                <span className="font-semibold">Coupon Used</span>
                <span>Coupon Code: {order.coupon.code}</span>
                <span>Coupon Type: {order.coupon.discountType}</span>
                <span>Discount Amount: {order.coupon.discountAmount}</span>
                <span>Applied Discount Amount: {order.coupon.appliedDiscount}</span>
              </p>
            </div>
          )}

          {/* Credit Terms Information */}
          {order.paymentMethod === 'credit' && order.creditTerms && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">Credit Terms</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <span>Period: {order.creditTerms.creditDays} days</span>
                <span>Method: {order.creditTerms.paymentMethod?.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
          )}

          {order.adminNotes && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Admin Notes:</span> {order.adminNotes}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4 flex-col">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition cursor-pointer"
          >
            {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            {isExpanded ? 'Less' : 'More'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onUpdateStatus}
              className="flex items-center gap-2 px-3 py-2 bg-coffee text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer text-sm"
            >
              <FiEdit2 size={14} />
              Status
            </button>
            <button
              onClick={onUpdatePayment}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer text-sm"
            >
              <FiCreditCard size={14} />
              Payment
            </button>
          </div>

        </div>
      </div>

      {/* Expandable Order Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 border-t pt-4"
          >
            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <FiShoppingBag size={16} />
              Order Items ({order.items.length})
            </h4>
            <div className="grid gap-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      KES {((item.offerPrice || item.price) * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      KES {(item.offerPrice || item.price).toLocaleString()} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Status Update Modal Component (keep your existing one)
function StatusUpdateModal({ order, onClose, onStatusUpdate, loading }) {
  const [selectedStatus, setSelectedStatus] = useState(order.orderStatus)
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '')

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Update Order Status
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Order #{order.orderNumber}</p>
          <p className="font-medium">
            {order.user?.firstName} {order.user?.lastName}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows="3"
              placeholder="Add any internal notes about this order..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onStatusUpdate(selectedStatus, adminNotes)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-coffee text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Payment Update Modal Component
function PaymentUpdateModal({ order, onClose, onPaymentUpdate, loading }) {
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(order.paymentStatus)

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Update Payment Status
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Order #{order.orderNumber}</p>
          <p className="font-medium">
            {order.user?.firstName} {order.user?.lastName}
          </p>
          <p className="text-sm text-gray-600">
            Total: KES {order.total.toLocaleString()} • Method: {order.paymentMethod}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee"
            >
              {paymentStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {selectedPaymentStatus === 'paid' && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Marking as paid will add <strong>KES {order.subtotal.toLocaleString()}</strong> to total revenue.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onPaymentUpdate(selectedPaymentStatus)}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              'Update Payment'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}