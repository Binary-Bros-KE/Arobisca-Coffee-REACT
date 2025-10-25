"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiX } from "react-icons/fi"
import toast from "react-hot-toast"

export default function CategoryFormModal({ category, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({ name: category.name })
      // If category has existing image, set the preview
      if (category.img) {
        setImagePreview(category.img)
      }
    }
  }, [category])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      setImage(file)
      
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setImagePreview(objectUrl)
    }
  }

  const removeSelectedImage = () => {
    setImage(null)
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(category?.img || null) // Reset to existing image if editing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      if (image) {
        formDataToSend.append("img", image)
      }

      const url = category ? `http://localhost:3000/categories/${category._id}` : "http://localhost:3000/categories"
      const method = category ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success(category ? "Category updated successfully" : "Category created successfully")
        onSave()
      } else {
        toast.error("Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error("Error saving category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg shadow-lg max-w-md w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="text-2xl font-bold text-gray-900">{category ? "Edit Category" : "Add New Category"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
              placeholder="Enter category name"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
            
            {imagePreview ? (
              <div className="relative group">
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                    <div className="flex gap-2">
                      <label className="px-3 py-1.5 bg-coffee text-white rounded-lg text-sm font-medium cursor-pointer transition-all">
                        Change Image
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          className="hidden" 
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-coffee transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
                <div className="text-gray-500">
                  <div className="text-lg mb-2">📷</div>
                  <div className="text-sm">Click to upload image</div>
                  <div className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</div>
                </div>
              </label>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-400">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-coffee text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : category ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}