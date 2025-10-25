"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiMenu, FiX, FiHome, FiBox, FiTag, FiShoppingCart, FiGift, FiSettings } from "react-icons/fi"
import { Link, useLocation } from "react-router-dom"

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  const menuItems = [
    { label: "Dashboard", icon: FiHome, path: "/admin-panel" },
    { label: "Products", icon: FiBox, path: "/admin-panel/products" },
    { label: "Categories", icon: FiTag, path: "/admin-panel/categories" },
    { label: "Orders", icon: FiShoppingCart, path: "/admin-panel/orders" },
    { label: "Coupons", icon: FiGift, path: "/admin-panel/coupons" },
    { label: "Design", icon: FiSettings, path: "/admin-panel/design" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-coffee text-white p-2 rounded-lg"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg z-40 lg:static lg:translate-x-0 overflow-y-auto"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-coffee">AROBISCA</h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active ? "bg-coffee text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
