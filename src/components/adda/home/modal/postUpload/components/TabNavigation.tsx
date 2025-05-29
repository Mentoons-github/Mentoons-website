import { motion } from "framer-motion";
import { TabNavigationProps } from "../types";

const TabNavigation = ({
  postType,
  activeTab,
  setActiveTab,
}: TabNavigationProps) => {
  let tabLabels = ["Write", "Upload", "Preview"];

  // Modify tab labels for photo and video post types (2-tab flow)
  if (postType === "photo" || postType === "video") {
    tabLabels = ["Upload & Write", "Preview"];
  }

  if (postType === "event") {
    return null;
  }

  if (postType === "text") {
    return null;
  }

  return (
    <div className="flex justify-between w-full pb-4 mb-4 border-b dark:border-gray-700">
      {postType === "photo" || postType === "video" ? (
        // Special 2-tab layout for photo/video with proper spacing
        <>
          <motion.div
            className="relative flex items-center gap-3 transition cursor-pointer"
            onClick={() => setActiveTab(1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full"
              animate={{
                backgroundColor: activeTab === 1 ? "#f97316" : "#9ca3af",
              }}
              transition={{ duration: 0.2 }}
            >
              1
            </motion.span>
            <span
              className={
                activeTab === 1
                  ? "text-orange-500 font-bold"
                  : "text-gray-600 dark:text-gray-400"
              }
            >
              Upload & Write
            </span>
            {activeTab === 1 && (
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

          <motion.div
            className="relative flex items-center gap-3 transition cursor-pointer"
            onClick={() => setActiveTab(2)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full"
              animate={{
                backgroundColor: activeTab === 2 ? "#f97316" : "#9ca3af",
              }}
              transition={{ duration: 0.2 }}
            >
              2
            </motion.span>
            <span
              className={
                activeTab === 2
                  ? "text-orange-500 font-bold"
                  : "text-gray-600 dark:text-gray-400"
              }
            >
              Preview
            </span>
            {activeTab === 2 && (
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
        </>
      ) : (
        // Standard 3-tab layout for other post types
        tabLabels.map((label, index) => {
          const tabNumber = index + 1;

          return (
            <motion.div
              key={index}
              className="relative flex items-center gap-3 transition cursor-pointer"
              onClick={() => setActiveTab(tabNumber)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full"
                animate={{
                  backgroundColor:
                    activeTab === tabNumber ? "#f97316" : "#9ca3af",
                }}
                transition={{ duration: 0.2 }}
              >
                {tabNumber}
              </motion.span>
              <span
                className={
                  activeTab === tabNumber
                    ? "text-orange-500 font-bold"
                    : "text-gray-600 dark:text-gray-400"
                }
              >
                {label}
              </span>
              {activeTab === tabNumber && (
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
          );
        })
      )}
    </div>
  );
};

export default TabNavigation;
