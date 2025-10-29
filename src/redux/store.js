import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import heroSliderReducer from "./slices/heroSliderSlice"
import productsReducer from "./slices/productsSlice"
import favoritesReducer from "./slices/favoritesSlice"
import cartReducer from "./slices/cartSlice"
import categoriesReducer from "./slices/categoriesSlice"
import uiReducer from "./slices/uiSlice"
import authReducer from "./slices/authSlice"
import ordersReducer from "./slices/ordersSlice"
import usersReducer from './slices/usersSlice'
import dashboardReducer from './slices/dashboardSlice'

// Combine all reducers first
const rootReducer = combineReducers({
  heroSlider: heroSliderReducer,
  products: productsReducer,
  favorites: favoritesReducer,
  cart: cartReducer,
  categories: categoriesReducer,
  ui: uiReducer,
  auth: authReducer,
  orders: ordersReducer,
  users: usersReducer,
  dashboard: dashboardReducer,
})

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'favorites', 'ui'], // Only persist these slices
  timeout: 1000,
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)