import { motion, useScroll, useTransform } from "framer-motion";
import { WorkshopFormValues } from "@/types";
import { X } from "lucide-react";
import { useRef } from "react";

interface OverviewSectionProps {
  workshop: WorkshopFormValues;
  currentTheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    light: string;
    border: string;
  };
  setActiveSection: (
    section: "" | "overview" | "ageGroups" | "whyChoose",
  ) => void;
  setCurrentAgeGroup: (index: string) => void;
  overviewRef: React.RefObject<HTMLDivElement>;
}

const OverviewSection = ({
  workshop,
  currentTheme,
  setActiveSection,
  setCurrentAgeGroup,
}: OverviewSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sectionY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <motion.div
      ref={sectionRef}
      key="overview"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 0.8,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      style={{ y: sectionY }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-5 md:p-10 md:mt-10 rounded-xl bg-gradient-to-br from-[#C8A2C8] to-[#C2B97F] relative"
    >
      {/* Close button with bounce animation */}
      <motion.button
        type="button"
        onClick={() => setActiveSection("")}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: false }}
        whileHover={{
          scale: 1.1,
          rotate: 90,
          backgroundColor: "rgba(0,0,0,0.08)",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
          delay: 0.2,
        }}
        className="absolute top-2 right-3 z-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/70 shadow-lg border border-gray-200"
        aria-label="Close overview"
      >
        <X className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
      </motion.button>

      {/* Workshop Overview Card */}
      <motion.div
        className={`bg-gradient-to-br ${currentTheme.secondary} rounded-2xl p-4 md:p-8 ${currentTheme.border} border`}
        initial={{ opacity: 0, x: -100, rotateY: -15 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          transition: { duration: 0.3 },
        }}
      >
        <motion.h3
          className={`text-3xl font-bold ${currentTheme.text} mb-6`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Workshop Overview
        </motion.h3>
        <div className="space-y-4">
          {workshop.overview ? (
            workshop.overview.split("\n").map((line, index) => (
              <motion.p
                key={index}
                className="text-lg text-gray-700 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
              >
                {line}
              </motion.p>
            ))
          ) : (
            <motion.p
              className="text-lg text-gray-700 leading-relaxed"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Our {workshop.workshopName} program is designed to provide
              children with engaging, hands-on learning experiences that foster
              creativity, critical thinking, and personal growth in a supportive
              environment.
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Age Groups Card */}
      <motion.div
        className="bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-gray-100"
        initial={{ opacity: 0, x: 100, rotateY: 15 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          transition: { duration: 0.3 },
        }}
      >
        <motion.h4
          className={`text-xl font-semibold ${currentTheme.text} mb-4`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Available Age Groups
        </motion.h4>
        <div className="space-y-3">
          {workshop.ageGroups.map((group, index) => {
            const ageRange = group.ageRange;
            const minAge = parseInt(ageRange.split("-")[0]);
            const maxAge = parseInt(
              ageRange.split("-")[1] || ageRange.split("-")[0],
            );
            return (
              <motion.button
                key={index}
                onClick={() => {
                  setActiveSection("ageGroups");
                  setCurrentAgeGroup(`${minAge}-${maxAge}`);
                }}
                className={`w-full text-left ${
                  currentTheme.light
                } rounded-xl p-4 border-l-4 ${currentTheme.border.replace(
                  "border-",
                  "border-l-",
                )} flex items-center space-x-3 hover:shadow-md transition-shadow cursor-pointer`}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: false }}
                transition={{
                  delay: 0.6 + index * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                }}
                whileHover={{
                  x: 10,
                  scale: 1.03,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className={`w-10 h-10 ${currentTheme.accent} rounded-full flex items-center justify-center`}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    delay: 0.7 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{
                    rotate: 360,
                    transition: { duration: 0.5 },
                  }}
                >
                  <span className="text-white font-bold text-sm">
                    {minAge}-{maxAge}
                  </span>
                </motion.div>
                <motion.span
                  className="font-semibold text-gray-800"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  Ages {minAge}–{maxAge} years
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverviewSection;
