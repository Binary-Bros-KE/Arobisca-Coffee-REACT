"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../../redux/slices/categoriesSlice"
import { fetchProducts } from "../../redux/slices/productsSlice"
import AdminSidebar from "./components/AdminSidebar"

export default function AdminDashboard() {
  const dispatch = useDispatch()
  const { items: categories } = useSelector((state) => state.categories)
  const { items: products } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  const stats = [
    { label: "Total Products", value: products.length, color: "bg-blue-500" },
    { label: "Total Categories", value: categories.length, color: "bg-green-500" },
    { label: "Total Orders", value: 0, color: "bg-purple-500" },
    { label: "Total Revenue", value: "$0", color: "bg-orange-500" },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className={`${stat.color} w-12 h-12 rounded-lg mb-4`} />
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Admin Panel</h2>
          <p className="text-gray-600">
            Use the sidebar to navigate to Products, Categories, Orders, Coupons, and Design sections. More features
            coming soon!
          </p>
        </div>
      </main>
    </div>
  )
}
