import { motion, useScroll, useTransform } from "framer-motion";
import { WorkshopFormValues } from "@/types";
import { X } from "lucide-react";
import { useRef, CSSProperties } from "react";

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

const hardHover = {
  boxShadow: `8px 8px 0 ${INK}`,
  transition: { duration: 0.3 },
};

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
      style={{ ...sectionStyle, y: sectionY }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-5 md:p-10 md:mt-10 rounded-2xl relative"
    >
      {/* Close button */}
      <motion.button
        type="button"
        onClick={() => setActiveSection("")}
        style={closeBtnStyle}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: false }}
        whileHover={{
          scale: 1.1,
          rotate: 90,
          backgroundColor: "#fde047",
        }}
        whileTap={{ scale: 0.9 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
          delay: 0.2,
        }}
        className="absolute top-2 right-3 z-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
        aria-label="Close overview"
      >
        <X className="w-5 h-5 md:w-6 md:h-6" style={{ color: INK }} />
      </motion.button>

      {/* Workshop Overview Card */}
      <motion.div
        className={`bg-gradient-to-br ${currentTheme.secondary} rounded-2xl p-4 md:p-8`}
        style={panelStyle}
        initial={{ opacity: 0, x: -100, rotateY: -15 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{
          duration: 0.8,
          delay: 0.2,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        whileHover={{ scale: 1.02, ...hardHover }}
      >
        <motion.h3
          className="font-comic text-4xl tracking-wide mb-6"
          style={{ color: INK, textShadow: "2px 2px 0 #fb923c" }}
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
                className="text-lg leading-relaxed"
                style={{ color: INK }}
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
              className="text-lg leading-relaxed"
              style={{ color: INK }}
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
        className="rounded-2xl p-4 md:p-8"
        style={panelStyle}
        initial={{ opacity: 0, x: 100, rotateY: 15 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0.25, 0.4, 0.25, 1],
        }}
        whileHover={{ scale: 1.02, ...hardHover }}
      >
        <motion.h4
          className="font-comic text-3xl tracking-wide mb-4"
          style={{ color: INK, textShadow: "2px 2px 0 #fb923c" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Available Age Groups
        </motion.h4>
        <div className="space-y-4">
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
                style={{
                  border: `3px solid ${INK}`,
                  boxShadow: `4px 4px 0 ${INK}`,
                }}
                className={`w-full text-left ${currentTheme.light} rounded-xl p-4 flex items-center space-x-3 cursor-pointer`}
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
                  x: 6,
                  scale: 1.02,
                  boxShadow: `7px 7px 0 ${INK}`,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.97 }}
              >
                <motion.div
                  className={`w-12 h-12 ${currentTheme.accent} rounded-full flex items-center justify-center flex-shrink-0`}
                  style={{ border: `3px solid ${INK}` }}
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
                  <span
                    className="font-comic-chip text-white text-sm"
                    style={{ textShadow: `1px 1px 0 ${INK}` }}
                  >
                    {minAge}-{maxAge}
                  </span>
                </motion.div>
                <motion.span
                  className="font-comic-chip tracking-wide text-lg"
                  style={{ color: INK }}
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
