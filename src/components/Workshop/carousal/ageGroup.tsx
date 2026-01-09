import { motion, AnimatePresence } from "framer-motion";
import { WorkshopFormValues } from "@/types";
import { useState } from "react";
import { X } from "lucide-react";

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
    section: "" | "overview" | "ageGroups" | "whyChoose"
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
      className="rounded-xl bg-gradient-to-br from-[#C8A2C8] to-[#C2B97F] relative p-5 md:p-10"
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
      <div className="flex justify-start gap-4 mb-8">
        {workshop.ageGroups.map((group, index) => (
          <button
            key={index}
            onClick={() => setCurrentAgeGroup(group.ageRange)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              currentAgeGroup === group.ageRange
                ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-2xl scale-105`
                : "bg-white text-gray-600 shadow-lg hover:shadow-xl hover:scale-102"
            }`}
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
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={
                  workshop.ageGroups[ageIndex].image ||
                  "/api/placeholder/400/300"
                }
                alt={`Age ${workshop.ageGroups[ageIndex].ageRange}`}
                className="w-full h-80 object-contain"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${currentTheme.primary} opacity-20`}
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-2xl font-black">
                  Age {workshop.ageGroups[ageIndex].ageRange}
                </h4>
              </div>
            </div>
          </motion.div>
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">
                Our Focus
              </h4>
              <p className="text-lg text-gray-600 leading-relaxed">
                {workshop.ageGroups[ageIndex].serviceOverview}
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-800 mb-4">
                Benefits
              </h4>
              {workshop.ageGroups[ageIndex].benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${currentTheme.secondary} rounded-xl p-6 ${currentTheme.border} border hover:shadow-lg transition-shadow`}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${currentTheme.accent} rounded-full flex items-center justify-center`}
                      >
                        <span className="text-white font-bold">
                          {openFaq === index ? "−" : "+"}
                        </span>
                      </div>
                      <h5 className={`font-bold text-lg ${currentTheme.text}`}>
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
                        className="mt-3 text-gray-600"
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
