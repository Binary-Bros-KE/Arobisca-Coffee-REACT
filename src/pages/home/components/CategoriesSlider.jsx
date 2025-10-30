"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import { motion } from "framer-motion"
import { fetchCategories } from "../../../redux/slices/categoriesSlice"
import { Link } from "react-router-dom"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function CategoriesSlider() {
  const dispatch = useDispatch()
  const { items: categories, loading } = useSelector((state) => state.categories)

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories())
    }
  }, [dispatch, categories.length])

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <section className="py-6 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-amber-600 rounded"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Shop Our <span className="text-amber-600">Top Categories</span>
          </h2>
        </div>

        {/* Swiper */}
        <div className="grid max-md:grid-cols-2 grid-cols-6 gap-2">
          {categories.map((category) => (
            <SwiperSlide key={category._id}>
              <Link to={`/products/${category.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative h-18 md:h-26 rounded-lg overflow-hidden cursor-pointer group"
                >
                  {/* Background Image */}
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <h3 className="text-white text-md font-semibold md:text-2xl md:font-bold  text-center px-4">{category.name}</h3>
                  </div>
                </motion.div>
              </Link>
            </SwiperSlide>
          ))}
        </div>
      </div>
    </section>
  )
}
