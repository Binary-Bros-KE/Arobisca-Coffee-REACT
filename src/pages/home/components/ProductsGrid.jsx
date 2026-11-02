"use client"

import { useEffect, useMemo, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "../../../redux/slices/productsSlice"
import { fetchCategories } from "../../../redux/slices/categoriesSlice"
import ProductCard from "../../../components/ProductCard"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaShippingFast } from "react-icons/fa"
import { BiSupport } from "react-icons/bi"
import { MdOutlineCoffeeMaker } from "react-icons/md"
import BenefitsSection from "../../../components/BenefitsSection"

export default function ProductsGrid() {
  const dispatch = useDispatch()
  const { items: products, loading: productsLoading } = useSelector((state) => state.products)
  const { items: categories } = useSelector((state) => state.categories)

  const shuffledProductsRef = useRef(null)

  // Memoize the shuffled and distributed products
  const { dailyDeals, newArrivals, bestSellers } = useMemo(() => {
    // If we already shuffled, return the cached version
    if (shuffledProductsRef.current) {
      return shuffledProductsRef.current
    }

    // Only shuffle if we have products
    if (products.length === 0) {
      return { dailyDeals: [], newArrivals: [], bestSellers: [] }
    }

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    // Shuffle all products once
    const shuffled = shuffleArray(products)

    // Distribute products without repetition
    const result = {
      dailyDeals: shuffled.slice(0, 8),
      newArrivals: shuffled.slice(8, 16),
      bestSellers: shuffled.slice(16, 24)
    }

    // Cache the result so it doesn't change on re-renders
    shuffledProductsRef.current = result

    return result
  }, [products.length])



  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, products.length, categories.length])



  return (
    <div className="min-h-screen bg-white">

      {/* Featured Products Section */}
      <section className="py-12 px-4 md:px-8 bg-white" id="daily-deals">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-amber-600 rounded"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Our Daily <span className="text-amber-600">Deals</span>
              </h2>
            </div>
            <Link to="/products" className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2">
              View All →
            </Link>
          </div>

          {/* Products Grid */}
          {productsLoading && dailyDeals.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-md:gap-2">
              {dailyDeals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="relative py-12 px-4 md:px-8 bg-[url('https://res.cloudinary.com/dxybhmfpe/image/upload/v1766754007/37_c4fadm.jpg')] bg-center bg-cover">
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="max-w-7xl mx-auto relative z-10">
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
      <section className="py-12 px-4 md:px-8 bg-gray-50" id="new-arrivals">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-md:gap-2">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-12 px-4 md:px-8 bg-white" id="best-sellers">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-md:gap-2">
            {bestSellers.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <BenefitsSection />
    </div>
  )
}
