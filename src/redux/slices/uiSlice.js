import { createSlice } from "@reduxjs/toolkit"

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isCartOpen: false,
    isFavoritesOpen: false,
  },
  reducers: {
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen
    },
    toggleFavorites: (state) => {
      state.isFavoritesOpen = !state.isFavoritesOpen
    },
    closeCart: (state) => {
      state.isCartOpen = false
    },
    closeFavorites: (state) => {
      state.isFavoritesOpen = false
    },
  },
})

export const { toggleCart, toggleFavorites, closeCart, closeFavorites } = uiSlice.actions
export default uiSlice.reducer
