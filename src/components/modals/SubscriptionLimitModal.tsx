import { motion } from "framer-motion";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

interface SubscriptionLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title: string;
  planType: "Free" | "Prime" | "Platinum";
}

const SubscriptionLimitModal: React.FC<SubscriptionLimitModalProps> = ({
  isOpen,
  onClose,
  message,
  title,
  planType,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const planColorMap = {
    Free: "from-green-400 to-green-500",
    Prime: "from-yellow-400 to-orange-500",
    Platinum: "from-gray-400 to-gray-500",
  };

  const handleBrowsePlans = () => {
    onClose();
    navigate("/membership");
    setTimeout(() => {
      document
        .getElementById("subscription")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="relative w-[90%] max-w-md p-6 mx-auto bg-white rounded-xl shadow-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute p-1 transition-colors rounded-full top-4 right-4 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
        >
          <IoMdClose size={24} />
        </button>

        {/* Badge */}
        <div className="flex justify-center mb-4">
          <span
            className={`inline-block py-1.5 px-4 text-sm font-semibold rounded-lg text-white bg-gradient-to-r ${planColorMap[planType]}`}
          >
            {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
          </span>
        </div>

        <h2 className="mb-4 text-2xl font-bold text-center">{title}</h2>
        <p className="mb-6 text-center text-neutral-600">{message}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleBrowsePlans}
            className="flex-1 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary/90"
          >
            Upgrade Plan
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 font-medium transition-colors border rounded-lg text-primary border-primary hover:bg-primary/10"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionLimitModal;
