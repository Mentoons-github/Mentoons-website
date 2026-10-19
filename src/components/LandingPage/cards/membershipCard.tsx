import PaymentProcessFlow from "@/components/common/modal/paymentModal";
import { Membership } from "@/types/home/membership";
import { ORDER_TYPE } from "@/utils/enum";
import { errorToast } from "@/utils/toastResposnse";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FaCheck, FaStar, FaTimes } from "react-icons/fa";
import LoginModal from "@/components/common/modal/loginModal";

const MembershipCard = ({ membership }: { membership: Membership }) => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const { getToken, userId } = useAuth();
  const { user } = useUser();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [gatewayTimeout, setGatewayTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  const minLoadingDuration = 1500;

  const [loadingDuration, setLoadingDuration] = useState(minLoadingDuration);

  const startGatewayTimeoutCheck = () => {
    if (gatewayTimeout) {
      clearTimeout(gatewayTimeout);
    }

    const timeoutId = setTimeout(() => {
      setPaymentError(
        "Payment gateway is taking longer than expected. Please try again.",
      );
    }, 15000);

    setGatewayTimeout(timeoutId);
  };

  const clearGatewayTimeoutCheck = () => {
    if (gatewayTimeout) {
      clearTimeout(gatewayTimeout);
      setGatewayTimeout(null);
    }
  };

  const handleMembership = async (membership: Membership) => {
    console.log("mem :", membership.type);
    console.log("Membership handling initiated");
    try {
      setPaymentError(null);

      const token = await getToken();
      if (!token) {
        setLoginModalOpen(true);
        return;
      }
      setIsProcessingPayment(true);

      startGatewayTimeoutCheck();

      const requestStartTime = Date.now();
      const total = membership.type === "Prime" ? 129 : 279;

      const subscriptionData = {
        orderId: `#ORD-${Date.now()}`,
        totalAmount: total,
        amount: total,
        currency: "INR",
        productInfo: `Mentoons ${membership.type} Membership`,
        customerName:
          user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.fullName || "Unknown",
        email: user?.emailAddresses[0].emailAddress,
        phone: user?.phoneNumbers?.[0]?.phoneNumber || "",
        status: "PENDING",
        user: userId,
        order_type: ORDER_TYPE.SUBSCRIPTION_PURCHASE,
        items: [
          {
            name: membership.type,
            price: 1, // change t0 499
            quantity: 1,
          },
        ],
        orderStatus: "pending",
        paymentDetails: {
          paymentMethod: "credit_card",
          paymentStatus: "initiated",
        },
        sameAsShipping: true,
      };

      console.log("subscriptionData", subscriptionData);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_PROD_URL}/payment/initiate?type=subscription`,
          subscriptionData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const requestDuration = Date.now() - requestStartTime;

        const calculatedDuration = Math.max(
          minLoadingDuration,
          requestDuration * 1.5,
        );
        setLoadingDuration(calculatedDuration);

        clearGatewayTimeoutCheck();

        console.log("response", response);
        console.log("response.data", response.data);

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = response.data;

        const form = tempDiv.querySelector("form");
        if (form) {
          document.body.appendChild(form);
          form.submit();
        } else {
          setPaymentError(
            "Unable to initialize payment gateway. Please try again.",
          );
        }
      } catch (error) {
        const requestDuration = Date.now() - requestStartTime;
        const calculatedDuration = Math.max(
          minLoadingDuration,
          requestDuration * 1.2,
        );
        setLoadingDuration(calculatedDuration);

        clearGatewayTimeoutCheck();
        if (axios.isAxiosError(error) && error.response) {
          setPaymentError(
            `Gateway error: ${error.response.status}. Please try again.`,
          );
        } else {
          setPaymentError(
            "Failed to connect to payment gateway. Please try again.",
          );
        }
      }
    } catch (error: unknown) {
      clearGatewayTimeoutCheck();

      if (error instanceof Error) {
        setPaymentError(error.message);
      } else {
        setPaymentError(
          "Failed to process membership payment. Please try again later.",
        );
      }

      console.error("Membership payment error:", error);
      errorToast(
        error instanceof Error
          ? error.message
          : "Failed to process membership payment. Please try again later.",
      );
    }
  };

  const handlePaymentRetry = () => {
    setPaymentError(null);
    handleMembership(membership);
  };

  const handlePaymentCancel = () => {
    clearGatewayTimeoutCheck();

    setIsProcessingPayment(false);
    setPaymentError(null);
  };

  const isPlatinum = membership.type === "Platinum";

  return (
    <>
      <motion.div
        ref={sectionRef}
        id={`membership-${membership.type}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={`relative w-full max-w-md rounded-2xl border-2 border-gray-900 p-4 shadow-[8px_8px_0_0_#111827] sm:p-5 ${
          isPlatinum ? "bg-[#4CC9F0]" : "bg-[#FFD93D]"
        }`}
      >
        {isPlatinum && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="font-comic-chip absolute -top-5 left-1/3 z-20 -translate-x-1/2 -rotate-3 rounded-full border-2 border-gray-900 bg-[#FF5D8F] px-3 py-1.5 shadow-[3px_3px_0_0_#111827]"
          >
            <h1 className="flex items-center gap-2 text-xs tracking-wide text-white">
              Recommended Plan <FaStar className="text-[#FFD93D]" />
            </h1>
          </motion.div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between rounded-xl border-2 border-gray-900 bg-white p-3 shadow-[3px_3px_0_0_#111827]">
            <div>
              <h2 className="font-comic text-2xl tracking-wide text-gray-900 md:text-3xl">
                Mentoons {membership.type}
              </h2>

              <strong className="font-comic-chip text-xl tracking-wide text-gray-900 md:text-2xl">
                ₹{membership.price}
                <span className="font-sans text-sm font-semibold text-gray-600">
                  {" "}
                  / annum
                </span>
              </strong>
              <p className="text-xs font-bold text-green-700 md:text-sm">
                (~₹{(membership.price / 12).toFixed(0)} per month)
              </p>
            </div>
            <img
              src={membership.character}
              alt={membership.type}
              className="w-12 object-contain sm:w-14"
            />
          </div>

          <ul className="flex w-full flex-col gap-2">
            {membership.benefits.map((data, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`flex items-center justify-between gap-2 rounded-lg border-2 border-gray-900 p-2 text-xs transition-all md:text-sm ${
                  data.important
                    ? isPlatinum
                      ? "bg-[#FF5D8F] font-bold text-white shadow-[3px_3px_0_0_#111827]"
                      : "bg-[#FF9800] font-bold text-gray-900 shadow-[3px_3px_0_0_#111827]"
                    : "bg-white font-semibold text-gray-700"
                }`}
              >
                <span>{data.feature}</span>
                <div className="flex items-center gap-2">
                  <span>{data.details}</span>
                  {data.details === "Not available" ? (
                    <FaTimes className="text-red-600" />
                  ) : (
                    <FaCheck
                      className={
                        data.important ? "text-gray-900" : "text-green-700"
                      }
                    />
                  )}
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="mt-2 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-comic-chip rounded-xl border-2 border-gray-900 bg-[#FF9800] px-8 py-2 text-lg tracking-wide text-white shadow-[4px_4px_0_0_#111827] transition-all hover:shadow-[2px_2px_0_0_#111827] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              style={{ textShadow: "2px 2px 0 #111827" }}
              onClick={() => handleMembership(membership)}
            >
              Buy Now
            </motion.button>
          </div>
        </div>
      </motion.div>

      <PaymentProcessFlow
        isActive={isProcessingPayment}
        onComplete={() => {
          clearGatewayTimeoutCheck();
          setIsProcessingPayment(false);
        }}
        error={paymentError}
        onRetry={handlePaymentRetry}
        onCancel={handlePaymentCancel}
        loadingDuration={loadingDuration}
      />
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
};

export default MembershipCard;
