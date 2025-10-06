import { motion } from "framer-motion";
import { WorkshopFormValues } from "@/types";

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
  setActiveSection: (section: "overview" | "ageGroups" | "whyChoose") => void;
  setCurrentAgeGroup: (index: number) => void;
}

const OverviewSection = ({
  workshop,
  currentTheme,
  setActiveSection,
  setCurrentAgeGroup,
}: OverviewSectionProps) => (
  <motion.div
    key="overview"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
  >
    <div
      className={`bg-gradient-to-br ${currentTheme.secondary} rounded-2xl p-8 ${currentTheme.border} border`}
    >
      <h3 className={`text-3xl font-bold ${currentTheme.text} mb-6`}>
        Workshop Overview
      </h3>
      <div className="space-y-4">
        <p className="text-lg text-gray-700 leading-relaxed">
          Our {workshop.workshopName} program is designed to provide children
          with engaging, hands-on learning experiences that foster creativity,
          critical thinking, and personal growth in a supportive environment.
        </p>
        <div className="mt-6">
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
                    setCurrentAgeGroup(index);
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
      </div>
    </div>
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-3xl font-bold text-gray-800 mb-6">
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
    </div>
  </motion.div>
);

export default OverviewSection;
