"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../../redux/slices/categoriesSlice"
import AdminSidebar from "./components/AdminSidebar"
import CategoryFormModal from "./components/CategoryFormModal"
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"
import toast from "react-hot-toast"
import { Loader } from "lucide-react"

const API_URL = import.meta.env.VITE_SERVER_URL

export default function AdminCategoriesPage() {
  const dispatch = useDispatch()
  const { items: categories, loading } = useSelector((state) => state.categories)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleDelete = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`${API_URL}/categories/${categoryId}`, {
          method: "DELETE",
        })
        const data = await response.json()
        if (response.ok) {
          dispatch(fetchCategories())
          toast.success("Category deleted successfully")
        } else {
          toast.error(data.message || "Failed to delete category")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
        toast.error("Failed to delete category")
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCategory(null)
  }

  const handleCategorySaved = () => {
    dispatch(fetchCategories())
    handleCloseModal()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-coffee text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition cursor-pointer"
          >
            <FiPlus size={20} />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-8 bg-white">
              <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">No categories found</div>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                {/* Category Image */}
                {category.image && category.image !== "no_url" && (
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Category Form Modal */}
        {showModal && (
          <CategoryFormModal category={editingCategory} onClose={handleCloseModal} onSave={handleCategorySaved} />
        )}
      </main>
    </div>
  )
}
