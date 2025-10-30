import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function ProductFilters({ categories, onFilterChange, selectedCategory, priceRange }) {
  const navigate = useNavigate()
  const [localMinPrice, setLocalMinPrice] = useState(priceRange?.min || "")
  const [localMaxPrice, setLocalMaxPrice] = useState(priceRange?.max || "")

  // Sync local state with parent when priceRange prop changes
  useEffect(() => {
    setLocalMinPrice(priceRange?.min || "")
    setLocalMaxPrice(priceRange?.max || "")
  }, [priceRange])

  const handleCategoryChange = (categorySlug) => {
    onFilterChange((prev) => ({ ...prev, category: categorySlug }))
    // Update URL to match selected category
    if (categorySlug) {
      navigate(`/products/${categorySlug}`)
    } else {
      navigate("/products")
    }
  }

  const handlePriceChange = () => {
    onFilterChange((prev) => ({
      ...prev,
      priceRange: {
        min: localMinPrice,
        max: localMaxPrice,
      },
    }))
  }

  const handleClearPrice = () => {
    setLocalMinPrice("")
    setLocalMaxPrice("")
    onFilterChange((prev) => ({
      ...prev,
      priceRange: { min: "", max: "" },
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Categories Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Categories</h3>
        <div className="space-y-0">
          <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => handleCategoryChange("")}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-gray-700">All Categories</span>
          </label>
          {categories.map((category) => (
            <label
              key={category._id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.slug}
                onChange={() => handleCategoryChange(category.slug)}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="10000"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePriceChange}
              className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Apply
            </button>
            <button
              onClick={handleClearPrice}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Clear All Filters */}
      <button
        onClick={() => {
          handleCategoryChange("")
          handleClearPrice()
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-semibold"
      >
        Clear All Filters
      </button>
    </div>
  )
}