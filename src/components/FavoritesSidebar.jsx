"use client"

import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { removeFromFavorites } from "../redux/slices/favoritesSlice"
import { addToCart } from "../redux/slices/cartSlice"
import { toggleFavorites } from "../redux/slices/uiSlice"
import { Link } from "react-router-dom"
import { CgShoppingCart } from "react-icons/cg"
import { BiTrash } from "react-icons/bi"
import { IoClose } from "react-icons/io5"

export default function FavoritesSidebar() {
  const dispatch = useDispatch()
  const isOpen = useSelector((state) => state.ui.isFavoritesOpen)
  const favorites = useSelector((state) => state.favorites.items)

  const handleClose = () => {
    dispatch(toggleFavorites())
  }

  const handleRemove = (productId) => {
    dispatch(removeFromFavorites(productId))
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed left-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-gray-900">Favorites</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <IoClose size={24} />
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-600 text-lg mb-4">No favorites yet</p>
                  <Link
                    to="/products"
                    onClick={handleClose}
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                favorites.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <Link to={`/product/${product._id}`} onClick={handleClose} className="flex-shrink-0">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${product._id}`} onClick={handleClose}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{product.proCategoryId?.name}</p>
                      <p className="text-lg font-bold text-gray-900 mt-2">Kes {product.offerPrice.toLocaleString('en-KE') || product.price.toLocaleString('en-KE')}</p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 flex items-center justify-center gap-1 bg-amber-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors cursor-pointer"
                        >
                          <CgShoppingCart size={14} />
                          Add
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemove(product._id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          <BiTrash size={14} />
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
