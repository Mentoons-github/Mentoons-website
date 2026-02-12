import { CAREER_CORNER } from "@/constant/careerCorner";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

const CareerCorner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className=" mx-auto md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:flex gap-8 lg:gap-12 items-center"
        >
          <div className="xl:ml-36  max-w-2xl p-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Welcome to <span className="text-orange-500">Career Corner</span>
            </h1>
            <img
              src="/assets/workshopv2/careercorner/career-corner-logo.png"
              alt="Career Corner"
              className="w-72 md:w-[350px] mt-2 lg:w-[450px] block md:hidden mx-auto md:ml-auto drop-shadow-xl "
            />
            <p className="mt-5 text-gray-600 lg:text-lg">
              {CAREER_CORNER.description}
            </p>
          </div>

          <img
            src="/assets/workshopv2/careercorner/career-corner-logo.png"
            alt="Career Corner"
            className="w-72 md:w-[350px] lg:w-[450px] hidden md:block mx-auto md:ml-auto drop-shadow-xl "
          />
        </motion.div>
      </div>

      {/* Titles Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CAREER_CORNER.content.map((con, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              onClick={() => {
                setActiveIndex(index);
                setTimeout(() => {
                  descriptionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }}
              className={`rounded-xl p-5 cursor-pointer border transition-all
                ${
                  activeIndex === index
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-800 border-orange-100 hover:shadow-md"
                }`}
            >
              <h2 className="text-lg font-semibold text-center">{con.title}</h2>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Active Description (Full Width) */}
      <div ref={descriptionRef} className="max-w-7xl mx-auto px-6 mt-12 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl p-8 shadow-xl border-[2px] border-gradiant border-[#97c086] relative"
          >
            <div className="absolute -right-6 -top-6 sm:-top-10 w-20 h-20 sm:w-28 sm:h-28">
              <img
                src="/assets/workshopv2/badge.png"
                alt="badge"
                className="w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <span className="text-xs sm:text-lg font-bold text-black leading-tight">
                  ₹{CAREER_CORNER.content[activeIndex].price}/-
                  <br />
                  Only
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              {CAREER_CORNER.content[activeIndex].title}
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {CAREER_CORNER.content[activeIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerCorner;
