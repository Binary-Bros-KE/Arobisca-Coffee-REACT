"use client"

import { useEffect, useState } from "react"
import { FiEdit2, FiTrash2, FiPlus, FiGift, FiCalendar, FiPercent, FiDollarSign } from "react-icons/fi"
import AdminSidebar from "./components/AdminSidebar"
import toast from "react-hot-toast"
import { fetchCategories } from "../../redux/slices/categoriesSlice"
import { fetchProducts } from "../../redux/slices/productsSlice"
import { useDispatch } from "react-redux"
import { Loader } from "lucide-react"

const API_URL = import.meta.env.VITE_SERVER_URL

export default function AdminCouponsPage() {
  const dispatch = useDispatch()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)

  const API_URL = `${API_URL}/couponCodes`

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  // Fetch all coupons
  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      if (data.success) setCoupons(data.data)
      else toast.error(data.message || "Failed to fetch coupons")
    } catch (err) {
      console.error(err)
      toast.error("Failed to load coupons")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  // Delete a coupon
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" })
      const data = await res.json()
      if (res.ok) {
        toast.success("Coupon deleted successfully")
        fetchCoupons()
      } else toast.error(data.message)
    } catch (err) {
      console.error(err)
      toast.error("Error deleting coupon")
    }
  }

  // Open modal for add/edit
  const openModal = (coupon = null) => {
    setEditingCoupon(coupon)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCoupon(null)
  }

  const handleSave = async (formData) => {
    const method = editingCoupon ? "PUT" : "POST"
    const url = editingCoupon ? `${API_URL}/${editingCoupon._id}` : API_URL

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Coupon ${editingCoupon ? "updated" : "created"} successfully`)
        closeModal()
        fetchCoupons()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to save coupon")
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Check if coupon is expired
  const isExpired = (endDate) => {
    return new Date(endDate) < new Date()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FiGift className="w-8 h-8 text-amber-600" />
            Coupons Management
          </h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-coffee text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition cursor-pointer"
          >
            <FiPlus size={20} />
            Create Coupon
          </button>
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="text-center text-gray-500 py-10 bg-white">
            <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No coupons created yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-amber-500"
              >
                {/* Coupon Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 bg-amber-100 px-3 py-1 rounded-lg inline-block">
                      {coupon.couponCode}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {coupon.status}
                      </span>
                      {isExpired(coupon.endDate) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-600 font-bold text-lg">
                      {coupon.discountType === 'percentage' ? (
                        <FiPercent size={16} />
                      ) : (
                        "Kes "
                      )}
                      {coupon.discountAmount}
                      {coupon.discountType === 'percentage' ? '%' : ''}
                    </div>
                    <p className="text-sm text-gray-600">OFF</p>
                  </div>
                </div>

                {/* Coupon Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FiCalendar size={14} />
                    <span>Expires: {formatDate(coupon.endDate)}</span>
                  </div>

                  {coupon.minimumPurchaseAmount > 0 && (
                    <div className="flex items-center gap-2">
                      <FiDollarSign size={14} />
                      <span>Min. purchase: KES {coupon.minimumPurchaseAmount.toLocaleString()}</span>
                    </div>
                  )}

                  {coupon.applicableCategory && (
                    <div>
                      <span className="font-medium">Category: </span>
                      {coupon.applicableCategory.name}
                    </div>
                  )}

                  {coupon.applicableProduct && (
                    <div>
                      <span className="font-medium">Product: </span>
                      {coupon.applicableProduct.name}
                    </div>
                  )}

                  {!coupon.applicableCategory && !coupon.applicableProduct && (
                    <div className="text-green-600 font-medium">
                      Applicable to all products
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openModal(coupon)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer"
                  >
                    <FiTrash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coupon Form Modal */}
        {showModal && (
          <CouponFormModal
            coupon={editingCoupon}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </main>
    </div>
  )
}

/* --------------------- Coupon Form Modal --------------------- */
function CouponFormModal({ coupon, onClose, onSave }) {
  const [form, setForm] = useState({
    couponCode: coupon?.couponCode || "",
    discountType: coupon?.discountType || "percentage",
    discountAmount: coupon?.discountAmount || "",
    minimumPurchaseAmount: coupon?.minimumPurchaseAmount || 0,
    endDate: coupon?.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : "",
    status: coupon?.status || "active",
    applicableCategory: coupon?.applicableCategory?._id || "",
    applicableProduct: coupon?.applicableProduct?._id || "",
  })

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch categories and products for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/products`)
        ])

        const categoriesData = await categoriesRes.json()
        const productsData = await productsRes.json()

        if (categoriesData.success) setCategories(categoriesData.data)
        if (productsData.success) setProducts(productsData.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation
    if (!form.couponCode || !form.discountAmount || !form.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    if (form.discountAmount <= 0) {
      toast.error("Discount amount must be greater than 0")
      return
    }

    if (form.discountType === 'percentage' && form.discountAmount > 100) {
      toast.error("Percentage discount cannot exceed 100%")
      return
    }

    if (new Date(form.endDate) <= new Date()) {
      toast.error("End date must be in the future")
      return
    }

    onSave(form)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {coupon ? "Edit Coupon" : "Create New Coupon"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Coupon Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              name="couponCode"
              value={form.couponCode}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-gray-300"
              placeholder="Arobisca2025"
            />
          </div>

          {/* Discount Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type *
              </label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Amount *
              </label>
              <input
                type="number"
                name="discountAmount"
                value={form.discountAmount}
                onChange={handleChange}
                required
                min="0"
                step={form.discountType === 'percentage' ? '1' : '0.01'}
                max={form.discountType === 'percentage' ? '100' : ''}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-gray-300"
                placeholder={form.discountType === 'percentage' ? '10' : '50'}
              />
            </div>
          </div>

          {/* Minimum Purchase and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Purchase Amount
              </label>
              <input
                type="number"
                name="minimumPurchaseAmount"
                value={form.minimumPurchaseAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-gray-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Applicable Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applicable Category (Optional)
            </label>
            <select
              name="applicableCategory"
              value={form.applicableCategory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Applicable Product */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applicable Product (Optional)
            </label>
            <select
              name="applicableProduct"
              value={form.applicableProduct}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All Products</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Help Text */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Leave both category and product empty to make this coupon applicable to all orders.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer"
            >
              {coupon ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}