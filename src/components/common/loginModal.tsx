import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingModal = ({
  isOpen,
  onClose,
  steps = [],
  currentStep = 0,
  title = "Processing",
}: {
  isOpen: boolean;
  onClose: () => void;
  steps: string[];
  currentStep: number;
  title?: string;
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && steps.length > 0) {
      const newProgress = ((currentStep + 1) / steps.length) * 100;
      setProgress(newProgress);
    } else {
      setProgress(0);
    }
  }, [isOpen, currentStep, steps.length]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </motion.h3>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="relative w-full h-2 mb-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 200,
                }}
                className="absolute top-0 left-0 h-full bg-blue-600 dark:bg-blue-500 rounded-full"
              />
              <motion.div
                animate={{
                  x: ["0%", "100%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-transparent via-white dark:via-blue-400 to-transparent opacity-30"
              />
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                  }}
                  className="flex items-center"
                >
                  <div className="flex-shrink-0 mr-4">
                    {index < currentStep ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: 10,
                          stiffness: 200,
                        }}
                        className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center"
                      >
                        <motion.svg
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="h-6 w-6 text-green-500 dark:text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </motion.svg>
                      </motion.div>
                    ) : index === currentStep ? (
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            "0 0 0 rgba(59, 130, 246, 0)",
                            "0 0 15px rgba(59, 130, 246, 0.3)",
                            "0 0 0 rgba(59, 130, 246, 0)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                      >
                        <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          {index + 1}
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    animate={
                      index === currentStep
                        ? {
                            x: [0, 5, 0],
                            transition: {
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: "reverse",
                            },
                          }
                        : {}
                    }
                    className={`flex-grow text-sm md:text-base ${
                      index === currentStep
                        ? "font-medium text-blue-600 dark:text-blue-400"
                        : index < currentStep
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex justify-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingModal;
