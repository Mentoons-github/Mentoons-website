import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentLoaderProps {
  isActive: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
  onRetry?: () => void;
  loadingDuration?: number;
  error?: string | null;
}

const PaymentLoader = ({
  isActive = false,
  onComplete,
  onCancel,
  onRetry,
  loadingDuration = 3000,
  error = null,
}: PaymentLoaderProps) => {
  const [stage, setStage] = useState("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isActive && stage === "idle") {
      setStage("loading");
      setProgress(0);
    } else if (!isActive) {
      setStage("idle");
      setProgress(0);
    }
  }, [isActive, stage]);

  useEffect(() => {
    if (error && stage !== "error") {
      setStage("error");
    }
  }, [error, stage]);

  useEffect(() => {
    if (stage !== "loading") return;

    const startTime = Date.now();

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const newProgress = Math.min(100, (elapsed / loadingDuration) * 100);

      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        if (onComplete) setTimeout(onComplete, 200);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [stage, loadingDuration, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {(stage === "loading" || stage === "error") && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full relative overflow-hidden"
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {stage === "error" && (
              <div className="text-center">
                <motion.div
                  className="mb-4 bg-red-100 py-2 px-4 rounded-lg mx-auto inline-block"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-red-600 font-medium">
                    CONNECTION FAILED
                  </span>
                </motion.div>

                <motion.p
                  className="text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {error || "Could not connect to payment gateway."}
                </motion.p>

                <div className="flex justify-center gap-2 mt-4">
                  {onRetry && (
                    <motion.button
                      onClick={onRetry}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Retry
                    </motion.button>
                  )}

                  {onCancel && (
                    <motion.button
                      onClick={onCancel}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>
            )}
            {stage === "loading" && (
              <motion.div
                className="absolute top-0 left-0 h-1 bg-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            )}

            {stage === "error" && (
              <div className="text-center">
                <motion.div
                  className="mb-4 bg-red-100 py-2 px-4 rounded-lg mx-auto inline-block"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-red-600 font-medium">
                    CONNECTION FAILED
                  </span>
                </motion.div>

                <motion.p
                  className="text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {error || "Could not connect to payment gateway."}
                </motion.p>

                {onCancel && (
                  <motion.button
                    onClick={onCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Dismiss
                  </motion.button>
                )}
              </div>
            )}

            {stage === "loading" && (
              <div className="text-center">
                <motion.div
                  className="mb-6 bg-blue-100 py-2 px-4 rounded-lg mx-auto inline-block"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-blue-600 font-medium">
                    PAYMENT GATEWAY
                  </span>
                </motion.div>

                <motion.div
                  className="flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Loading</span>
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="text-blue-600 text-lg font-bold"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            y: [0, -2, 0],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                          }}
                        >
                          .
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="mt-6 w-12 h-6 mx-auto relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-px bg-blue-600"
                    animate={{
                      scaleX: [0, 1, 0],
                      left: ["0%", "0%", "100%"],
                      right: ["100%", "0%", "0%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>

                {onCancel && (
                  <motion.button
                    onClick={onCancel}
                    className="mt-8 text-xs text-gray-500 hover:text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Cancel
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentLoader;
