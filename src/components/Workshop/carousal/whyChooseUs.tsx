import React, { CSSProperties } from "react";
import { motion } from "framer-motion";
import { WorkshopFormValues } from "@/types";
import { X } from "lucide-react";

const INK = "#1f1308";

// ---- inline comic styles ----
const sectionStyle: CSSProperties = {
  background: "#fdba74",
  border: `3px solid ${INK}`,
  boxShadow: `6px 6px 0 ${INK}`,
};

const panelStyle: CSSProperties = {
  background: "#fff",
  border: `3px solid ${INK}`,
  boxShadow: `5px 5px 0 ${INK}`,
};

const closeBtnStyle: CSSProperties = {
  background: "#fff",
  border: `3px solid ${INK}`,
  boxShadow: `3px 3px 0 ${INK}`,
};

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
    section: "" | "overview" | "ageGroups" | "whyChoose",
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
    style={sectionStyle}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-10 rounded-2xl relative p-5 md:p-10"
    ref={whyChooseRef}
  >
    <motion.button
      type="button"
      onClick={() => setActiveSection("")}
      style={closeBtnStyle}
      initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={{
        scale: 1.1,
        rotate: 90,
        backgroundColor: "#fde047",
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="absolute top-2 right-3 z-30 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
      aria-label="Close overview"
    >
      <X className="w-5 h-5 md:w-6 md:h-6" style={{ color: INK }} />
    </motion.button>
    {workshop.whyChooseUs.map((reason, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.2 }}
        whileHover={{ y: -8, scale: 1.03, boxShadow: `8px 8px 0 ${INK}` }}
        style={panelStyle}
        className="rounded-2xl p-8 text-center group"
      >
        <div
          className={`w-16 h-16 bg-gradient-to-r ${currentTheme.primary} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
          style={{ border: `3px solid ${INK}`, boxShadow: `3px 3px 0 ${INK}` }}
        >
          <span
            className="font-comic text-white text-3xl"
            style={{ textShadow: `2px 2px 0 ${INK}` }}
          >
            {index + 1}
          </span>
        </div>
        <h4
          className="font-comic text-3xl tracking-wide mb-4"
          style={{ color: INK, textShadow: "2px 2px 0 #fb923c" }}
        >
          {reason.heading}
        </h4>
        <p className="leading-relaxed" style={{ color: INK }}>
          {reason.description}
        </p>
      </motion.div>
    ))}
  </motion.div>
);

export default WhyChooseSection;
