import { motion } from "framer-motion";
import { ActiveTabType } from "@/types";

interface GroupTabsProps {
  setActiveTab: (val: ActiveTabType) => void;
  activeTab: ActiveTabType;
}

const GroupTabs: React.FC<GroupTabsProps> = ({ setActiveTab, activeTab }) => {
  const tabs: ActiveTabType[] = ["MEMBERS", "CHAT", "POLLS"];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center gap-6 mt-20 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tabs.map((text, index) => (
        <motion.button
          key={index}
          variants={tabVariants}
          onClick={() => setActiveTab(text)}
          whileHover={{
            scale: 1.05,
            y: -2,
            transition: { type: "spring", stiffness: 400, damping: 10 },
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 },
          }}
          className={`
            relative w-52 h-16 rounded-xl font-extrabold text-xl tracking-wide
            transition-all duration-300 overflow-hidden group
            ${
              activeTab === text
                ? "bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 text-white shadow-2xl shadow-orange-300/50"
                : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-orange-100 hover:to-yellow-100 hover:text-orange-600 shadow-lg hover:shadow-xl"
            }
          `}
        >
          <div
            className={`
            absolute inset-0 rounded-xl p-[2px] 
            ${
              activeTab === text
                ? "bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300"
                : "bg-gradient-to-r from-transparent via-orange-200 to-transparent opacity-0 group-hover:opacity-100"
            }
            transition-opacity duration-300
          `}
          >
            <div className="w-full h-full rounded-xl bg-inherit" />
          </div>
          <div
            className={`
            absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%]
            transition-all duration-700 ease-out
            ${activeTab === text ? "opacity-30" : ""}
          `}
          />
          <span className="relative z-10 flex items-center justify-center h-full px-6">
            {text}
          </span>
          {activeTab === text && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default GroupTabs;
