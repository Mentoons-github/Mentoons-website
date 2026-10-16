import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import SubscriptionLimitModal from "../modals/SubscriptionLimitModal";

const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const [showModal, setShowModal] = useState(false);
  const hasShownRef = useRef(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const storageKey = `trial-expired-modal-shown:${user.id}`;

    // Already shown before (this session or a previous one) -> do nothing
    try {
      if (localStorage.getItem(storageKey) === "true") {
        hasShownRef.current = true;
        return;
      }
    } catch {
      // localStorage unavailable; fall back to the in-memory ref only
    }

    let cancelled = false;

    const checkTrialStatus = async () => {
      if (hasShownRef.current || cancelled) return;

      try {
        const token = await getToken();
        if (!token || cancelled) return;

        const res = await axios.get(
          `${import.meta.env.VITE_PROD_URL}/user/user/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const userData = res.data.data;
        const isFree = userData?.subscription?.plan === "free";
        const trialEndRaw = userData?.subscriptionLimits?.freeTrialEndDate;

        if (!trialEndRaw) return;

        const trialEnd = new Date(trialEndRaw);

        if (isFree && trialEnd < new Date()) {
          hasShownRef.current = true;
          try {
            localStorage.setItem(storageKey, "true");
          } catch {
            // ignore storage errors
          }
          setShowModal(true);

          // No need to keep polling once the modal has been shown
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    const intervalId = setInterval(checkTrialStatus, 60000);
    checkTrialStatus();

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [getToken, user?.id]);

  return (
    <>
      <SubscriptionLimitModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Free Trial Expired"
        message="Your 3-day trial has ended. Upgrade to continue enjoying the content."
        planType="free"
        productId=""
      />
      {children}
    </>
  );
};

export default SubscriptionGuard;
