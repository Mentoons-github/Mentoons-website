import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import SubscriptionLimitModal from "../modals/SubscriptionLimitModal";

const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const [showModal, setShowModal] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const checkTrialStatus = async () => {
      try {
        const token = await getToken();
        if (!token || !user?.id) return;

        const res = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/user/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = res.data;
        const isFree = userData.subscription?.plan === "free";
        const trialEnd = new Date(
          userData.subscriptionLimits?.freeTrialEndDate
        );
        const now = new Date();

        if (isFree && trialEnd < now) {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    checkTrialStatus();

    const intervalId = setInterval(checkTrialStatus, 60000);

    return () => clearInterval(intervalId);
  }, [getToken, user?.id]);

  return (
    <>
      {showModal && (
        <SubscriptionLimitModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Free Trial Expired"
          message="Your 3-day trial has ended. Upgrade to continue enjoying the content."
          planType="free"
          productId=""
        />
      )}
      {children}
    </>
  );
};

export default SubscriptionGuard;
