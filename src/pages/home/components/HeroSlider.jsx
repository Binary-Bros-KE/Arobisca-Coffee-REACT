"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchHeroSliders } from "../../../redux/slices/heroSliderSlice"
import { isCacheValid } from "../../../utils/cacheManager"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { motion } from "framer-motion"
import { FiArrowRight } from "react-icons/fi"

// Placeholder data for development
const PLACEHOLDER_SLIDERS = [
    {
        id: 1,
        smallText: "UP TO 30% TO 50% OFF",
        title: "Save big on the latest coffee trends",
        description:
            "Browse through our diverse range of meticulously crafted coffee products, designed to bring out your individuality and cater to your sense of style.",
        buttonText: "Shop Now",
        buttonLink: "/shop",
        largeImage: "/premium-coffee-products-display.jpg",
        smallImage: "/coffee-products-mobile.jpg",
    },
    {
        id: 2,
        smallText: "EXCLUSIVE COLLECTION",
        title: "Premium Coffee Machines for Every Taste",
        description:
            "Discover our curated selection of professional-grade coffee machines that bring café quality to your home.",
        buttonText: "Explore Machines",
        buttonLink: "/machines",
        largeImage: "/coffee-machines-showcase.jpg",
        smallImage: "/coffee-machine-mobile.jpg",
    },
    {
        id: 3,
        smallText: "NEW ARRIVALS",
        title: "Essential Coffee Accessories",
        description: "Complete your coffee experience with our handpicked collection of premium accessories and tools.",
        buttonText: "View Accessories",
        buttonLink: "/accessories",
        largeImage: "/coffee-accessories-collection.jpg",
        smallImage: "/coffee-accessories-mobile.jpg",
    },
]

export default function HeroSlider() {
    const dispatch = useDispatch()
    const { sliders, loading, error, lastFetch, cacheExpiry } = useSelector((state) => state.heroSlider)
    const [displaySliders, setDisplaySliders] = useState(PLACEHOLDER_SLIDERS)

    useEffect(() => {
        // Check if cache is still valid
        const isCacheStillValid = isCacheValid(lastFetch, cacheExpiry)

        if (!isCacheStillValid) {
            dispatch(fetchHeroSliders())
        } else if (sliders.length > 0) {
            setDisplaySliders(sliders)
        }
    }, [dispatch, lastFetch, cacheExpiry, sliders])

    // Use placeholder data if no sliders are available
    useEffect(() => {
        if (sliders.length > 0) {
            setDisplaySliders(sliders)
        }
    }, [sliders])

    return (
        <div className="w-full overflow-hidden bg-gray-900">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                navigation
                pagination={{ clickable: true }}
                loop
                className="w-full h-full"
            >
                {displaySliders.map((slider) => (
                    <SwiperSlide key={slider.id} className="relative w-full h-full">
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center hidden md:block"
                            style={{
                                backgroundImage: `url(${slider.largeImage})`,
                            }}
                        />
                        <div
                            className="absolute inset-0 bg-cover bg-center md:hidden"
                            style={{
                                backgroundImage: `url(${slider.smallImage})`,
                            }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />

                        {/* Content */}
                        <div className="relative h-full flex items-center px-4 sm:px-8 md:px-16 lg:px-24">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="max-w-2xl"
                            >
                                {/* Small Text */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                    className="text-sm sm:text-base md:text-lg font-semibold text-coffee-light mb-2 sm:mb-4 tracking-widest"
                                >
                                    {slider.smallText}
                                </motion.p>

                                {/* Main Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight font-serif"
                                >
                                    {slider.title.split(" ").map((word, idx) => (
                                        <span key={idx} className={idx % 3 === 1 ? "text-accent-pink" : "text-white"}>
                                            {word}{" "}
                                        </span>
                                    ))}
                                </motion.h1>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-xl"
                                >
                                    {slider.description}
                                </motion.p>

                                {/* CTA Button */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => (window.location.href = slider.buttonLink)}
                                    className="bg-secondary hover:bg-accent-pink-dark text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg flex items-center gap-2 transition-all duration-300 grou"
                                >
                                    {slider.buttonText}
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Loading State */}
            {/* {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-pink" />
                </div>
            )} */}

            {/* Error State */}
            {/* {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-lg">
                    <p className="text-sm">Error loading sliders: {error}</p>
                </div>
            )} */}
        </div>
    )
}
