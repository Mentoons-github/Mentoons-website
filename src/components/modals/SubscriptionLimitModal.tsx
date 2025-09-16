import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {
  FiStar,
  FiZap,
  FiCheck,
  FiMic,
  FiHeadphones,
  FiBookOpen,
  FiTarget,
  FiGift,
  FiPhone,
} from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { createPortal } from "react-dom";

interface SubscriptionLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title: string;
  planType: "free" | "prime" | "platinum";
  productId: string;
  currentUsage?: number;
  usageLimit?: number;
}

const SubscriptionLimitModal: React.FC<SubscriptionLimitModalProps> = ({
  isOpen,
  onClose,
  message,
  title,
  planType,
  productId,
  currentUsage = 0,
  usageLimit = 0,
}) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"prime" | "platinum">(
    "prime"
  );
  const [isClient, setIsClient] = useState(false); // For SSR compatibility

  console.log(message);
  console.log("planType : ", planType);

  // Ensure client-side rendering for createPortal
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isClient || !isOpen) return null;

  const plans = {
    prime: {
      name: "Prime",
      price: "₹129",
      color: "from-amber-400 via-orange-400 to-yellow-500",
      icon: FiStar,
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
      features: [
        { icon: FiGift, text: "Access to freebies" },
        { icon: FiPhone, text: "1 Free psychology call" },
        { icon: FiBookOpen, text: "5 Comics per month" },
        { icon: FiHeadphones, text: "10 Audio comics" },
        { icon: FiMic, text: "5 Podcasts per month" },
        { icon: FiTarget, text: "Mental assessments" },
      ],
      badge: "Popular",
    },
    platinum: {
      name: "Platinum",
      price: "₹279",
      color: "from-purple-400 via-indigo-400 to-blue-500",
      icon: FaCrown,
      bgGradient: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      features: [
        { icon: FiGift, text: "Premium freebies access" },
        { icon: FiPhone, text: "1 Free psychology call" },
        { icon: FiBookOpen, text: "10 Comics per month" },
        { icon: FiHeadphones, text: "15 Audio comics" },
        { icon: FiMic, text: "8 Podcasts per month" },
        { icon: FiTarget, text: "All assessments" },
        { icon: FiStar, text: "10% Workshop discount" },
      ],
      badge: "Best Value",
    },
  };

  const usagePercentage =
    usageLimit > 0 ? Math.min((currentUsage / usageLimit) * 100, 100) : 0;

  const handleBrowsePlans = async () => {
    setIsUpgrading(true);
    try {
      onClose();
      navigate("/membership");
      setTimeout(() => {
        document
          .getElementById("subscription")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Please log in to complete the purchase.");
        navigate("/sign-in");
        onClose();
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/api/purchase`,
        { productId, amount: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 30000,
        }
      );

      if (response.status === 200) {
        toast.success("🎉 Content purchased successfully!");
        onClose();
        setTimeout(() => navigate(0), 1000);
      } else {
        throw new Error("Purchase failed");
      }
    } catch (error: any) {
      console.error("Error purchasing content:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error during purchase. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const displayMessage =
    message ||
    (planType === "free"
      ? "You're on the free plan. Upgrade to unlock more features!"
      : "Upgrade your plan to continue.");

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 isolate"
        onClick={handleBackdropClick}
      >
        {/* Backdrop with blur effect */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
          className="relative w-full max-w-4xl mx-auto max-h-[90vh] overflow-hidden z-10"
        >
          <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute z-[10000] p-2 transition-all duration-300 rounded-full top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 hover:backdrop-blur-sm hover:scale-110"
              aria-label="Close modal"
            >
              <IoMdClose size={24} />
            </button>

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-gray-800 mb-2"
                >
                  {title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 text-lg"
                >
                  {displayMessage}
                </motion.p>
              </div>

              {/* Usage indicator */}
              {usageLimit > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200/50"
                >
                  <div className="flex justify-between mb-2 text-sm font-medium text-gray-700">
                    <span>Current Usage</span>
                    <span>
                      {currentUsage} / {usageLimit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-2 rounded-full bg-gradient-to-r from-red-400 to-red-500"
                    />
                  </div>
                </motion.div>
              )}

              {/* Plans comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {Object.entries(plans).map(([key, plan], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => setSelectedPlan(key as "prime" | "platinum")}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
                      selectedPlan === key
                        ? `${plan.borderColor} bg-gradient-to-br ${plan.bgGradient} shadow-lg backdrop-blur-md`
                        : "border-gray-200 bg-white/80 hover:border-gray-300 hover:bg-white/90"
                    }`}
                  >
                    {/* Badge */}
                    {key === "platinum" && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span
                          className={`inline-flex items-center gap-1 py-1 px-3 text-xs font-bold rounded-full text-white bg-gradient-to-r ${plan.color} shadow-md backdrop-blur-sm`}
                        >
                          <FaCrown className="w-3 h-3" />
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    {/* Plan header */}
                    <div className="text-center mb-6">
                      <div
                        className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} shadow-lg mb-3`}
                      >
                        <plan.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {plan.name}
                      </h3>
                      <div className="text-3xl font-bold text-gray-800">
                        {plan.price}
                        <span className="text-sm font-normal text-gray-500">
                          /month
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + featureIndex * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={`p-1 rounded-full bg-gradient-to-r ${plan.color}`}
                          >
                            <FiCheck className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {feature.text}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Selection indicator */}
                    {selectedPlan === key && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4"
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg`}
                        >
                          <FiCheck className="w-4 h-4 text-white" />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {title === "Purchase Content" ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
                    >
                      {isPurchasing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiZap className="w-5 h-5" />
                          Purchase for ₹1
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onClose}
                      className="flex-1 px-6 py-4 font-semibold border-2 rounded-xl text-gray-600 border-gray-300 hover:bg-gray-50/80 transition-all duration-300 backdrop-blur-sm"
                    >
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBrowsePlans}
                      disabled={isUpgrading}
                      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-bold text-white rounded-xl bg-gradient-to-r ${plans[selectedPlan].color} hover:shadow-lg transition-all duration-300 disabled:opacity-50 backdrop-blur-sm`}
                    >
                      {isUpgrading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FaCrown className="w-5 h-5" />
                          Browse Plans
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={onClose}
                      className="flex-1 px-6 py-4 font-semibold border-2 rounded-xl text-gray-600 border-gray-300 hover:bg-gray-50/80 transition-all duration-300 backdrop-blur-sm"
                    >
                      Maybe Later
                    </motion.button>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default SubscriptionLimitModal;
