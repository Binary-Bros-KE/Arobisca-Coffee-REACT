"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BiChevronDown } from "react-icons/bi"

export default function ProductFilters({ categories, onFilterChange, selectedCategory }) {
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    price: true,
  })

  const priceRanges = [
    { label: "Under 500", min: 0, max: 500 },
    { label: "500 - 1000", min: 500, max: 1000 },
    { label: "1000 - 2000", min: 1000, max: 2000 },
    { label: "2000+", min: 2000, max: Number.POSITIVE_INFINITY },
  ]

  const toggleFilter = (filter) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  return (
    <div className="bg-white rounded-lg p-6 h-fit sticky top-20">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <button onClick={() => toggleFilter("category")} className="flex items-center justify-between w-full mb-3">
          <h4 className="font-semibold text-gray-800">Category</h4>
          <motion.div animate={{ rotate: expandedFilters.category ? 180 : 0 }}>
            <BiChevronDown size={16} />
          </motion.div>
        </button>

        {expandedFilters.category && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value=""
                checked={!selectedCategory}
                onChange={() => onFilterChange({ category: "" })}
                className="w-4 h-4 accent-amber-600"
              />
              <span className="text-gray-700">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value={cat._id}
                  checked={selectedCategory === cat._id}
                  onChange={() => onFilterChange({ category: cat._id })}
                  className="w-4 h-4 accent-amber-600"
                />
                <span className="text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <button onClick={() => toggleFilter("price")} className="flex items-center justify-between w-full mb-3">
          <h4 className="font-semibold text-gray-800">Price Range</h4>
          <motion.div animate={{ rotate: expandedFilters.price ? 180 : 0 }}>
            <BiChevronDown size={16} />
          </motion.div>
        </button>

        {expandedFilters.price && (
          <div className="space-y-2">
            {priceRanges.map((range, idx) => (
              <label key={idx} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={() => onFilterChange({ priceRange: range })}
                  className="w-4 h-4 accent-amber-600"
                />
                <span className="text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
