"use client"

import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { toggleCart } from "../redux/slices/uiSlice"
import { CgShoppingCart } from "react-icons/cg"

export default function CartFloatingButton() {
  const dispatch = useDispatch()
  const cartItems = useSelector((state) => state.cart.items)
  const isCartOpen = useSelector((state) => state.ui.isCartOpen)

  const handleClick = () => {
    dispatch(toggleCart())
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed right-6 bottom-6 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-colors z-30 cursor-pointer"
    >
      <CgShoppingCart size={24} />
      {cartItems.length > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
        >
          {cartItems.length}
        </motion.span>
      )}
    </motion.button>
  )
}
