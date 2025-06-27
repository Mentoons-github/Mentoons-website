import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCrown, FaStar, FaArrowRight, FaGem } from "react-icons/fa";

interface PlatinumMembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: () => void;
}

const PlatinumMembershipModal = ({
  isOpen,
  onClose,
  onNavigate,
}: PlatinumMembershipModalProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -30,
      transition: {
        duration: 0.2,
      },
    },
  };

  const crownVariants = {
    animate: {
      rotate: [0, -10, 10, -5, 5, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3,
      },
    },
  };

  const shimmerVariants = {
    animate: {
      x: [-100, 300],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      },
    },
  };

  const starVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 30px rgba(218, 165, 32, 0.4)",
      transition: {
        duration: 0.2,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const features = [
    "Exclusive access to premium freebies",
    "One free complimentary session with a psychologist",
    "Access to 10 engaging comic stories",
    "Enjoy 15 immersive audio comics",
    "Listen to 8 insightful podcasts",
    "Access to assessment",
    "Get 10% off on annual workshops",
    "Chat freely with other community members",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{ perspective: 1000 }}
          >
            <motion.div
              className="absolute inset-0 opacity-20"
              variants={shimmerVariants}
              animate="animate"
            >
              <div className="w-20 h-full bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12" />
            </motion.div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 text-gray-400 transition-colors hover:text-white hover:bg-gray-700 rounded-full z-10"
            >
              <FaTimes size={14} className="sm:w-4 sm:h-4" />
            </button>

            <div className="relative p-4 sm:p-6 lg:p-8 text-center">
              <motion.div
                className="absolute top-2 left-4 sm:top-4 sm:left-8"
                variants={starVariants}
                animate="animate"
              >
                <FaStar className="text-yellow-400 text-xs sm:text-sm opacity-70" />
              </motion.div>
              <motion.div
                className="absolute top-8 right-8 sm:top-12 sm:right-12"
                variants={starVariants}
                animate="animate"
                style={{ animationDelay: "0.5s" }}
              >
                <FaGem className="text-blue-400 text-xs opacity-60" />
              </motion.div>
              <motion.div
                className="absolute top-4 right-12 sm:top-6 sm:right-20"
                variants={starVariants}
                animate="animate"
                style={{ animationDelay: "1s" }}
              >
                <FaStar className="text-purple-400 text-xs opacity-50" />
              </motion.div>

              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-lg"
                variants={crownVariants}
                animate="animate"
              >
                <FaCrown className="text-white text-xl sm:text-2xl" />
              </motion.div>

              <motion.h2
                className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Upgrade to Platinum
              </motion.h2>

              <motion.p
                className="text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6 px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                You need to upgrade to Platinum membership to access this
                feature
              </motion.p>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-h-48 sm:max-h-none overflow-y-auto"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start sm:items-center mb-2 sm:mb-3 text-xs sm:text-sm text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 mt-0.5 sm:mt-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2 h-2 sm:w-3 sm:h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="leading-tight">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 pt-2 sm:pt-4 space-y-2 sm:space-y-3">
              <motion.button
                className="relative w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-500 rounded-lg sm:rounded-xl shadow-lg overflow-hidden group"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={onNavigate}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={isHovered ? { x: "200%" } : { x: "-100%" }}
                  transition={{ duration: 0.6 }}
                />

                <div className="relative flex items-center justify-center space-x-2">
                  <span>Upgrade Now</span>
                  <motion.div
                    animate={isHovered ? { x: 5 } : { x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.div>
                </div>
              </motion.button>

              <motion.button
                className="w-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-gray-400 font-medium hover:text-white transition-colors"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Maybe Later
              </motion.button>
            </div>

            <div className="absolute top-0 left-0 w-full h-0.5 sm:h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlatinumMembershipModal;
