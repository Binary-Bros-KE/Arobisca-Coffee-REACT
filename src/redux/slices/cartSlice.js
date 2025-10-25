import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((cartItem) => cartItem._id === item._id)

      if (existingItem) {
        existingItem.quantity += item.quantity || 1
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 })
      }

      // Calculate total using offerPrice if available, otherwise use price
      state.totalPrice = state.items.reduce((total, cartItem) => {
        const price = cartItem.offerPrice || cartItem.price
        return total + price * cartItem.quantity
      }, 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload)
      state.totalPrice = state.items.reduce((total, cartItem) => {
        const price = cartItem.offerPrice || cartItem.price
        return total + price * cartItem.quantity
      }, 0)
    },
    updateCartQuantity: (state, action) => {
      const { _id, quantity } = action.payload
      const item = state.items.find((cartItem) => cartItem._id === _id)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
      state.totalPrice = state.items.reduce((total, cartItem) => {
        const price = cartItem.offerPrice || cartItem.price
        return total + price * cartItem.quantity
      }, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalPrice = 0
    },
  },
})

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
