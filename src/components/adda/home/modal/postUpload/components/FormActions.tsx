import { motion } from "framer-motion";
import { FormActionsProps } from "../types";

const FormActions = ({
  activeTab,
  postType,
  isValid,
  mediaPreview,
  handlePrevTab,
  handleNextTab,
}: FormActionsProps) => {
  return (
    <motion.div
      className="flex gap-4 mt-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {activeTab > 1 && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevTab}
          className="flex items-center gap-2 px-5 py-2 text-white transition duration-200 bg-gray-500 rounded-md dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700"
        >
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [-5, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.6,
            }}
          >
            ←
          </motion.div>
          Previous
        </motion.button>
      )}

      {activeTab < 3 && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            handleNextTab();
          }}
          className={`flex items-center gap-2 px-5 py-2 text-white transition duration-200 rounded-md ${
            !isValid && postType !== "article"
              ? "bg-blue-300 dark:bg-blue-400 cursor-not-allowed"
              : "bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700"
          }`}
          disabled={
            postType === "article"
              ? false
              : !isValid ||
                (activeTab === 2 &&
                  (postType === "photo" || postType === "video") &&
                  !mediaPreview?.length)
          }
        >
          Next
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 5] }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 0.6,
            }}
          >
            →
          </motion.div>
        </motion.button>
      )}

      {activeTab === 3 && (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 text-white transition duration-200 bg-green-500 rounded-md dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Submit Post
        </motion.button>
      )}
    </motion.div>
  );
};

export default FormActions;
