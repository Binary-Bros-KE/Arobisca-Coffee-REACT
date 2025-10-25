"use client"

import { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { fetchProducts } from "../../redux/slices/productsSlice"
import { fetchCategories } from "../../redux/slices/categoriesSlice"
import ProductCard from "../../components/ProductCard"
import ProductFilters from "./components/ProductFilters"
import Breadcrumb from "../../components/Breadcrumb"

export default function ProductsPage() {
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get("category")

  const { items: products, loading: productsLoading } = useSelector((state) => state.products)
  const { items: categories } = useSelector((state) => state.categories)
  const [filters, setFilters] = useState({ category: categoryId || "", priceRange: null })
  const [sortBy, setSortBy] = useState("newest")

  // Fetch data on mount
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, products.length, categories.length])

  // Update filter when category param changes
  useEffect(() => {
    if (categoryId) {
      setFilters((prev) => ({ ...prev, category: categoryId }))
    }
  }, [categoryId])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (filters.category) {
      result = result.filter((product) => product.proCategoryId?._id === filters.category)
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter((product) => {
        const price = product.offerPrice || product.price
        return price >= filters.priceRange.min && price <= filters.priceRange.max
      })
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price))
        break
      case "price-high":
        result.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price))
        break
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    return result
  }, [products, filters, sortBy])

  const selectedCategory = categories.find((cat) => cat._id === filters.category)

  return (
    <div className="min-h-screen bg-gray-50">
      <Breadcrumb categoryName={selectedCategory?.name} />

      <div className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {selectedCategory ? selectedCategory.name : "All Products"}
              </h1>
              <p className="text-gray-600 mt-2">{filteredProducts.length} products found</p>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters categories={categories} onFilterChange={setFilters} selectedCategory={filters.category} />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {productsLoading && filteredProducts.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
