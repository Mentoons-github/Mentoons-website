import { motion, AnimatePresence } from "framer-motion";
import { WorkshopFormValues } from "@/types";
import { useState, CSSProperties } from "react";
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

const headingStyle: CSSProperties = {
  color: INK,
  textShadow: "2px 2px 0 #fb923c",
};

interface AgeGroupSectionProps {
  workshop: WorkshopFormValues;
  currentTheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    light: string;
    border: string;
  };
  currentAgeGroup: string;
  setCurrentAgeGroup: (index: string) => void;
  ageCategoryRef: React.RefObject<HTMLDivElement>;
  setActiveSection: (
    section: "" | "overview" | "ageGroups" | "whyChoose",
  ) => void;
}

const AgeGroupSection = ({
  workshop,
  currentTheme,
  currentAgeGroup,
  setCurrentAgeGroup,
  ageCategoryRef,
  setActiveSection,
}: AgeGroupSectionProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const ageIndex = currentAgeGroup === "6-12" ? 0 : 1;
  return (
    <motion.div
      ref={ageCategoryRef}
      key="ageGroups"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={sectionStyle}
      className="rounded-2xl relative p-5 md:p-10"
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
      <div className="flex justify-start flex-wrap gap-4 mb-8 pr-14">
        {workshop.ageGroups.map((group, index) => (
          <button
            key={index}
            onClick={() => setCurrentAgeGroup(group.ageRange)}
            style={{
              border: `3px solid ${INK}`,
              boxShadow: `4px 4px 0 ${INK}`,
              background:
                currentAgeGroup === group.ageRange ? "#fde047" : "#fff",
              color: INK,
            }}
            className="font-comic-chip tracking-wide px-6 sm:px-8 py-3 rounded-2xl text-lg transition-all duration-300 hover:-translate-y-0.5"
          >
            Age {group.ageRange}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAgeGroup}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div
            className="lg:col-span-1"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div
              className="relative overflow-hidden rounded-2xl"
              style={{ ...panelStyle, boxShadow: `8px 8px 0 ${INK}` }}
            >
              <img
                src={
                  workshop.ageGroups[ageIndex].image ||
                  "/api/placeholder/400/300"
                }
                alt={`Age ${workshop.ageGroups[ageIndex].ageRange}`}
                className="w-full h-80 object-contain"
              />
              <div
                className="absolute bottom-3 left-3 px-3 py-1 rounded-lg"
                style={{
                  background: "#fb923c",
                  border: `3px solid ${INK}`,
                  boxShadow: `3px 3px 0 ${INK}`,
                }}
              >
                <h4
                  className="font-comic-chip text-xl tracking-wide"
                  style={{ color: INK }}
                >
                  Age {workshop.ageGroups[ageIndex].ageRange}
                </h4>
              </div>
            </div>
          </motion.div>
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl p-6" style={panelStyle}>
              <h4
                className="font-comic text-3xl tracking-wide mb-4"
                style={headingStyle}
              >
                Our Focus
              </h4>
              <p className="text-lg leading-relaxed" style={{ color: INK }}>
                {workshop.ageGroups[ageIndex].serviceOverview}
              </p>
            </div>
            <div className="space-y-4">
              <h4
                className="font-comic text-3xl tracking-wide mb-4"
                style={headingStyle}
              >
                Benefits
              </h4>
              {workshop.ageGroups[ageIndex].benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={panelStyle}
                  className={`bg-gradient-to-br ${currentTheme.secondary} rounded-xl p-5 md:p-6`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${currentTheme.accent} rounded-full flex items-center justify-center flex-shrink-0`}
                        style={{ border: `3px solid ${INK}` }}
                      >
                        <span
                          className="text-white font-bold"
                          style={{ textShadow: `1px 1px 0 ${INK}` }}
                        >
                          {openFaq === index ? "−" : "+"}
                        </span>
                      </div>
                      <h5
                        className="font-comic-chip tracking-wide text-lg"
                        style={{ color: INK }}
                      >
                        {benefit.title}
                      </h5>
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 overflow-hidden"
                        style={{ color: INK }}
                      >
                        <p>{benefit.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AgeGroupSection;
