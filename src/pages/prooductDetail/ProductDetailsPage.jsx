"use client"

import { useState, useMemo, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Thumbs, Navigation } from "swiper/modules"
import { motion } from "framer-motion"
import { addToCart } from "../../redux/slices/cartSlice"
import { addToFavorites, removeFromFavorites } from "../../redux/slices/favoritesSlice"
import Breadcrumb from "../../components/Breadcrumb"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import { BiHeart, BiMinus, BiPlus } from "react-icons/bi"
import { FiShoppingCart } from "react-icons/fi"

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const dispatch = useDispatch()
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const products = useSelector((state) => state.products.items)
  const favorites = useSelector((state) => state.favorites.items)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get product from Redux state
  const product = useMemo(() => products.find((p) => p._id === productId), [products, productId])

  const isFavorite = product && favorites.some((fav) => fav._id === product._id)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <a href="/products" className="text-amber-600 hover:text-amber-700 font-semibold">
            Back to Products
          </a>
        </div>
      </div>
    )
  }

  const discountPercentage =
    product.price && product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }))
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product._id))
    } else {
      dispatch(addToFavorites(product))
    }
  }

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(product.quantity, quantity + value))
    setQuantity(newQuantity)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb categoryName={product.proCategoryId?.name} />

      <div className="px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 md:p-10">
            {/* Image Section */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <Swiper
                modules={[Thumbs, Navigation]}
                thumbs={{ swiper: thumbsSwiper }}
                navigation
                className="w-full h-96 md:h-[500px] rounded-lg overflow-hidden bg-gray-100"
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img.url || "/placeholder.svg"}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      No Image Available
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[Thumbs]}
                  spaceBetween={10}
                  slidesPerView={4}
                  className="w-full"
                >
                  {product.images.map((img, idx) => (
                    <SwiperSlide key={idx} className="cursor-pointer">
                      <img
                        src={img.url || "/placeholder.svg"}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-20 object-cover rounded-lg border-2 border-transparent hover:border-amber-600 transition-colors"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between">
              {/* Category & Title */}
              <div>
                <p className="text-sm text-green-600 font-semibold uppercase mb-2">
                  {product.proCategoryId?.name || "Product"}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">(0 reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{product.offerPrice || product.price}</span>
                    {product.offerPrice && <span className="text-xl text-gray-500 line-through">{product.price}</span>}
                  </div>
                  {discountPercentage > 0 && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Save {discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                {/* Stock Status */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Availability:{" "}
                    <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {product.quantity > 0 ? `In Stock (${product.quantity} available)` : "Out of Stock"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                {product.quantity > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-semibold">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <BiMinus size={16} />
                      </motion.button>
                      <span className="px-6 py-2 font-semibold text-gray-900">{quantity}</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <BiPlus size={16} />
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Add to Cart & Favorite Buttons */}
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${isAdded
                        ? "bg-green-600 text-white"
                        : product.quantity === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-amber-600 text-white hover:bg-amber-700"
                      }`}
                  >
                    <FiShoppingCart size={20} />
                    {isAdded ? "Added to Cart!" : "Add to Cart"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleFavorite}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${isFavorite
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    <BiHeart size={20} fill={isFavorite ? "currentColor" : "none"} />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
