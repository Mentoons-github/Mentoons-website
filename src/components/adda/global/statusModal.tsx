import { useStatusModal } from "@/context/adda/statusModalContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const StatusModal = () => {
  const { status, closeStatus } = useStatusModal();

  const getStylesByType = () => {
    switch (status.type) {
      case "success":
        return {
          bgColor: "bg-green-500",
          icon: <CheckCircle size={20} />,
        };
      case "error":
        return {
          bgColor: "bg-red-500",
          icon: <AlertCircle size={20} />,
        };
      case "info":
      default:
        return {
          bgColor: "bg-blue-500",
          icon: <Info size={20} />,
        };
    }
  };

  const { bgColor, icon } = getStylesByType();

  return (
    <AnimatePresence>
      {status.open && (
        <div className="fixed bottom-0 left-0 w-full flex justify-center items-center px-4 pb-4 z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="pointer-events-auto"
          >
            <motion.div
              className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-md md:max-w-lg w-full`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="text-sm md:text-base">{status.message}</span>
                </div>
                <motion.button
                  onClick={closeStatus}
                  className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <X size={18} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StatusModal;
