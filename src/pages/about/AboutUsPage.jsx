"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { FiPhone, FiMapPin, FiClock } from "react-icons/fi"

export default function AboutUsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-8 bg-[url('/hero-sliders/coffee-1.jpg')] bg-center bg-cover">
      <div className="bg-black/70 absolute inset-0"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About <span className="text-amber-600">AROBISCA COFFEE</span>
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Premium coffee products, machines, and accessories delivered across Kenya
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-8 bg-amber-600 rounded"></div>
                  <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                </div>
              </motion.div>

              <motion.p variants={itemVariants} className="text-gray-600 text-lg leading-relaxed mb-6">
                AROBISCA COFFEE was established in 2017 to foster small-scale coffee growing farmers with modern
                producing, processing & fermenting technology to guarantee uniqueness of high-quality coffee for
                consumption. We pride ourselves in consistency across our various coffee blends.
              </motion.p>

              <motion.p variants={itemVariants} className="text-gray-600 text-lg leading-relaxed mb-8">
                We also supply coffee machines, grinders, purees, sauces, and syrups that suit a wide range of beverage
                creation. Our commitment to quality and innovation has made us a trusted name in the coffee industry
                across Kenya.
              </motion.p>

              <motion.div variants={itemVariants}>
                <Link
                  to="/products"
                  className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                >
                  Explore Our Products
                </Link>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img src="/hero-sliders/coffee-1.jpg" alt="AROBISCA Coffee Farm" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg">Experience excellence in every aspect of our service</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Easy to Order",
                description:
                  "Enjoy hassle-free ordering with our intuitive platform, making your coffee purchase a breeze.",
                icon: "🛒",
              },
              {
                title: "Fastest Delivery",
                description:
                  "Experience lightning-fast delivery times (within 6hrs), ensuring your coffee reaches you when you need it most.",
                icon: "⚡",
              },
              {
                title: "Quality Coffee",
                description:
                  "Savor the finest quality coffee beans sourced from the most reputable growers, ensuring every sip is perfection.",
                icon: "☕",
              },
            ].map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Product Range</h2>
            <p className="text-gray-600 text-lg">Comprehensive selection of premium coffee products</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {["Coffee", "Fruit Purees", "Syrups", "Sauces", "Accessories", "Machines"].map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-amber-50 to-green-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow"
              >
                <p className="text-gray-900 font-semibold">{category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-gray-600 text-lg">We're here to help and answer any questions you might have</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Details */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Phone */}
              <motion.div variants={itemVariants} className="flex gap-4">
                <div className="flex-shrink-0">
                  <FiPhone className="w-6 h-6 text-amber-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                  <p className="text-gray-600">+254 795 982 056</p>
                  <p className="text-gray-600">+254 724 637 787</p>
                  <p className="text-gray-600">+254 701 345 482</p>
                </div>
              </motion.div>

              {/* Address */}
              <motion.div variants={itemVariants} className="flex gap-4">
                <div className="flex-shrink-0">
                  <FiMapPin className="w-6 h-6 text-amber-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">Nabui House, 1st Floor</p>
                  <p className="text-gray-600">Westlands, Nairobi Kenya</p>
                </div>
              </motion.div>

              {/* Working Hours */}
              <motion.div variants={itemVariants} className="flex gap-4">
                <div className="flex-shrink-0">
                  <FiClock className="w-6 h-6 text-amber-600 mt-1" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Working Hours</h3>
                  <p className="text-gray-600">Mon - Fri: 9:00 AM - 9:00 PM</p>
                  <p className="text-gray-600">Saturday: 1:00 PM - 8:00 PM</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img src="/hero-sliders/coffee-2.jpeg" alt="AROBISCA Coffee Shop" className="w-full h- max-h-90 object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
