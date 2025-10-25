import { createSlice } from "@reduxjs/toolkit"

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
  },
  reducers: {
    addToFavorites: (state, action) => {
      const item = action.payload
      const exists = state.items.find((fav) => fav._id === item._id)
      if (!exists) {
        state.items.push(item)
      }
    },
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload)
    },
    clearFavorites: (state) => {
      state.items = []
    },
  },
})

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer
