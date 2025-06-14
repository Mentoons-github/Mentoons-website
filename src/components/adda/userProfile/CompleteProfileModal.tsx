import { motion } from "framer-motion";
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
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black bg-opacity-40 pointer-events-auto px-4"
      style={{
        isolation: "isolate",
        contain: "layout paint size",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-[#F69306] p-4 rounded-2xl"
      >
        <div className="relative p-6 overflow-hidden bg-white rounded-lg">
          <button
            onClick={onClose}
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
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-400">
              <div className="w-16 h-16 bg-white rounded-full">
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
              </div>
            </div>

            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">
              Complete Your Profile to Earn 10 Points!
            </h2>

            <div className="w-full mb-8">
              <p className="mb-4 text-xl">Finish setting up your profile to:</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded">
                    ✓
                  </div>
                  <p className="text-lg">
                    Get personalized comic and podcast recommendations
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded">
                    ✓
                  </div>
                  <p className="text-lg">Save your favorite products</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 text-white bg-green-500 rounded">
                    ✓
                  </div>
                  <p className="text-lg">
                    Join creator contests & community events
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onCompleteProfile}
              className="w-full py-3 text-xl font-semibold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              Complete My Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default CompleteProfileModal;
