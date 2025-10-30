"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiX } from "react-icons/fi"
import toast from "react-hot-toast"

const API_URL = import.meta.env.VITE_SERVER_URL

export default function ProductFormModal({ product, categories, onClose, onSave }) {
  console.log(`categories`, categories);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    offerPrice: "",
    proCategoryId: "",
  })
  const [images, setImages] = useState({})
  const [imagePreviews, setImagePreviews] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        quantity: product.quantity,
        price: product.price,
        offerPrice: product.offerPrice || "",
        proCategoryId: product.proCategoryId?._id || "",
      })
      
      // Set existing image previews if editing
      if (product.images) {
        const previews = {}
        product.images.forEach((img, index) => {
          if (img.url) {
            previews[index + 1] = img.url
          }
        })
        setImagePreviews(previews)
      }
    }
  }, [product])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [imagePreviews])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e, imageNumber) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      setImages((prev) => ({ ...prev, [imageNumber]: file }))
      
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setImagePreviews((prev) => ({ ...prev, [imageNumber]: objectUrl }))
    }
  }

  const removeSelectedImage = (imageNumber) => {
    setImages((prev) => {
      const newImages = { ...prev }
      delete newImages[imageNumber]
      return newImages
    })
    
    // Clean up URL if it's a blob
    if (imagePreviews[imageNumber] && imagePreviews[imageNumber].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[imageNumber])
    }
    
    setImagePreviews((prev) => {
      const newPreviews = { ...prev }
      delete newPreviews[imageNumber]
      return newPreviews
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("quantity", formData.quantity)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("offerPrice", formData.offerPrice)
      formDataToSend.append("proCategoryId", formData.proCategoryId)

      // Add images
      Object.entries(images).forEach(([key, file]) => {
        formDataToSend.append(`image${key}`, file)
      })

      const url = product ? `${API_URL}/products/${product._id}` : `${API_URL}/products`
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      })

      if (response.ok) {
        toast.success(product ? "Product updated successfully" : "Product created successfully")
        onSave()
      } else {
        toast.error("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("Error saving product")
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
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
              placeholder="Enter product description"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="proCategoryId"
              value={formData.proCategoryId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
              <input
                type="number"
                name="offerPrice"
                value={formData.offerPrice}
                onChange={handleInputChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="relative">
                  {imagePreviews[num] ? (
                    <div className="group relative border-2 border-gray-300 rounded-lg overflow-hidden">
                      <img
                        src={imagePreviews[num]}
                        alt={`Product preview ${num}`}
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col  gap-1">
                          <label className="px-2 py-1 bg-coffee text-white rounded text-xs cursor-pointer">
                            Change
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, num)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(num)}
                            className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-coffee transition-colors h-24 flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, num)}
                        className="hidden"
                      />
                      <div className="text-gray-500 text-sm">Image {num}</div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-coffee text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}