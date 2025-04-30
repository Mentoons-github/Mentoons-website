import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { SUNSHINE } from "../../../constant/mythos/sunshine";

const GroupsSunshineCardSection = () => {
  return (
    <div className="bg-[#1A1D3B] px-4 py-16 md:px-6">
      <div className="">
        <motion.h2
          className="text-5xl font-semibold text-start text-[#e39712] mb-16 px-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Reach out to individuals who share your BIRTH sign.
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-[85%] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
          viewport={{ once: true, amount: 0.1 }}
          whileInView={{ opacity: 1 }}
        >
          {SUNSHINE.map((item, index) => (
            <Link
              to={`/mythos/groups/${item.name.toLowerCase()}`}
              key={item.id}
            >
              <motion.div
                className={`group relative rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl h-[450px] w-full`}
                style={{ backgroundColor: item.color }}
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true, amount: 0.1 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Diagonal Light Beam Effect */}
                <motion.div
                  className="absolute top-0 right-0 w-1/2 h-full transform -skew-x-12 bg-gradient-to-bl from-yellow-200/30 to-transparent"
                  initial={{ opacity: 0 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                />
                {/* Main Illustration */}
                <motion.div
                  className="flex items-center justify-center mt-8"
                  initial={{ scale: 0.8, opacity: 0 }}
                  viewport={{ once: true }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 + index * 0.1 }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-contain w-64 h-64 transition-transform duration-300 transform group-hover:scale-110"
                  />
                </motion.div>

                {/* Content Container */}
                <motion.div
                  className="flex items-start justify-start gap-4 p-8"
                  initial={{ y: 20, opacity: 0 }}
                  viewport={{ once: true }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                >
                  {/* Zodiac Symbol */}
                  <motion.div
                    className="mb-4"
                    initial={{ rotate: -10, opacity: 0 }}
                    viewport={{ once: true }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  >
                    <img
                      src={item.zodiacSign}
                      alt={`${item.name} symbol`}
                      className="object-contain w-12 h-12 opacity-90"
                    />
                  </motion.div>

                  <div className="flex flex-col gap-1">
                    {/* Title */}
                    <motion.h3
                      className="text-3xl font-bold text-white"
                      initial={{ x: -20, opacity: 0 }}
                      viewport={{ once: true }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      {item.name}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      className="text-lg text-white/90 line-clamp-2"
                      initial={{ opacity: 0 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      {item.description}
                    </motion.p>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full opacity-75"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GroupsSunshineCardSection;
