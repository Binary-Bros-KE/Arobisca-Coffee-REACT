"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiArrowRight, FiMail, FiPhone, FiMapPin } from "react-icons/fi"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

const Footer = () => {
  const [email, setEmail] = useState("")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    console.log("Subscribed with email:", email)
    setEmail("")
  }

  return (
    <footer className="bg-black text-gray-100">
      {/* Main Footer Content */}
      <motion.div
        className="max-w-6xl mx-auto px-4 py-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Subscribe Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4 text-[#6f4e37]">AROBISCA</h3>
            <p className="text-sm text-gray- mb-4 ">Premium coffee for coffee lovers</p>

            <div>
              <label className="block text-sm font-semibold mb-2">Subscribe</label>
              <p className="text-xs text-gray-100 mb-3">Be the first to know when new items are in stock. Subscribe!</p>

              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-transparent border border-white rounded text-gray-100 placeholder-gray-200 focus:outline-none focus:border-[#6F4E37] transition-colors text-sm"
                  required
                />
                <motion.button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6f4e37] hover:text-amber-800 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiArrowRight size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Get in Touch */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-4 text-[#6f4e37]">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-gray-100">
              <li className="flex items-start gap-3 hover:text-[#6f4e37] transition-colors cursor-pointer">
                <FiMapPin className="mt-1 flex-shrink-0 text-[#6f4e37]" />
                <span>
                  Nabui house, 1st floor <br />
                  Westlands
                </span>
              </li>
              <li className="flex items-center gap-3 hover:text-[#6f4e37] transition-colors cursor-pointer">
                <FiMail className="flex-shrink-0 text-[#6f4e37]" />
                <a href="mailto:hello@arobisca.com">
                  	info@arobiscacoffee.co.ke
                </a>
              </li>
              <li className="flex items-center gap-3 hover:text-[#6f4e37] transition-colors cursor-pointer">
                <FiPhone className="flex-shrink-0 text-[#6f4e37]" />
                <a href="tel:+1234567890">
                  +254 795 982 056 <br />
                  +254 724 637 787 <br />
                  +254 701 345 482
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Account */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-4 text-[#6f4e37]">Account</h4>
            <ul className="space-y-2 text-sm text-gray-100">
              <li>
                <a href="/dashboard" className="hover:text-[#6f4e37] transition-colors">
                  My Account
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-[#6f4e37] transition-colors">
                  Login 
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:text-[#6f4e37] transition-colors">
                  Register
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-[#6f4e37] transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#6f4e37] transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-4 text-[#6f4e37]">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-100">
              <li>
                <a href="/#new-arrivals" className="hover:text-[#6f4e37] transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="/#best-sellers" className="hover:text-[#6f4e37] transition-colors">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-[#6f4e37] transition-colors">
                  On Sale
                </a>
              </li>
              <li>
                <a href="/#daily-deals" className="hover:text-[#6f4e37] transition-colors">
                  Daily Deals
                </a>
              </li>
              <li>
                <a href="/dashboard?tab=orders" className="hover:text-[#6f4e37] transition-colors">
                  Track Order
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Download App */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-4 text-[#6f4e37]">We Are Social</h4>
            <p className="text-xs text-gray-100 mb-3">Follow Us on social media for daily updates.</p>

            {/* Social Media */}
            <div className="grid grid-cols-2 gap-2">
              <motion.a
                href="#"
                className="h-12 bg-[#2D5016] rounded-md flex items-center justify-center hover:bg-[#6F4E37] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaFacebook size={40} />
              </motion.a>
              <motion.a
                href="#"
                className="h-12 bg-[#2D5016] rounded-md flex items-center justify-center hover:bg-[#6F4E37] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTwitter size={40} />
              </motion.a>
              <motion.a
                href="#"
                className="h-12 bg-[#2D5016] rounded-md flex items-center justify-center hover:bg-[#6F4E37] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram size={40} />
              </motion.a>
              <motion.a
                href="#"
                className="h-12 bg-[#2D5016] rounded-md flex items-center justify-center hover:bg-[#6F4E37] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedin size={40} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Footer */}
      <motion.div
        className="border-t border-gray-800 py-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-100">
          <p>© 2025 AROBISCA COFFEE. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#6f4e37] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#6f4e37] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#6f4e37] transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
