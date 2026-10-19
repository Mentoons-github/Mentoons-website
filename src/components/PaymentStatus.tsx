import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SubscriptionModal from "./common/modal/subscrptionModal";

interface PaymentStatusProps {
  // Optional props can be added here
}

/*
  Comic theme tokens (shared with Cart + OrderSummary)
  page   #FFFFFF   white background
  ink    #000      outlines + hard shadows
  yellow #FFD93B   aborted / highlights
  red    #FF4D3D   primary action / failure
  blue   #2D6BFF   unknown / accents
  mint   #BDF5D0   success

  Mobile (< sm): thinner borders, smaller shadows, no tilt, stacked buttons.
*/
const comicCss = `
@import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700;900&display=swap');

.comic-page { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; background: #fff; color: #000; }
.comic-title { font-family: 'Bangers', 'Impact', sans-serif; letter-spacing: 0.04em; }

.comic-panel { border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
.comic-btn {
  border: 3px solid #000;
  box-shadow: 3px 3px 0 #000;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
}
.comic-btn:active { transform: translate(3px, 3px); box-shadow: 0 0 0 #000; }
.comic-btn:focus-visible { outline: 4px dashed #2D6BFF; outline-offset: 3px; }

@media (min-width: 1024px) {
  .comic-panel { border-width: 4px; box-shadow: 8px 8px 0 #000; }
  .comic-btn { border-width: 4px; box-shadow: 5px 5px 0 #000; }
  .comic-btn:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 #000; }
  .comic-btn:active { transform: translate(5px, 5px); box-shadow: 0 0 0 #000; }
}

.comic-burst {
  clip-path: polygon(50% 0%, 61% 12%, 75% 5%, 79% 20%, 95% 21%, 90% 36%, 100% 48%, 90% 60%,
    96% 76%, 80% 78%, 75% 94%, 61% 88%, 50% 100%, 39% 88%, 25% 94%, 20% 78%,
    4% 76%, 10% 60%, 0% 48%, 10% 36%, 5% 21%, 21% 20%, 25% 5%, 39% 12%);
}

@media (prefers-reduced-motion: reduce) {
  .comic-btn { transition: none; }
}
`;

