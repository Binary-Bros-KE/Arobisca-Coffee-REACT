import { configureStore } from "@reduxjs/toolkit"
import heroSliderReducer from "./slices/heroSliderSlice"
import productsReducer from "./slices/productsSlice"
import favoritesReducer from "./slices/favoritesSlice"
import cartReducer from "./slices/cartSlice"
import categoriesReducer from "./slices/categoriesSlice"
import uiReducer from "./slices/uiSlice"
import authReducer from "./slices/authSlice"
import ordersReducer from "./slices/ordersSlice"

export const store = configureStore({
  reducer: {
    heroSlider: heroSliderReducer,
    products: productsReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    ui: uiReducer,
    auth: authReducer,
    orders: ordersReducer,
  },
})
