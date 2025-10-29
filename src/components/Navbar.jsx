"use client"

import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiMenu, FiX, FiChevronDown } from "react-icons/fi"
import { MdShoppingCart, MdFavoriteBorder } from "react-icons/md"
import { IoLocationOutline } from "react-icons/io5"
import { MdLogin } from "react-icons/md"
import { MdLocalOffer } from "react-icons/md"
import { toggleCart, toggleFavorites } from "../redux/slices/uiSlice"
import { logout } from "../redux/slices/authSlice"
import { fetchCategories } from "../redux/slices/categoriesSlice"
import { fetchProducts } from "../redux/slices/productsSlice"
import toast from "react-hot-toast"
import { IoMdGift } from "react-icons/io"

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBannerOpen, setIsBannerOpen] = useState(true)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState({ products: [], categories: [] })
  const { user, isAuthenticated, isEmailVerified } = useSelector((state) => state.auth)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const cartItems = useSelector((state) => state.cart.items)
  const favorites = useSelector((state) => state.favorites.items)
  const categories = useSelector((state) => state.categories.items)
  const products = useSelector((state) => state.products.items)
  const searchRef = useRef(null)
  const categoriesRef = useRef(null)

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "About", href: "#" },
    { label: "New Arrivals", href: "/#new-arrivals" },
    { label: "Best Sellers", href: "/#best-sellers" },
    { label: "Contact", href: "#" },
  ]

  // Fetch categories and products on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, categories.length, products.length])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const query = searchQuery.toLowerCase().trim()

      const matchedCategories = categories.filter(category =>
        category.name.toLowerCase().includes(query) ||
        category.slug?.toLowerCase().includes(query)
      ).slice(0, 3) // Limit to 3 categories

      const matchedProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      ).slice(0, 5) // Limit to 5 products

      setSearchResults({
        categories: matchedCategories,
        products: matchedProducts
      })
      setIsSearchOpen(true)
    } else {
      setSearchResults({ products: [], categories: [] })
      setIsSearchOpen(false)
    }
  }, [searchQuery, categories, products])

  const handleLogout = () => {
    dispatch(logout())
    toast.success("You have been successfully logged out")
    setIsProfileOpen(false)
  }

  const handleCategoryClick = (categorySlug) => {
    navigate(`/products?category=${categorySlug}`)
    setIsCategoriesOpen(false)
    setIsMenuOpen(false)
  }

  const handleSearchResultClick = (type, item) => {
    if (type === 'category') {
      navigate(`/products?category=${item.slug}`)
    } else if (type === 'product') {
      navigate(`/product/${item._id}`)
    }
    setSearchQuery("")
    setIsSearchOpen(false)
    setIsMenuOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchOpen(false)
    }
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
            className="bg-[#6F4E37] text-white text-center py-2 text-sm relative"
          >
            <p>
              Enjoy Free Deliveries Around Nairobi CBD.{" "}
              <a href="/signup" className="font-semibold underline hover:opacity-80">
                Sign Up Now
              </a>
            </p>
            <button
              onClick={() => setIsBannerOpen(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:opacity-70 cursor-pointer hidden md:block"
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
                  className="flex items-center flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="">
                    <img src="/coffee-cup.png" alt="" className="h-15 min-w-15" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-[#6F4E37]">
                      <img src="/logo.png" alt="" className="" />
                    </h1>
                  </div>
                </motion.div>
              </Link>

              {/* Search Bar - Hidden on Mobile */}
              <div className="hidden md:flex flex-1 max-w-md" ref={searchRef}>
                <form onSubmit={handleSearchSubmit} className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search coffee, machines, accessories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37] transition-all"
                  />
                  <button type="submit">
                    <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-[#6F4E37]" />
                  </button>

                  {/* Search Suggestions Dropdown */}
                  <AnimatePresence>
                    {isSearchOpen && (searchResults.products.length > 0 || searchResults.categories.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-96 overflow-y-auto z-50"
                      >
                        {/* Categories Section */}
                        {searchResults.categories.length > 0 && (
                          <div className="p-2 border-b border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">
                              Categories
                            </p>
                            {searchResults.categories.map((category) => (
                              <button
                                key={category._id}
                                onClick={() => handleSearchResultClick('category', category)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-2"
                              >
                                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                  <span className="text-green-600 text-xs font-bold">C</span>
                                </div>
                                <span className="text-sm text-gray-700">{category.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Products Section */}
                        {searchResults.products.length > 0 && (
                          <div className="p-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-1">
                              Products
                            </p>
                            {searchResults.products.map((product) => (
                              <button
                                key={product._id}
                                onClick={() => handleSearchResultClick('product', product)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md flex items-center gap-3 cursor-pointer"
                              >
                                <img
                                  src={product.images?.[0]?.url || '/placeholder.jpg'}
                                  alt={product.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-800 truncate">{product.name}</p>
                                  <p className="text-xs text-gray-600">
                                    KES {(product.offerPrice || product.price)?.toLocaleString()}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-4 md:gap-6">
                {/* Track Order - Hidden on Mobile */}
                <motion.a
                  className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href="/dashboard?tab=orders"
                >
                  <IoLocationOutline size={20} />
                  <span>Track Order</span>
                </motion.a>

                {/* Wishlist */}
                <motion.button
                  onClick={() => dispatch(toggleFavorites())}
                  className="relative flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MdFavoriteBorder size={20} />
                  <span className="hidden md:inline">Wishlist</span>
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold cursor-pointer">
                      {favorites.length}
                    </span>
                  )}
                </motion.button>

                {/* Cart */}
                <motion.button
                  onClick={() => dispatch(toggleCart())}
                  className="relative flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm cursor-pointer"
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

                {/* User Profile */}
                {isAuthenticated && user ? (
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="hidden md:flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm cursor-pointer"
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
                      )}
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
                      className="bg-[#6F4E37] hidden md:flex items-center gap-2 text-white py-2 px-4 rounded-md transition-colors text-sm cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MdLogin size={20} />
                      <span className="">Login</span>
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
            <div className="md:hidden mt-3" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6F4E37]"
                />
                <button type="submit">
                  <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </button>

                {/* Mobile Search Suggestions */}
                <AnimatePresence>
                  {isSearchOpen && (searchResults.products.length > 0 || searchResults.categories.length > 0) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-64 overflow-y-auto z-50"
                    >
                      {/* Categories */}
                      {searchResults.categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => handleSearchResultClick('category', category)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-2"
                        >
                          <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                            <span className="text-green-600 text-xs font-bold">C</span>
                          </div>
                          <span className="text-sm text-gray-700">{category.name}</span>
                        </button>
                      ))}
                      {/* Products */}
                      {searchResults.products.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleSearchResultClick('product', product)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-3"
                        >
                          <img
                            src={product.images?.[0]?.url || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 truncate">{product.name}</p>
                            <p className="text-xs text-gray-600">
                              KES {(product.offerPrice || product.price)?.toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM STRIP - Navigation Links */}
        <div className="hidden md:block bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-8">
              {/* Browse Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <motion.button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] font-medium transition-colors whitespace-nowrap cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiMenu size={18} />
                  <span>Browse Categories</span>
                  <FiChevronDown size={16} className={`transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {isCategoriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-2 max-h-80 overflow-y-auto">
                        {categories.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => handleCategoryClick(category.slug)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md text-sm text-gray-700 flex items-center gap-3 cursor-pointer"
                          >
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-6 h-6 object-cover rounded"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                <span className="text-green-600 text-xs font-bold">C</span>
                              </div>
                            )}
                            <span>{category.name}</span>
                          </button>
                        ))}
                        {categories.length === 0 && (
                          <p className="px-3 py-2 text-sm text-gray-500">No categories available</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                <Link
                  to="/#daily-deals"
                  className="flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] font-medium transition-colors text-sm cursor-pointer"
                >
                  <MdLocalOffer size={18} />
                  <span>Daily Deals</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

{/* Mobile Menu */}
<AnimatePresence>
  {isMenuOpen && (
    <>
      {/* Background overlay (click to close) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Slide-in Menu */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-xl"
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
          {/* Categories */}
          <div className="space-y-2">
            <p className="px-4 py-2 font-semibold text-gray-700">Categories</p>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategoryClick(category.slug)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#6F4E37] hover:bg-gray-50 rounded transition-colors flex items-center gap-3"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-6 h-6 object-cover rounded"
                  />
                ) : (
                  <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">C</span>
                  </div>
                )}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Other Navigation Links */}
          {navLinks.map((link, index) => (
            <Link key={index} to={link.href} onClick={() => setIsMenuOpen(false)}>
              <motion.div
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#6F4E37] hover:bg-gray-50 rounded transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                {link.label}
              </motion.div>
            </Link>
          ))}

          {/* Additional Mobile Menu Items */}
          <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
            {isAuthenticated && user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-[#6F4E37] transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{user.username}</span>
                    {isEmailVerified ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Unverified
                      </span>
                    )}
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
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">
                          My Orders
                        </div>
                      </Link>
                      <Link to="/dashboard?tab=settings" onClick={() => setIsProfileOpen(false)}>
                        <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-gray-700">
                          Settings
                        </div>
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
                  className="hidden max-md:flex my-4 items-center gap-2 bg-[#6F4E37] text-white py-2 px-8 rounded text-xl"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MdLogin size={20} />
                  <span>Login</span>
                </motion.button>
              </Link>
            )}
            <motion.button className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#6F4E37] transition-colors">
              <MdLocalOffer className="inline mr-2" /> Daily Deals
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

      </nav>
    </>
  )
}

export default Navbar