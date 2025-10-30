import { BiSupport } from "react-icons/bi"
import { FaShippingFast } from "react-icons/fa"
import { IoMdPricetags } from "react-icons/io"
import { MdOutlineCoffeeMaker } from "react-icons/md"
import { motion } from "framer-motion"

export default function BenefitsSection({ categoryName }) {

  return (
      <section className="py-12 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                title: "FAST SHIPPING",
                description: "Enjoy Swift Deliveries.We deliver all over the coutry",
                icon: <FaShippingFast />,
              },
              {
                title: "24/7 Support",
                description: "Dedicated customer service. Reach Us any Time.",
                icon: <BiSupport />,
              },
              {
                title: "Fair Pricing",
                description: "Enjoy unbeatable prices without quality compromise.",
                icon:<IoMdPricetags />,
              },
              {
                title: "Quality Products",
                description: "High quality coffee, accesories and coffee machines.",
                icon: <MdOutlineCoffeeMaker />,
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-6 bg-white rounded-lg shadow-md flex flex-col items-center"
              >
                <div className="text-4xl mb-4 text-amber-600">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  )
}
