import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WorkshopPlan } from "@/types/workshopsV2/workshopsV2";

const AboutWorkshopV2 = ({ workshops }: { workshops: WorkshopPlan[] }) => {
  const [activeImage, setActiveImage] = useState(0);

  const handlePrevious = () => {
    setActiveImage((prev) => (prev === 0 ? workshops.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImage((prev) => (prev === workshops.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-orange-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        className="absolute top-10 left-5 w-20 h-20 bg-orange-200/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-5 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
              Our Workshops
            </span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4 text-center">
            About Our Workshops
          </h1>

          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-4 pb-4">
              At Mentoons, we conduct informative and interactive workshops that
              provide an effective and transformative experience for our
              participants.
            </p>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl mt-2 pb-6">
              Our expert-led workshops empower children, teens, and young adults
              to build healthier relationships with technology—without
              compromising fun, connection, or creativity.
            </p>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Workshop Details */}
          <motion.div
            className="space-y-6"
            key={activeImage}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Workshop Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                {workshops[activeImage]?.name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                  Age: {workshops[activeImage]?.age}
                </span>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                  Duration: {workshops[activeImage]?.duration}
                </span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  {workshops[activeImage]?.totalSession} Sessions
                </span>
              </div>
            </motion.div>

            {/* Features Description */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                What You'll Experience:
              </h3>

              <div className="space-y-3">
                <p className="text-gray-700 text-base leading-relaxed">
                  {workshops[activeImage]?.features.join(", ")}.
                </p>
              </div>
            </motion.div>

            {/* Mode badges */}
            <motion.div
              className="flex gap-3 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {workshops[activeImage]?.mode.map((m, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm"
                >
                  {m} Available
                </span>
              ))}
            </motion.div>

            {/* Navigation Arrows */}
            <motion.div
              className="flex gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                onClick={handlePrevious}
                className="flex items-center gap-2 bg-white border border-black text-black px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </motion.button>
              <motion.button
                onClick={handleNext}
                className="flex items-center gap-2 bg-black border border-white border-2 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Image Gallery */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Main Image Display */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white p-8">
              <motion.img
                key={activeImage}
                src={workshops[activeImage]?.image}
                alt={workshops[activeImage]?.name}
                className="w-full h-full object-contain"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              />

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-orange-400 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-orange-400 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-orange-400 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-orange-400 rounded-br-lg" />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {workshops.map((workshop, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden bg-white p-2 ${
                    activeImage === index
                      ? "ring-4 ring-orange-500 shadow-lg"
                      : "ring-2 ring-gray-200 hover:ring-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img
                    src={workshop.image}
                    alt={workshop.name}
                    className="w-full h-full object-contain"
                  />
                  {activeImage === index && (
                    <motion.div
                      className="absolute inset-0 bg-orange-500/10"
                      layoutId="activeImageBorder"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutWorkshopV2;
