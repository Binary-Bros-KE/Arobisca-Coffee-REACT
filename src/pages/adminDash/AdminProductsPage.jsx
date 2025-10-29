"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "../../redux/slices/productsSlice"
import AdminSidebar from "./components/AdminSidebar"
import ProductFormModal from "./components/ProductFormModal"
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"
import toast from "react-hot-toast"
import { fetchCategories } from "../../redux/slices/categoriesSlice"
import { Loader } from "lucide-react"

export default function AdminProductsPage() {
  const dispatch = useDispatch()
  const { items: products, loading } = useSelector((state) => state.products)
  const { items: categories } = useSelector((state) => state.categories)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  console.log(`categories from parent`, categories)

  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts())
  }, [dispatch])

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
          method: "DELETE",
        })
        if (response.ok) {
          dispatch(fetchProducts())
          toast.success("Product deleted successfully")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        toast.error("Failed to delete product")
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleProductSaved = () => {
    dispatch(fetchProducts())
    handleCloseModal()
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-coffee text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            <FiPlus size={20} />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No products found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Offer Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {console.log(`product`, products[0])}
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-900 flex items-center gap-2">
                      <img src={product?.images[0].url} alt="" className="h-10 w-13 rounded-md" />
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.proCategoryId?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">${product.offerPrice || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.quantity}</td>
                    <td className="text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600/10 p-2 rounded-full text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-600/10 p-2 rounded-full text-red-600 hover:text-red-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Product Form Modal */}
        {showModal && (
          <ProductFormModal
            product={editingProduct}
            categories={categories}
            onClose={handleCloseModal}
            onSave={handleProductSaved}
          />
        )}
      </main>
    </div>
  )
}
