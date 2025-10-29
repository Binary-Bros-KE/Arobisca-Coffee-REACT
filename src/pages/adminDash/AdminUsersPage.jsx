"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllUsers, setFilters } from "../../redux/slices/usersSlice"
import AdminSidebar from "./components/AdminSidebar"
import {
    FiUsers,
    FiMail,
    FiPhone,
    FiMapPin,
    FiShoppingBag,
    FiCalendar,
    FiCheckCircle,
    FiXCircle,
    FiFilter,
    FiRefreshCw
} from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function AdminUsersPage() {
    const dispatch = useDispatch()
    const {
        users,
        loading,
        error,
        filters
    } = useSelector((state) => state.users)

    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        // Fetch users on component mount
        dispatch(fetchAllUsers())
    }, [dispatch])

    const handleFilterChange = (filterType, value) => {
        dispatch(setFilters({ [filterType]: value }))
    }

    const handleRefresh = () => {
        dispatch(fetchAllUsers())
        toast.success("Users list refreshed!")
    }

    const getFilteredUsers = () => {
        let filtered = users

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phoneNumber?.includes(searchTerm) ||
                `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply verification filter
        if (filters.verificationStatus !== 'all') {
            filtered = filtered.filter(user =>
                filters.verificationStatus === 'verified' ? user.isEmailVerified : !user.isEmailVerified
            )
        }

        // Apply date filter
        if (filters.dateRange !== 'all') {
            const now = new Date()
            filtered = filtered.filter(user => {
                const userDate = new Date(user.createdAt)
                switch (filters.dateRange) {
                    case 'today':
                        return userDate.toDateString() === now.toDateString()
                    case 'week':
                        const weekAgo = new Date(now.setDate(now.getDate() - 7))
                        return userDate >= weekAgo
                    case 'month':
                        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
                        return userDate >= monthAgo
                    default:
                        return true
                }
            })
        }

        return filtered
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getTimeSince = (dateString) => {
        const now = new Date()
        const userDate = new Date(dateString)
        const diffTime = Math.abs(now - userDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) return '1 day ago'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
        return `${Math.ceil(diffDays / 30)} months ago`
    }

    const filteredUsers = getFilteredUsers()

    return (
        <div className="flex min-h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                        <p className="text-gray-600 mt-2">View all registered users on the platform</p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-coffee text-white rounded-lg hover:bg-opacity-90 transition cursor-pointer"
                    >
                        <FiRefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                            <FiUsers className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Verified Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.filter(user => user.isEmailVerified).length}
                                </p>
                            </div>
                            <FiCheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.reduce((total, user) => total + (user.orders?.length || 0), 0)}
                                </p>
                            </div>
                            <FiShoppingBag className="w-8 h-8 text-amber-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Today</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.filter(user => {
                                        const userDate = new Date(user.createdAt)
                                        return userDate.toDateString() === new Date().toDateString()
                                    }).length}
                                </p>
                            </div>
                            <FiCalendar className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <FiFilter size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                            </div>

                            <select
                                value={filters.verificationStatus}
                                onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
                            >
                                <option value="all">All Users</option>
                                <option value="verified">Verified Only</option>
                                <option value="unverified">Unverified Only</option>
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

                        {/* Search */}
                        <div className="w-full lg:w-auto">
                            <input
                                type="text"
                                placeholder="Search users by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full lg:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee"
                            />
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg shadow">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            <p>Error loading users: {error}</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p>No users found</p>
                            {searchTerm && (
                                <p className="text-sm mt-2">Try adjusting your search or filters</p>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            <AnimatePresence>
                                {filteredUsers.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        formatDate={formatDate}
                                        getTimeSince={getTimeSince}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

// User Card Component
function UserCard({ user, formatDate, getTimeSince }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 hover:bg-gray-50 transition-colors"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {/* User Header */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {user.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {user.username}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.isEmailVerified
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {user.isEmailVerified ? (
                                        <FiCheckCircle size={12} />
                                    ) : (
                                        <FiXCircle size={12} />
                                    )}
                                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Joined {getTimeSince(user.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FiMail size={14} className="text-gray-400" />
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiPhone size={14} className="text-gray-400" />
                                <span>{user.phoneNumber || 'Not provided'}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FiShoppingBag size={14} className="text-gray-400" />
                                <span>{user.orders?.length || 0} orders</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiCalendar size={14} className="text-gray-400" />
                                <span>Joined {formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Expandable Details */}
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 space-y-4"
                            >
                                {/* Shipping Addresses */}
                                {user.shippingAddresses && user.shippingAddresses.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <FiMapPin size={14} />
                                            Shipping Addresses ({user.shippingAddresses.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {user.shippingAddresses.map((address, index) => (
                                                <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                                                    <p className="font-medium text-gray-800">
                                                        {address.firstName} {address.lastName}
                                                    </p>
                                                    <p className="text-gray-600">{address.address}</p>
                                                    {address.apartment && (
                                                        <p className="text-gray-600">{address.apartment}</p>
                                                    )}
                                                    <p className="text-gray-600">
                                                        {address.city}, {address.postalCode}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Order IDs */}
                                {user.orders && user.orders.length > 0 && (
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <FiShoppingBag size={14} />
                                            Recent Order IDs
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.orders.slice(0, 5).map((orderId, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                                >
                                                    {orderId.slice(-8)}
                                                </span>
                                            ))}
                                            {user.orders.length > 5 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    +{user.orders.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Expand Button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-4 px-4 py-2 text-coffee hover:bg-coffee hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                    {expanded ? 'Show Less' : 'Show More'}
                </button>
            </div>
        </motion.div>
    )
}