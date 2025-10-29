"use client"

import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { removeFromCart, updateCartQuantity } from "../redux/slices/cartSlice"
import { toggleCart } from "../redux/slices/uiSlice"
import { Link, useNavigate } from "react-router-dom"
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi"
import { IoClose } from "react-icons/io5"

export default function CartSidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isOpen = useSelector((state) => state.ui.isCartOpen)
  const { items: cartItems, totalPrice } = useSelector((state) => state.cart)

  const handleClose = () => {
    dispatch(toggleCart())
  }

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleCheckout = () => {
    dispatch(toggleCart())
    navigate("/checkout");
  }

  const handleQuantityChange = (productId, quantity) => {
    dispatch(updateCartQuantity({ _id: productId, quantity }))
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
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-300">
              <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
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
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
                  <Link
                    to="/products"
                    onClick={handleClose}
                    className="text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    {/* Product Image */}
                    <Link to={`/product/${item._id}`} onClick={handleClose} className="flex-shrink-0">
                      <img
                        src={item.images?.[0]?.url}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item._id}`} onClick={handleClose}>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-amber-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.offerPrice || item.price} x {item.quantity}
                      </p>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        {((item.offerPrice || item.price) * item.quantity).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                        >
                          <BiMinus size={14} />
                        </motion.button>
                        <span className="px-2 font-semibold">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors cursor-pointer"
                        >
                          <BiPlus size={14} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleRemove(item._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <BiTrash size={18} />
                    </motion.button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t p-6 space-y-4 border-gray-300">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-amber-600">Kes {totalPrice.toLocaleString('en-KE')}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors cursor-pointer"
                >
                  Proceed to Checkout
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