const PaymentStatus: React.FC<PaymentStatusProps> = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [statusData, setStatusData] = useState({
    status: searchParams.get("status") || "UNKNOWN",
    orderId: searchParams.get("orderId") || "",
    trackingId: searchParams.get("trackingId") || "",
    message: searchParams.get("message") || "",
    subscriptionType: searchParams.get("subscription") || "",
  });

  useEffect(() => {
    // Extract data from URL params
    console.log("params recieved : ", searchParams);
    const status = searchParams.get("status") || "UNKNOWN";
    const orderId = searchParams.get("orderId") || "";
    const trackingId = searchParams.get("trackingId") || "";
    const message = searchParams.get("message") || "";
    const subscriptionType = searchParams.get("subscription") || "";

    setStatusData({
      status,
      orderId,
      trackingId,
      message,
      subscriptionType,
    });

    if (subscriptionType === "platinum" || subscriptionType === "prime") {
      setOpen(true);
    }
    if (status === "Success") {
      triggerReward(RewardEventType.PURCHASE_PRODUCT, orderId);
    }
  }, [searchParams]);

  console.log("statusData Recieved : ", statusData);

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

  // Determine status theme and icon (comic palette: banner bg, burst bg, sound word)
  const getStatusTheme = () => {
    switch (statusData.status) {
      case "Success":
        return {
          bg: "bg-[#BDF5D0]",
          burst: "bg-[#FFD93B]",
          sfx: "Yay!",
          icon: "✓",
          title: "Payment Successful",
          message: "Thank you for your purchase!",
        };
      case "Failure":
        return {
          bg: "bg-[#FFC9C2]",
          burst: "bg-[#FF4D3D]",
          sfx: "Oops!",
          icon: "✗",
          title: "Payment Failed",
          message: "We couldn't process your payment. Please try again.",
        };
      case "Aborted":
        return {
          bg: "bg-[#FFF3B8]",
          burst: "bg-[#FFD93B]",
          sfx: "Hold on!",
          icon: "⚠",
          title: "Payment Aborted",
          message: "The payment process was cancelled.",
        };
      case "Invalid":
      case "ERROR":
        return {
          bg: "bg-[#FFC9C2]",
          burst: "bg-[#FF4D3D]",
          sfx: "Uh-oh!",
          icon: "⚠",
          title: "Invalid Payment",
          message:
            statusData.message || "Something went wrong with your payment.",
        };
      case "Cancelled":
        return {
          bg: "bg-[#EDEDED]",
          burst: "bg-white",
          sfx: "Hmm.",
          icon: "✗",
          title: "Payment Cancelled",
          message: "You've cancelled the payment process.",
        };
      default:
        return {
          bg: "bg-[#E6EEFF]",
          burst: "bg-[#2D6BFF]",
          sfx: "Hmm?",
          icon: "?",
          title: "Payment Status Unknown",
          message: "We're checking the status of your payment.",
        };
    }
  };

  const theme = getStatusTheme();

  return (
    <div className="comic-page min-h-screen">
      <style>{comicCss}</style>

      <motion.div
        className="mx-auto max-w-4xl p-4 py-8 sm:p-6 md:p-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status banner */}
        <motion.div
          className={`comic-panel relative mb-8 rounded-2xl p-6 pt-10 text-center sm:p-8 sm:pt-12 lg:-rotate-1 ${theme.bg}`}
          variants={itemVariants}
        >
          {/* Sound-effect tag */}
          <span className="comic-title absolute -top-4 left-4 -rotate-3 border-[3px] border-black bg-white px-3 py-0.5 text-xl shadow-[3px_3px_0_#000] sm:left-6 sm:text-2xl">
            {theme.sfx}
          </span>

          <motion.div
            className={`comic-burst mx-auto mb-4 flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32 ${theme.burst}`}
            initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, duration: 0.8 }}
          >
            <span className="comic-title text-6xl leading-none text-black sm:text-7xl">
              {theme.icon}
            </span>
          </motion.div>

          <h1 className="comic-title mb-3 text-5xl leading-[1.05] text-black sm:text-6xl lg:text-7xl">
            {theme.title}
          </h1>
          <p className="mx-auto max-w-xl text-lg font-bold sm:text-xl">
            {theme.message}
          </p>
        </motion.div>

        {statusData.orderId && (
          <motion.div
            className="comic-panel mb-8 rounded-2xl bg-white p-5 sm:p-6"
            variants={itemVariants}
          >
            <h2 className="comic-title mb-4 inline-block border-[3px] border-black bg-[#2D6BFF] px-4 py-1 text-3xl text-white shadow-[3px_3px_0_#000] sm:text-4xl">
              Order Details
            </h2>
            <div className="space-y-4 text-base sm:text-lg">
              <div className="flex justify-between gap-4 border-b-[3px] border-dashed border-black pb-3">
                <span className="font-bold">Order ID:</span>
                <span className="break-all text-right font-black">
                  {statusData.orderId}
                </span>
              </div>
              {statusData.trackingId && (
                <div className="flex justify-between gap-4 border-b-[3px] border-dashed border-black pb-3">
                  <span className="font-bold">Tracking ID:</span>
                  <span className="break-all text-right font-black">
                    {statusData.trackingId}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 border-b-[3px] border-dashed border-black pb-3">
                <span className="font-bold">Status:</span>
                <span
                  className={`rounded-full border-[3px] border-black px-3 py-0.5 font-black ${theme.bg}`}
                >
                  {statusData.status}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-bold">Date:</span>
                <span className="font-black">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
          <motion.div variants={itemVariants} className="flex-1">
            <Link
              to="/products"
              className="comic-btn comic-title block w-full rounded-xl bg-[#FF4D3D] px-5 py-3 text-center text-3xl text-white [text-shadow:2px_2px_0_#000]"
            >
              Continue Shopping
            </Link>
          </motion.div>

          {statusData.status === "SUCCESS" && (
            <motion.div variants={itemVariants} className="flex-1">
              <Link
                to="/account/orders"
                className="comic-btn comic-title block w-full rounded-xl bg-[#FFD93B] px-5 py-3 text-center text-3xl text-black"
              >
                View My Orders
              </Link>
            </motion.div>
          )}

          {(statusData.status === "FAILURE" ||
            statusData.status === "ABORTED" ||
            statusData.status === "ERROR") && (
            <motion.div variants={itemVariants} className="flex-1">
              <Link
                to="/checkout"
                className="comic-btn comic-title block w-full rounded-xl bg-[#FFD93B] px-5 py-3 text-center text-3xl text-black"
              >
                Try Again
              </Link>
            </motion.div>
          )}
        </div>
        <SubscriptionModal
          open={open}
          onClose={() => setOpen(false)}
          subscriptionType={statusData.subscriptionType}
          status={statusData.status}
        />
      </motion.div>
    </div>
  );
};

export default PaymentStatus;
