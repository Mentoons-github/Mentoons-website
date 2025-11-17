import { motion } from "framer-motion";
import { WorkshopFormValues } from "@/types";

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
}

const WhyChooseSection = ({
  workshop,
  currentTheme,
}: WhyChooseSectionProps) => (
  <motion.div
    key="whyChoose"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  >
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
