import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menuItems } from "@/utils/menuItems";

interface ChatMenuModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleAction: (action: string) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

const ChatMenuModal: React.FC<ChatMenuModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  handleAction,
  buttonRef,
}) => {
  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
      >
        {/* <i className="text-xl text-gray-500 hover:text-indigo-500 transition-colors">
          ⋮
        </i> */}
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 w-48 py-2 z-50"
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.action}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                  onClick={() => handleAction(item.action)}
                  className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                    item.hoverBg
                  } ${
                    index !== menuItems.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatMenuModal;
