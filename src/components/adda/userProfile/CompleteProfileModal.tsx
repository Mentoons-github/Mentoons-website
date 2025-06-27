import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({
  isOpen,
  onClose,
  onCompleteProfile,
}) => {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto px-4"
          style={{
            isolation: "isolate",
            contain: "layout paint size",
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.3,
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="relative w-full max-w-md bg-[#F69306] p-4 rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="relative p-6 overflow-hidden bg-white rounded-lg"
            >
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute text-orange-500 top-4 right-4 hover:text-orange-600"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </motion.button>

              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-400 sm:w-20 sm:h-20 md:w-24 md:h-24"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      delay: 0.4,
                      duration: 0.6,
                      repeat: Infinity,
                      repeatType: "reverse",
                      repeatDelay: 3,
                    }}
                    className="w-10 h-10 bg-white rounded-full sm:w-12 sm:h-12 md:w-16 md:h-16"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-full h-full p-2 text-gray-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4 text-2xl font-bold text-center text-gray-800 sm:text-3xl sm:mb-6 md:mb-8"
                >
                  Complete Your Profile to Earn 10 Points!
                </motion.h2>

                <div className="w-full mb-6 sm:mb-8">
                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-4 text-lg sm:text-xl"
                  >
                    Finish setting up your profile to:
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-3"
                  >
                    {[
                      "Get personalized comic and podcast recommendations",
                      "Save your favorite products",
                      "Join creator contests & community events",
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.5 + index * 0.1,
                          type: "spring",
                          stiffness: 300,
                        }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex items-center justify-center w-5 h-5 text-white bg-green-500 rounded sm:w-6 sm:h-6"
                        >
                          ✓
                        </motion.div>
                        <p className="text-base sm:text-lg">{item}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                <motion.button
                  onClick={onCompleteProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="w-full py-2 text-lg font-semibold text-white transition-colors bg-orange-500 rounded-lg sm:py-3 sm:text-xl hover:bg-orange-600"
                >
                  Complete My Profile
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CompleteProfileModal;
