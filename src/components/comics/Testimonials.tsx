import { motion } from "framer-motion";
import React from "react";
import TestimonialsSlider from "./Sliders";
import Wordbreak from "./Wordbreak";

const Testimonials: React.FC = () => {
  return (
    <div className="container flex flex-col lg:flex-row items-center justify-between bg-[#59B2DC] py-20 space-y-5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="w-full lg:w-[45%] space-y-4"
      >
        <div className="text-red-500 lineBefore text-3xl">User Reviews</div>
        <div className="font-extrabold text-white text-4xl lg:text-6xl">
          What Readers Say About Mentoons Comics
        </div>
        <div className="text-white text-lg tracking-wide">
          Lorem ipsum dolor sit amet, consectetur <Wordbreak /> adipisicing
          elit. Recusandae blanditi.
        </div>
        <button className="bg-primary uppercase text-lg font-medium hover:bg-white hover:text-primary transition-all duration-300 ease-in-out text-white py-3 px-7 rounded-full">
          All Reviews
        </button>
      </motion.div>
      <TestimonialsSlider />
    </div>
  );
};

export default Testimonials;
