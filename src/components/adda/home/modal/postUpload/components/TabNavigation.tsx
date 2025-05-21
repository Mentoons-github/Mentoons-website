import { motion } from "framer-motion";
import { TabNavigationProps } from "../types";

const TabNavigation = ({
  postType,
  activeTab,
  setActiveTab,
}: TabNavigationProps) => {
  const tabLabels = ["Write", "Upload", "Preview"];

  if (postType === "event") {
    return null;
  }

  return (
    <div className="flex justify-between w-full pb-4 mb-4 border-b dark:border-gray-700">
      {tabLabels.map((label, index) => (
        <motion.div
          key={index + 1}
          className="flex items-center gap-3 cursor-pointer transition relative"
          onClick={() => setActiveTab(index + 1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="w-8 h-8 flex justify-center items-center rounded-full text-white text-sm font-semibold"
            animate={{
              backgroundColor: activeTab === index + 1 ? "#f97316" : "#9ca3af",
            }}
            transition={{ duration: 0.2 }}
          >
            {index + 1}
          </motion.span>
          <span
            className={
              activeTab === index + 1
                ? "text-orange-500 font-bold"
                : "text-gray-600 dark:text-gray-400"
            }
          >
            {label}
          </span>
          {activeTab === index + 1 && (
            <motion.div
              className="absolute -bottom-4 left-0 right-0 h-0.5 bg-orange-500"
              layoutId="activeTab"
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TabNavigation;
