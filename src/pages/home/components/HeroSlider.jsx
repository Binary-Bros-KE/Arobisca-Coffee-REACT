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
        smallText: "Free delivery within Nairobi CBD",
        title: "Save big on the latest coffee trends",
        description:
            "Browse through our diverse range of meticulously crafted coffee products, designed to bring out your individuality and cater to your sense of style.",
        buttonText: "Shop Now",
        href: "",
        buttonLink: "/shop",
        largeImage: "/hero-sliders/coffee-1.jpg",
        smallImage: "/hero-sliders/coffee-1.jpg",
    },
    {
        id: 2,
        smallText: "EXCLUSIVE COLLECTION",
        title: "Premium Coffee Machines for Every Taste",
        description:
            "Discover our curated selection of professional-grade coffee machines that bring café quality to your home.",
        buttonText: "Explore Machines",
        href: "",
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
        href: "",
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
        <div className="w-full overflow-hidden bg-gray-900 h-[450px] max-md:h-[350px]">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                navigation
                loop
                className="w-full h-full"
            >
                {displaySliders.map((slider) => (
                    <SwiperSlide key={slider.id} className="relative w-full h-full">
                        {/* Background Image */}
                        <div
                            className="absolute h-full inset-0 bg-cover bg-center hidden md:block"
                            style={{
                                backgroundImage: `url(${slider.largeImage})`,
                            }}
                        />
                        <div
                            className="absolute h-full inset-0 bg-cover bg-center md:hidden"
                            style={{
                                backgroundImage: `url(${slider.smallImage})`,
                            }}
                        />

                        <div className="min-h-full absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent max-md:py-4" />

                        {/* Content */}
                        <div className="relative h-full flex items-center px-4 max-md:px-8 md:px-16 lg:px-24 py-6">
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
                                    className="text-sm max-md:text-xs md:text-md font-semibold text-amber-600 mb-2 max-md:mb-2 tracking-widest uppercase"
                                >
                                    {slider.smallText}
                                </motion.p>

                                {/* Main Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="text-3xl max-md:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 max-md:mb-4 leading-tight font-serif"
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
                                    className="text-sm max-md:text-xs md:text-lg text-gray-300 mb-6 max-md:mb-2 leading-relaxed max-w-xl"
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
                                    className="border border-white hover:bg-accent-pink-dark text-white font-bold py-2 max-md:py-2 px-6 max-md:px-8 rounded-lg flex items-center gap-2 transition-all duration-300"
                                >
                                    {slider.buttonText}
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </motion.div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
