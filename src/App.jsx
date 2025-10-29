import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

// components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import CartSidebar from "./components/CartSidebar"
import FavoritesSidebar from "./components/FavoritesSidebar"
import CartFloatingButton from "./components/CartFloatingButton"
import ProtectedRoute from "./components/ProtectedRoute"

// pages
import Home from './pages/home/Home'
import ProductsPage from './pages/products/ProductsPage'
import ProductDetailsPage from './pages/prooductDetail/ProductDetailsPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import OrderSuccessPage from './pages/checkout/components/OrderSuccessPage'

// Auth Routes 
import LoginPage from "./pages/auth/LoginPage"
import SignupPage from "./pages/auth/SignupPage"
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage"
import VerifyCodePage from "./pages/auth/VerifyCodePage"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import UserDashboard from "./pages/userDash/UserDashboard"

// Admin Routes
import AdminDashboard from "./pages/adminDash/AdminDashboard"
import AdminProductsPage from "./pages/adminDash/AdminProductsPage"
import AdminCategoriesPage from "./pages/adminDash/AdminCategoriesPage"
import AdminBlankPage from "./pages/adminDash/AdminBlankPage"
import SessionGuard from "./components/SessionGuard"
import EmailVerificationPage from "./pages/auth/EmailVerificationPage"
import AdminShippingFeesPage from "./pages/adminDash/AdminShippingFeesPage"
import AdminCouponsPage from "./pages/adminDash/AdminCouponsPage"
import AdminOrdersPage from "./pages/adminDash/AdminOrdersPage"
import AdminUsersPage from "./pages/adminDash/AdminUsersPage"
import ScrollToTop from "./services/ScrollToTop"


function App() {
  return (
    <Router>
      <ScrollToTop />
      <SessionGuard>
        <div className="flex flex-col min-h-screen">
          <Toaster position="top-right" />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:productId" element={<ProductDetailsPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-code" element={<VerifyCodePage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route path="/admin-panel" element={<AdminDashboard />} />
              <Route path="/admin-panel/products" element={<AdminProductsPage />} />
              <Route path="/admin-panel/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin-panel/orders" element={<AdminOrdersPage />} />
              <Route path="/admin-panel/coupons" element={<AdminCouponsPage />} />
              <Route path="/admin-panel/design" element={<AdminBlankPage title="Design Settings" />} />
              <Route path="/admin-panel/shipping-fees" element={<AdminShippingFeesPage />} />
              <Route path="/admin-panel/users" element={<AdminUsersPage />} />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<OrderSuccessPage />} />
            </Routes>
          </main>
          <Footer />

          <CartSidebar />
          <FavoritesSidebar />
          <CartFloatingButton />
        </div>
      </SessionGuard>
    </Router>
  )
}

export default App
