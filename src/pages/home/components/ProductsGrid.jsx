"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "../../../redux/slices/productsSlice"
import { fetchCategories } from "../../../redux/slices/categoriesSlice"
import ProductCard from "../../../components/ProductCard"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function ProductsGrid() {
  const dispatch = useDispatch()
  const { items: products, loading: productsLoading } = useSelector((state) => state.products)
  const { items: categories } = useSelector((state) => state.categories)

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, products.length, categories.length])

  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8)

  // Get new arrivals (last 4)
  const newArrivals = products.slice(-4)

  // Get best sellers (random 4 for demo)
  const bestSellers = products.slice(4, 8)

  return (
    <div className="min-h-screen bg-white">

      {/* Featured Products Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-amber-600 rounded"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Featured <span className="text-amber-600">Products</span>
              </h2>
            </div>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2">
              View All →
            </Link>
          </div>

          {/* Products Grid */}
          {productsLoading && featuredProducts.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-12 px-4 md:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Coffee Experience</h2>
            <p className="text-lg mb-6 opacity-90">
              Discover our finest selection of coffee beans, machines, and accessories
            </p>
            <Link
              to="/products"
              className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-amber-600 rounded"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                New <span className="text-amber-600">Arrivals</span>
              </h2>
            </div>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2">
              View All →
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-amber-600 rounded"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Best <span className="text-amber-600">Sellers</span>
              </h2>
            </div>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2">
              View All →
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Free Shipping",
                description: "On orders over 2000",
                icon: "🚚",
              },
              {
                title: "24/7 Support",
                description: "Dedicated customer service",
                icon: "💬",
              },
              {
                title: "Money Back",
                description: "30-day guarantee",
                icon: "💰",
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-md"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
