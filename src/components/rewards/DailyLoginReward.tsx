import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

/**
 * Component to handle daily login rewards
 * Should be mounted at a high level in your app (e.g. App.tsx, Layout.tsx)
 */
const DailyLoginReward = () => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    // Only trigger for signed-in users
    if (!isSignedIn || !user) return;

    // Check if we've already rewarded this user today
    const lastLoginDate = localStorage.getItem("lastLoginRewardDate");
    const today = new Date().toDateString();

    // If no lastLoginDate or if it's a different day, reward the user
    if (lastLoginDate !== today) {
      // Add a small delay to ensure reward system is initialized
      const timer = setTimeout(() => {
        // Use the global reward action handlers
        if (window.rewardActions && window.rewardActions.dailyLogin) {
          window.rewardActions.dailyLogin();
        }
        localStorage.setItem("lastLoginRewardDate", today);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSignedIn, user]);

  // This is a utility component with no UI
  return null;
};

export default DailyLoginReward;
