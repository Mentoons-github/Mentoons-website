import React from "react";
import { motion } from "framer-motion";
import { WorkshopFormValues } from "@/types";
import { X } from "lucide-react";

interface WhyChooseSectionProps {
  workshop: WorkshopFormValues;
  currentTheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    light: string;
    border: string;
  };
  whyChooseRef: React.RefObject<HTMLDivElement>;
  setActiveSection: (
    section: "" | "overview" | "ageGroups" | "whyChoose"
  ) => void;
}

const WhyChooseSection = ({
  workshop,
  currentTheme,
  whyChooseRef,
  setActiveSection,
}: WhyChooseSectionProps) => (
  <motion.div
    key="whyChoose"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-10 rounded-xl bg-gradient-to-br from-[#C8A2C8] to-[#C2B97F] relative p-5 md:p-10"
    ref={whyChooseRef}
  >
    <motion.button
      type="button"
      onClick={() => setActiveSection("")}
      initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={{
        scale: 1.1,
        rotate: 90,
        backgroundColor: "rgba(0,0,0,0.08)",
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="absolute top-2 right-3 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/70 shadow-lg border border-gray-200"
      aria-label="Close overview"
    >
      <X className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
    </motion.button>
    {workshop.whyChooseUs.map((reason, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.2 }}
        whileHover={{ y: -10, scale: 1.05 }}
        className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 text-center group"
      >
        <div
          className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
        >
          <span className="text-white text-2xl font-bold">{index + 1}</span>
        </div>
        <h4 className="text-2xl font-bold text-gray-800 mb-4">
          {reason.heading}
        </h4>
        <p className="text-gray-600 leading-relaxed">{reason.description}</p>
      </motion.div>
    ))}
  </motion.div>
);

export default WhyChooseSection;
