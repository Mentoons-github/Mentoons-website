import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Update the props to include error handling
interface PaymentProcessFlowProps {
  onComplete?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
  isActive: boolean;
  initialLoadTime: number;
  error?: string | null;
}

const PaymentProcessFlow = ({
  onComplete,
  onRetry,
  onCancel,
  isActive = false,
  initialLoadTime = 1200,
  error = null,
}: PaymentProcessFlowProps) => {
  const [stage, setStage] = useState("idle");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);

  const loadingSteps = [
    "Connecting to payment gateway...",
    "Establishing secure connection...",
    "Preparing payment details...",
    "Finalizing payment gateway setup...",
  ];

  useEffect(() => {
    if (error && stage !== "error") {
      setStage("error");
    }
  }, [error]);

  useEffect(() => {
    if (isActive && stage === "idle") {
      setStage("initialLoad");

      const timer = setTimeout(() => {
        if (!error) {
          setStage("fullModal");
        }
      }, initialLoadTime);

      return () => clearTimeout(timer);
    } else if (!isActive) {
      setStage("idle");
      setLoadingProgress(0);
      setProcessingStep(0);
    }
  }, [isActive, initialLoadTime, stage, error]);


  useEffect(() => {
    if (stage !== "fullModal") return;

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newValue = prev + 0.5;

        if (newValue > 75) setProcessingStep(3);
        else if (newValue > 50) setProcessingStep(2);
        else if (newValue > 25) setProcessingStep(1);

        if (newValue >= 100) {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 500);
          return 100;
        }
        return newValue;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [stage, onComplete]);


  const InitialLoader = () => (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-full p-3 shadow-lg"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="relative w-12 h-12">
          <motion.div
            className="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  const ErrorModal = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full relative overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="text-center">
          <motion.div
            className="mb-5 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Payment Gateway Issue
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error || "There was an issue connecting to the payment gateway."}
          </motion.p>

          <div className="flex justify-center space-x-3">
            {onRetry && (
              <motion.button
                onClick={onRetry}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium"
              >
                Try Again
              </motion.button>
            )}
            {onCancel && (
              <motion.button
                onClick={onCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const FullModal = () => (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full relative overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.div
          className="absolute top-0 left-0 h-1 bg-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: `${loadingProgress}%` }}
          transition={{ ease: "easeInOut" }}
        />

        <div className="text-center">
          <motion.div
            className="mb-5 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotateZ: [0, -2, 2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-xl font-semibold text-gray-800 mb-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Payment is Processing
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {loadingSteps[processingStep]}
          </motion.p>

          <div className="flex justify-center mb-2">
            <motion.div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          <motion.p
            className="text-xs text-gray-500 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Please don't close or refresh this page
          </motion.p>

          {onCancel && (
            <motion.button
              onClick={onCancel}
              className="mt-4 text-xs text-gray-500 hover:text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Cancel payment
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {stage === "initialLoad" && <InitialLoader />}
      {stage === "fullModal" && <FullModal />}
      {stage === "error" && <ErrorModal />}
    </AnimatePresence>
  );
};

export default PaymentProcessFlow;
