// components/AdminDashboard.jsx
"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDashboardStats } from "../../redux/slices/dashboardSlice"
import AdminSidebar from "./components/AdminSidebar"
import { 
  FiUsers, 
  FiShoppingBag, 
  FiDollarSign, 
  FiPackage,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiRefreshCw,
  FiClock,
  FiTruck,
  FiBox
} from "react-icons/fi"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { stats, loading, error } = useSelector((state) => state.dashboard)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchDashboardStats())
    setLastRefreshed(new Date())
    toast.success("Dashboard updated!")
  }

  const formatCurrency = (amount) => {
    return `KES ${amount?.toLocaleString() || '0'}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading && !stats.lastUpdated) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 mt-16 lg:mt-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2">
              Welcome to your admin dashboard {lastRefreshed && `• Last updated ${formatDate(lastRefreshed)}`}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-coffee text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error loading dashboard: {error}</p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(stats.revenue?.total)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Today: {formatCurrency(stats.revenue?.today)}
                </p>
              </div>
              <FiDollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          {/* Total Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.orders?.total || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Today: {stats.orders?.today || 0}
                </p>
              </div>
              <FiShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.users?.total || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  Verified: {stats.users?.verified || 0}
                </p>
              </div>
              <FiUsers className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          {/* Total Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.products?.total || 0}
                </p>
                <div className="flex gap-2 text-xs mt-1">
                  {stats.products?.lowStock > 0 && (
                    <span className="text-amber-600">
                      {stats.products.lowStock} low stock
                    </span>
                  )}
                  {stats.products?.outOfStock > 0 && (
                    <span className="text-red-600">
                      {stats.products.outOfStock} out of stock
                    </span>
                  )}
                </div>
              </div>
              <FiPackage className="w-8 h-8 text-amber-500" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiShoppingBag className="w-5 h-5" />
              Order Status Breakdown
            </h3>
            <div className="space-y-3">
              {[
                { status: 'Pending', count: stats.orders?.statusBreakdown?.pending, color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
                { status: 'Confirmed', count: stats.orders?.statusBreakdown?.confirmed, color: 'bg-blue-100 text-blue-800', icon: FiCheckCircle },
                { status: 'Processing', count: stats.orders?.statusBreakdown?.processing, color: 'bg-purple-100 text-purple-800', icon: FiPackage },
                { status: 'Shipped', count: stats.orders?.statusBreakdown?.shipped, color: 'bg-indigo-100 text-indigo-800', icon: FiTruck },
                { status: 'Delivered', count: stats.orders?.statusBreakdown?.delivered, color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
                { status: 'Cancelled', count: stats.orders?.statusBreakdown?.cancelled, color: 'bg-red-100 text-red-800', icon: FiAlertTriangle },
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={item.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${item.color.split(' ')[1]}`} />
                      <span className="font-medium text-gray-700">{item.status}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm font-semibold ${item.color}`}>
                      {item.count || 0}
                    </span>
                  </div>
                )
              })}
            </div>
            <Link 
              to="/admin-panel/orders"
              className="block mt-4 text-center text-coffee hover:text-coffee/80 font-medium"
            >
              View All Orders →
            </Link>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5" />
              Recent Orders
            </h3>
            <div className="space-y-3">
              {stats.recentActivity?.orders?.length > 0 ? (
                stats.recentActivity.orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.user?.username} • {formatCurrency(order.total)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">M-Pesa</span>
                <span className="font-semibold text-green-600">{stats.payments?.mpesa || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Cash on Delivery</span>
                <span className="font-semibold text-orange-600">{stats.payments?.cod || 0}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Paid Orders</span>
                  <span className="text-green-600">{stats.payments?.paid || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                  <span>Pending Payment</span>
                  <span>{stats.payments?.pending || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.users?.newToday || 0}</p>
                <p className="text-sm text-blue-700">New Users Today</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.orders?.today || 0}</p>
                <p className="text-sm text-green-700">Orders Today</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {stats.revenue?.averageOrderValue ? formatCurrency(stats.revenue.averageOrderValue) : 'KES 0'}
                </p>
                <p className="text-sm text-purple-700">Avg Order Value</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">
                  {stats.products?.topSelling?.length || 0}
                </p>
                <p className="text-sm text-amber-700">Top Products</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}