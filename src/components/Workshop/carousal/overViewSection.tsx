import { motion } from "framer-motion";
import { WorkshopFormValues } from "@/types";
import { X } from "lucide-react";

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
    section: "" | "overview" | "ageGroups" | "whyChoose"
  ) => void;
  setCurrentAgeGroup: (index: string) => void;
  overviewRef: React.RefObject<HTMLDivElement>;
}

const OverviewSection = ({
  workshop,
  currentTheme,
  setActiveSection,
  setCurrentAgeGroup,
  overviewRef,
}: OverviewSectionProps) => (
  <motion.div
    key="overview"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 p-5 md:p-10 md:mt-10 rounded-xl bg-gradient-to-br from-[#C8A2C8] to-[#C2B97F] relative"
    ref={overviewRef}
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
      className="absolute top-2 right-3 z-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-white/70 shadow-lg border border-gray-200"
      aria-label="Close overview"
    >
      <X className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
    </motion.button>

    <div
      className={`bg-gradient-to-br ${currentTheme.secondary} rounded-2xl p-4 md:p-8 ${currentTheme.border} border`}
    >
      <h3 className={`text-3xl font-bold ${currentTheme.text} mb-6`}>
        Workshop Overview
      </h3>
      <div className="space-y-4">
        {workshop.overview ? (
          workshop.overview.split("\n").map((line, index) => (
            <p key={index} className="text-lg text-gray-700 leading-relaxed">
              {line}
            </p>
          ))
        ) : (
          <p className="text-lg text-gray-700 leading-relaxed">
            Our {workshop.workshopName} program is designed to provide children
            with engaging, hands-on learning experiences that foster creativity,
            critical thinking, and personal growth in a supportive environment.
          </p>
        )}
      </div>
    </div>

    <div className=" bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-gray-100">
      <h4 className={`text-xl font-semibold ${currentTheme.text} mb-4`}>
        Available Age Groups
      </h4>
      <div className="space-y-3">
        {workshop.ageGroups.map((group, index) => {
          const ageRange = group.ageRange;
          const minAge = parseInt(ageRange.split("-")[0]);
          const maxAge = parseInt(
            ageRange.split("-")[1] || ageRange.split("-")[0]
          );
          return (
            <button
              key={index}
              onClick={() => {
                setActiveSection("ageGroups");
                setCurrentAgeGroup(`${minAge}-${maxAge}`);
              }}
              className={`w-full text-left ${
                currentTheme.light
              } rounded-xl p-4 border-l-4 ${currentTheme.border.replace(
                "border-",
                "border-l-"
              )} flex items-center space-x-3 hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div
                className={`w-10 h-10 ${currentTheme.accent} rounded-full flex items-center justify-center`}
              >
                <span className="text-white font-bold text-sm">
                  {minAge}-{maxAge}
                </span>
              </div>
              <span className="font-semibold text-gray-800">
                Ages {minAge}–{maxAge} years
              </span>
            </button>
          );
        })}
      </div>
    </div>

    {/* <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl border border-gray-100">
      <h3 className="text-3xl font-bold text-gray-800 mb-3 md:mb-6">
        Parent Testimonials
      </h3>
      <div className="space-y-6">
        <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
          <p className={`text-lg ${currentTheme.text} italic leading-relaxed`}>
            "{workshop.workshopName} has been a game-changer for my child’s
            confidence and problem-solving skills!"
          </p>
          <span className="mt-2 font-semibold text-gray-700 text-right">
            — Rahul Raj, Parent
          </span>
        </div>
        <div className="flex flex-col p-4 bg-gray-50 rounded-xl">
          <p className={`text-lg ${currentTheme.text} italic leading-relaxed`}>
            "The engaging activities in this workshop kept my child excited to
            learn every day!"
          </p>
          <span className="mt-2 font-semibold text-gray-700 text-right">
            — Ram Varma, Parent
          </span>
        </div>
      </div>
    </div> */}
  </motion.div>
);

export default OverviewSection;
