import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { menuItems } from "@/utils/menuItems";
import ReportAbuseModal from "../common/modal/BlockAndReportModal";

interface ChatMenuModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  conversationId: string;
  userId: string;
  currentUserBlocked: boolean;
  handleBlockSuccess: () => void;
  handleUnblockSuccess: () => void;
}

const ChatMenuModal: React.FC<ChatMenuModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  conversationId,
  buttonRef,
  userId,
  currentUserBlocked,
  handleBlockSuccess,
  handleUnblockSuccess,
}) => {
  const [modalType, setModalType] = useState<
    "report" | "block" | "unblock" | null
  >(null);

  const handleAction = (action: string) => {
    switch (action) {
      case "Report Abuse":
        setModalType("report");
        break;
      case "Block User":
        setModalType("block");
        break;
      case "Unblock User":
        setModalType("unblock");
        break;
      case "Mute User":
        break;
      default:
        break;
    }

    setIsModalOpen(false);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.action === "Block User" && currentUserBlocked) return false;
    if (item.action === "Unblock User" && !currentUserBlocked) return false;
    return true;
  });

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
      ></button>

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
              {filteredMenuItems.map((item, index) => (
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
      {modalType && (
        <ReportAbuseModal
          isOpen={!!modalType}
          setIsOpen={() => setModalType(null)}
          modalType={modalType}
          contentId={conversationId}
          reportType="user"
          userId={userId}
          onSuccess={() => {
            if (currentUserBlocked) {
              handleUnblockSuccess();
            }
            if (!currentUserBlocked) {
              handleBlockSuccess();
            }
          }}
        />
      )}
    </div>
  );
};

export default ChatMenuModal;
