import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface PaymentStatusProps {
  // Optional props can be added here
}

const PaymentStatus: React.FC<PaymentStatusProps> = () => {
  const [searchParams] = useSearchParams();
  const [statusData, setStatusData] = useState({
    status: searchParams.get("status") || "UNKNOWN",
    orderId: searchParams.get("orderId") || "",
    trackingId: searchParams.get("trackingId") || "",
    message: searchParams.get("message") || "",
  });

  useEffect(() => {
    // Extract data from URL params
    console.log("params recieved : ", searchParams);
    const status = searchParams.get("status") || "UNKNOWN";
    const orderId = searchParams.get("orderId") || "";
    const trackingId = searchParams.get("trackingId") || "";
    const message = searchParams.get("message") || "";

    setStatusData({
      status,
      orderId,
      trackingId,
      message,
    });
  }, [searchParams]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Determine status theme and icon
  const getStatusTheme = () => {
    switch (statusData.status) {
      case "SUCCESS":
        return {
          color: "text-green-600",
          bgColor: "bg-green-100",
          icon: "✓",
          title: "Payment Successful",
          message: "Thank you for your purchase!",
        };
      case "FAILURE":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: "✗",
          title: "Payment Failed",
          message: "We couldn't process your payment. Please try again.",
        };
      case "Aborted":
        return {
          color: "text-amber-600",
          bgColor: "bg-amber-100",
          icon: "⚠",
          title: "Payment Aborted",
          message: "The payment process was cancelled.",
        };
      case "Invalid":
      case "ERROR":
        return {
          color: "text-red-600",
          bgColor: "bg-red-100",
          icon: "⚠",
          title: "Invalid Payment",
          message:
            statusData.message || "Something went wrong with your payment.",
        };
      case "Cancelled":
        return {
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          icon: "✗",
          title: "Payment Cancelled",
          message: "You've cancelled the payment process.",
        };
      default:
        return {
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          icon: "?",
          title: "Payment Status Unknown",
          message: "We're checking the status of your payment.",
        };
    }
  };

  const theme = getStatusTheme();

  return (
    <motion.div
      className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl my-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className={`${theme.bgColor} p-6 rounded-xl text-center mb-8`}
        variants={itemVariants}
      >
        <motion.div
          className={`w-20 h-20 mx-auto rounded-full ${theme.bgColor} border-4 ${theme.color} border-current flex items-center justify-center text-4xl mb-4`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, duration: 0.8 }}
        >
          {theme.icon}
        </motion.div>

        <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme.color}`}>
          {theme.title}
        </h1>
        <p className="text-lg text-gray-700 mb-2">{theme.message}</p>
      </motion.div>

      {statusData.orderId && (
        <motion.div
          className="mb-8 p-6 bg-white rounded-lg shadow-md"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold mb-4 text-black">
            Order Details
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{statusData.orderId}</span>
            </div>
            {statusData.trackingId && (
              <div className="flex justify-between border-b pb-3">
                <span className="text-gray-600">Tracking ID:</span>
                <span className="font-medium">{statusData.trackingId}</span>
              </div>
            )}
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium ${theme.color}`}>
                {statusData.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.div variants={itemVariants} className="flex-1">
          <Link to="/mentoons-store" className="block">
            <motion.button
              className="w-full px-5 py-4 bg-black text-white rounded-lg font-medium text-lg shadow-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              Continue Shopping
            </motion.button>
          </Link>
        </motion.div>

        {statusData.status === "SUCCESS" && (
          <motion.div variants={itemVariants} className="flex-1">
            <Link to="/account/orders" className="block">
              <motion.button
                className="w-full px-5 py-4 bg-white text-black border-2 border-black rounded-lg font-medium text-lg shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                View My Orders
              </motion.button>
            </Link>
          </motion.div>
        )}

        {(statusData.status === "FAILURE" ||
          statusData.status === "ABORTED" ||
          statusData.status === "ERROR") && (
          <motion.div variants={itemVariants} className="flex-1">
            <Link to="/checkout" className="block">
              <motion.button
                className="w-full px-5 py-4 bg-white text-black border-2 border-black rounded-lg font-medium text-lg shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                Try Again
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentStatus;
