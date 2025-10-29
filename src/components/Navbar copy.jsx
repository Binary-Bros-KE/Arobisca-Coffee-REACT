"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiMenu, FiX } from "react-icons/fi"
import { MdShoppingCart, MdFavoriteBorder } from "react-icons/md"
import { IoLocationOutline } from "react-icons/io5"
import { MdLogin } from "react-icons/md"
import { MdLocalOffer } from "react-icons/md"
import { toggleCart, toggleFavorites } from "../redux/slices/uiSlice"
import { logout } from "../redux/slices/authSlice"
import toast from "react-hot-toast"
import { IoMdGift } from "react-icons/io"

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate() // Declare the navigate variable
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBannerOpen, setIsBannerOpen] = useState(true)
  const { user, isAuthenticated, isEmailVerified } = useSelector((state) => state.auth)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const cartItems = useSelector((state) => state.cart.items)
  const favorites = useSelector((state) => state.favorites.items)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "#" },
    { label: "New Arrivals", href: "/products" },
    { label: "Best Sellers", href: "/products" },
    { label: "Brands", href: "#" },
  ]

  const handleLogout = () => {
    dispatch(logout())
    toast.success("You have been successfully logged out")
    setIsProfileOpen(false)
  }

  return (
    <>
      {/* Top Promotional Banner */}
      <AnimatePresence>
        {isBannerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#6F4E37] text-white text-center py-2 text-sm"
          >
            <p>
              Sign up and get 20% off your first order.{" "}
              <a href="#" className="font-semibold underline hover:opacity-80">
                Sign Up Now
              </a>
            </p>
            <button
              onClick={() => setIsBannerOpen(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:opacity-70"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        {/* TOP STRIP - Logo, Search, Icons */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Logo */}
              <Link to="/">
                <motion.div
                  className="flex items-center gap-2 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-10 h-10 bg-[#6F4E37] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-[#6F4E37]">AROBISCA</h1>
                    <p className="text-xs text-[#2D5016] font-semibold">COFFEE</p>
                  </div>
                </motion.div>
              </Link>

              {/* Search Bar - Hidden on Mobile */}
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search coffee, machines, accessories..."
                    className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] transition-all"
                  />
                  <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#6F4E37]" />
                </div>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-4 md:gap-6">
                {/* Track Order - Hidden on Mobile */}
                <motion.button
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoLocationOutline size={20} />
                  <span>Track Order</span>
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  onClick={() => dispatch(toggleFavorites())}
                  className="relative flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdFavoriteBorder size={20} />
                  <span className="hidden md:inline">Wishlist</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {favorites.length}
                    </span>
                  )}
                </motion.button>

                {/* Cart */}
                <motion.button
                  onClick={() => dispatch(toggleCart())}
                  className="relative flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdShoppingCart size={20} />
                  <span className="hidden md:inline">Cart</span>
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartItems.length}
                    </span>
                  )}
                </motion.button>

                {isAuthenticated && user ? (
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                      {isEmailVerified ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Unverified</span>
                      )
                      }
                    </motion.button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-60"
                        >
                          <Link to="/dashboard" onClick={() => setIsProfileOpen(false)}>
                            <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-200 cursor-pointer">
                              <p className="font-semibold text-gray-800">Dashboard</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </Link>
                          <Link to="/dashboard?tab=orders" onClick={() => setIsProfileOpen(false)}>
                            <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">My Orders</div>
                          </Link>
                          <Link to="/dashboard?tab=settings" onClick={() => setIsProfileOpen(false)}>
                            <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">Settings</div>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold border-t border-gray-200"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login">
                    <motion.button
                      className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MdLogin size={20} />
                      <span>Login</span>
                    </motion.button>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden text-[#6F4E37]"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </motion.button>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mt-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP - Navigation Links */}
        <div className="hidden md:block bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-8">
              {/* Browse Categories */}
              <motion.button
                className="flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] font-medium transition-colors whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
              >
                <FiMenu size={18} />
                <span>Browse Categories</span>
              </motion.button>

              {/* Navigation Links */}
              <div className="flex items-center gap-8 flex-1 justify-center">
                {navLinks.map((link, index) => (
                  <Link key={index} to={link.href}>
                    <motion.div
                      className="text-gray-700 hover:text-[#6F4E37] font-medium transition-colors relative group text-sm"
                      whileHover={{ scale: 1.05 }}
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#6F4E37] group-hover:w-full transition-all duration-300"></span>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Right Icons - Daily Deals & Gifts */}
              <div className="flex items-center gap-6">
                <motion.button
                  className="flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] font-medium transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <MdLocalOffer size={18} />
                  <span>Daily Deals</span>
                </motion.button>

                <motion.button
                  className="flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] font-medium transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <IoMdGift size={18} />
                  <span>Gifts</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-50 border-t border-gray-200"
            >
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
                <motion.button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#6F4E37] hover:bg-white rounded transition-colors font-medium">
                  Browse Categories
                </motion.button>

                {navLinks.map((link, index) => (
                  <Link key={index} to={link.href} onClick={() => setIsMenuOpen(false)}>
                    <motion.div className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#6F4E37] hover:bg-white rounded transition-colors">
                      {link.label}
                    </motion.div>
                  </Link>
                ))}

                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  {isAuthenticated && user ? (
                    <div className="relative">
                      <motion.button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex items-center">
                          <span>{user.username}</span>
                          {isEmailVerified ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                          ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Unverified</span>
                          )
                          }
                        </div>
                      </motion.button>

                      <AnimatePresence>
                        {isProfileOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-60"
                          >
                            <Link to="/dashboard" onClick={() => setIsProfileOpen(false)}>
                              <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-200 cursor-pointer">
                                <p className="font-semibold text-gray-800">Dashboard</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </Link>
                            <Link to="/dashboard?tab=orders" onClick={() => setIsProfileOpen(false)}>
                              <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">My Orders</div>
                            </Link>
                            <Link to="/dashboard?tab=settings" onClick={() => setIsProfileOpen(false)}>
                              <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">Settings</div>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-semibold border-t border-gray-200"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link to="/login">
                      <motion.button
                        className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MdLogin size={20} />
                        <span>Login</span>
                      </motion.button>
                    </Link>
                  )}
                  <motion.button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#6F4E37] transition-colors">
                    <MdLocalOffer className="inline mr-2" /> Daily Deals
                  </motion.button>
                  <motion.button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#6F4E37] transition-colors">
                    <IoMdGift className="inline mr-2" /> Gifts
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}

export default Navbar
