"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { addToCart } from "../redux/slices/cartSlice"
import { addToFavorites, removeFromFavorites } from "../redux/slices/favoritesSlice"
import { Link } from "react-router-dom"
import { BiHeart } from "react-icons/bi"
import { CgShoppingCart } from "react-icons/cg"
import { FaRegHeart } from "react-icons/fa"

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const favorites = useSelector((state) => state.favorites.items)
  const isFavorite = favorites.some((fav) => fav._id === product._id)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: 1 }))
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

  const discountPercentage =
    product.price && product.offerPrice ? Math.round(((product.price - product.offerPrice) / product.price) * 100) : 0

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative overflow-hidden">
        {/* Image Container */}
        {product.images && product.images.length > 0 ? (
          <Link to={`/product/${product._id}`} className="">

            <img
              src={product.images[0].url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-60 max-md:h-40 object-cover hover:scale-110 transition-transform duration-300"
            />
          </Link>

        ) : (
          <Link to={`/product/${product._id}`} className="">
            <div className="w-full flex items-center justify-center bg-gray-200 text-gray-400">No Image</div>
          </Link>
        )}

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{discountPercentage}% OFF
          </div>
        )}

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleFavorite}
          className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${isFavorite ? "bg-red-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
        >
          <FaRegHeart size={18} fill={isFavorite ? "currentColor" : "currentColor"} />
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 max-md:p-2">
        {/* Category */}
        <p className="text-xs text-green-600 font-semibold uppercase mb-1">
          {product.proCategoryId?.name || "Product"}
        </p>

        {/* Product Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 line-clamp-3 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating (placeholder) */}
        <div className="flex items-center gap-1 my-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xs">
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.offerPrice ? (
            <>
              <span className="text-lg max-md:text-md font-bold text-gray-900">
                Kes {product.offerPrice.toLocaleString('en-KE')}
              </span>
              <span className="text-sm max-md:text-xs text-gray-500 line-through">
                Kes {product.price.toLocaleString('en-KE')}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              Kes {product.price.toLocaleString('en-KE')}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${isAdded ? "bg-green-600 text-white" : "bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
            }`}
        >
          <CgShoppingCart size={16} />
          {isAdded ? "Added!" : "Add to Cart"}
        </motion.button>
      </div>
    </motion.div >
  )
}
