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
import AboutUsPage from "./pages/about/AboutUsPage"
import ContactPage from "./pages/contact/ContactPage"
import NotFoundPage from "./pages/NotFoundPage"
import AdminAuthGuard from "./pages/adminDash/components/AdminAuthGuard"


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
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:categorySlug" element={<ProductsPage />} />
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

              <Route
                path="/a8f3k9-mgmt-portal/*"
                element={
                  <AdminAuthGuard>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="products" element={<AdminProductsPage />} />
                      <Route path="categories" element={<AdminCategoriesPage />} />
                      <Route path="orders" element={<AdminOrdersPage />} />
                      <Route path="coupons" element={<AdminCouponsPage />} />
                      <Route path="design" element={<AdminBlankPage title="Design Settings" />} />
                      <Route path="shipping-fees" element={<AdminShippingFeesPage />} />
                      <Route path="users" element={<AdminUsersPage />} />
                    </Routes>
                  </AdminAuthGuard>
                }
              />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/success" element={<OrderSuccessPage />} />

              <Route path="*" element={<NotFoundPage />} />
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
