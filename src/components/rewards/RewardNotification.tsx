import { RootState } from "@/redux/store";
import { RewardEventType } from "@/types/rewards";
import { getRewardEventLabel } from "@/utils/rewardHelper";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface RewardNotificationProps {
  eventType: RewardEventType;
  onClose: () => void;
}

const RewardNotification: React.FC<RewardNotificationProps> = ({
  eventType,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);
  const { totalPoints, currentTier, pointsToNextTier } = useSelector(
    (state: RootState) => state.rewards
  );

  // Get points for event type
  const getPointsForEvent = () => {
    const pointsMapping: Record<RewardEventType, number> = {
      [RewardEventType.DAILY_LOGIN]: 5,
      [RewardEventType.REGISTRATION]: 50,
      [RewardEventType.PROFILE_COMPLETION]: 100,
      [RewardEventType.LIKE_POST]: 2,
      [RewardEventType.COMMENT_POST]: 5,
      [RewardEventType.SHARE_POST]: 10,
      [RewardEventType.CREATE_STATUS]: 8,
      [RewardEventType.JOIN_GROUP]: 15,
      [RewardEventType.FOLLOW_USER]: 5,
      [RewardEventType.PURCHASE_PRODUCT]: 50,
      [RewardEventType.SHARE_PRODUCT]: 15,
      [RewardEventType.BOOK_SESSION]: 30,
      [RewardEventType.APPLY_JOB]: 20,
      [RewardEventType.LISTEN_AUDIO_COMIC]: 15,
      [RewardEventType.LISTEN_PODCAST]: 10,
      [RewardEventType.READ_COMIC]: 20,
      [RewardEventType.SAVED_POST]: 5,
    };

    return pointsMapping[eventType] || 0;
  };

  // Show the notification with animation
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out animation to complete
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-sm w-full transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-8 w-8 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            +{getPointsForEvent()} Points Earned!
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {getRewardEventLabel(eventType)}
          </p>
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Total: {totalPoints} points</span>
              <span className="capitalize">{currentTier} tier</span>
            </div>
            {pointsToNextTier > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      currentTier === "bronze"
                        ? (totalPoints / 500) * 100
                        : currentTier === "silver"
                        ? (totalPoints / 1500) * 100
                        : 100
                    }%`,
                  }}
                ></div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">Close</span>
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RewardNotification;
