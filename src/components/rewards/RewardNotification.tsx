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
      [RewardEventType.DAILY_LOGIN]: 2,
      [RewardEventType.REGISTRATION]: 8,
      [RewardEventType.PROFILE_COMPLETION]: 15,
      [RewardEventType.LIKE_POST]: 2,
      [RewardEventType.LOVE_POST]: 3,
      [RewardEventType.COMMENT_POST]: 5,
      [RewardEventType.SHARE_POST]: 5,
      [RewardEventType.CREATE_STATUS]: 8,
      [RewardEventType.JOIN_GROUP]: 5,
      [RewardEventType.FOLLOW_USER]: 5,
      [RewardEventType.PURCHASE_PRODUCT]: 10,
      [RewardEventType.SHARE_PRODUCT]: 5,
      [RewardEventType.BOOK_SESSION]: 10,
      [RewardEventType.APPLY_JOB]: 5,
      [RewardEventType.LISTEN_AUDIO_COMIC]: 5,
      [RewardEventType.LISTEN_PODCAST]: 5,
      [RewardEventType.READ_COMIC]: 5,
      [RewardEventType.SAVED_POST]: 5,
      [RewardEventType.REDEEM_POINTS]: 0,
    };

    return pointsMapping[eventType] || 0;
  };

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg shadow-orange-300 rounded-lg p-4 max-w-sm w-full transition-opacity duration-400 border-4 border-orange-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Confetti animation overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`confetti confetti-${i % 5}`}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: [
                  "#FFC107",
                  "#FF5722",
                  "#4CAF50",
                  "#2196F3",
                  "#9C27B0",
                ][i % 5],
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated stars */}
      <div className="absolute w-6 h-6 text-yellow-400 opacity-75 -top-2 -left-2 animate-ping">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="absolute w-5 h-5 text-orange-400 delay-300 -top-1 -right-1 animate-bounce">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <div className="relative z-10 flex items-start">
        <div className="flex-shrink-0 ">
          {eventType === RewardEventType.DAILY_LOGIN && (
            <svg
              className="w-8 h-8 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {eventType === RewardEventType.REGISTRATION && (
            <svg
              className="w-8 h-8 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          )}
          {eventType === RewardEventType.PROFILE_COMPLETION && (
            <svg
              className="w-8 h-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          )}
          {eventType === RewardEventType.LIKE_POST && (
            <img src="/assets/like.png" alt="Like reward" className="w-8 h-8" />
          )}
          {eventType === RewardEventType.LOVE_POST && (
            <img src="/assets/love.png" alt="Love reward" className="w-8 h-8" />
          )}
          {eventType === RewardEventType.COMMENT_POST && (
            <svg
              className="w-8 h-8 text-purple-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
          {(eventType === RewardEventType.SHARE_POST ||
            eventType === RewardEventType.SHARE_PRODUCT) && (
            <img
              src="/assets/share.png"
              alt="Like reward"
              className="w-8 h-8"
            />
          )}
          {(eventType === RewardEventType.JOIN_GROUP ||
            eventType === RewardEventType.FOLLOW_USER) && (
            <svg
              className="w-8 h-8 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          )}
          {(eventType === RewardEventType.PURCHASE_PRODUCT ||
            eventType === RewardEventType.BOOK_SESSION) && (
            <svg
              className="w-8 h-8 text-yellow-400"
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
          )}
          {eventType === RewardEventType.APPLY_JOB && (
            <svg
              className="w-8 h-8 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          )}
          {(eventType === RewardEventType.LISTEN_AUDIO_COMIC ||
            eventType === RewardEventType.LISTEN_PODCAST) && (
            <svg
              className="w-8 h-8 text-pink-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828a1 1 0 01-1.414 0l-.707-.707a1 1 0 010-1.414l2.828-2.828m0 0a9 9 0 010-12.728m11.314 0l2.828 2.828a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414 0L15.536 8.464"
              />
            </svg>
          )}
          {eventType === RewardEventType.READ_COMIC && (
            <svg
              className="w-8 h-8 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          )}
          {eventType === RewardEventType.SAVED_POST && (
            <svg
              className="w-8 h-8 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          )}
          {eventType === RewardEventType.REDEEM_POINTS && (
            <svg
              className="w-8 h-8 text-purple-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 w-0 ml-3">
          <p className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
            <span className="mr-1 text-lg animate-pulse">
              +{getPointsForEvent()}
            </span>
            <span>Points Earned!</span>
            <span className="inline-block ml-1 animate-bounce">🎉</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-orange-400 te">
            {getRewardEventLabel(eventType)}
          </p>
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-xs font-semibold">
              <span>Total: {totalPoints} points</span>
              <span className="capitalize">{currentTier} tier</span>
            </div>
            {pointsToNextTier > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                <div
                  className="bg-orange-500 h-2.5 rounded-full relative"
                  style={{
                    width: `${
                      currentTier === "bronze"
                        ? (totalPoints / 500) * 100
                        : currentTier === "silver"
                        ? (totalPoints / 1500) * 100
                        : 100
                    }%`,
                  }}
                >
                  <div className="absolute top-0 right-0 w-2 h-full bg-white opacity-75 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 ml-4 text-orange-400 hover:text-orange-500"
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-5 h-5"
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

      {/* CSS for confetti animation */}
      <style>{`
        .confetti-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.7;
          animation: fall 3s linear infinite;
        }
        .confetti-0 { transform: rotate(15deg); }
        .confetti-1 { transform: rotate(30deg); }
        .confetti-2 { transform: rotate(45deg); }
        .confetti-3 { transform: rotate(60deg); }
        .confetti-4 { transform: rotate(75deg); }
        
        @keyframes fall {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateX(20px) rotate(180deg);
            opacity: 0.5;
          }
          100% {
            top: 100%;
            transform: translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default RewardNotification;
