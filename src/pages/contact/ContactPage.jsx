"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FiPhone, FiMapPin, FiClock, FiMail } from "react-icons/fi"
import toast from "react-hot-toast"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all required fields")
            return
        }

        setLoading(true)

        try {
            // Simulate API call - replace with actual endpoint
            await new Promise((resolve) => setTimeout(resolve, 1500))

            toast.success("Message sent successfully! We'll get back to you soon.")
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
            })
        } catch (error) {
            toast.error("Failed to send message. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
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
                            Get In <span className="text-amber-600">Touch</span>
                        </h1>
                        <p className="text-lg text-white max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 md:py-24 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Contact Information */}
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
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-100">
                                        <FiPhone className="w-6 h-6 text-amber-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone</h3>
                                    <p className="text-gray-600">+254 795 982 056</p>
                                    <p className="text-gray-600">+254 724 637 787</p>
                                    <p className="text-gray-600">+254 701 345 482</p>
                                </div>
                            </motion.div>

                            {/* Email */}
                            <motion.div variants={itemVariants} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100">
                                        <FiMail className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                                    <p className="text-gray-600">info@arobisca.com</p>
                                </div>
                            </motion.div>

                            {/* Address */}
                            <motion.div variants={itemVariants} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-100">
                                        <FiMapPin className="w-6 h-6 text-amber-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                                    <p className="text-gray-600">Nabui House, 1st Floor</p>
                                    <p className="text-gray-600">Westlands, Nairobi Kenya</p>
                                </div>
                            </motion.div>

                            {/* Working Hours */}
                            <motion.div variants={itemVariants} className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100">
                                        <FiClock className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Working Hours</h3>
                                    <p className="text-gray-600">Mon - Fri: 9:00 AM - 9:00 PM</p>
                                    <p className="text-gray-600">Saturday: 1:00 PM - 8:00 PM</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            onSubmit={handleSubmit}
                            className="lg:col-span-2 bg-gray-50 p-8 rounded-lg"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder:text-gray-300"
                                        placeholder="Your name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder:text-gray-300"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder:text-gray-300"
                                    placeholder="+254..."
                                />
                            </div>

                            {/* Subject */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 mb-2">Subject *</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder:text-gray-300"
                                    placeholder="How can we help?"
                                />
                            </div>

                            {/* Message */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none placeholder:text-gray-300"
                                    placeholder="Your message..."
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </section>
        </div>
    )
}
