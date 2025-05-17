import RewardNotification from "@/components/rewards/RewardNotification";
import { RewardEventType } from "@/types/rewards";
import React, { createContext, useContext, useState } from "react";

interface RewardsContextType {
  showRewardNotification: (eventType: RewardEventType) => void;
}

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const useRewardsContext = () => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error("useRewardsContext must be used within a RewardsProvider");
  }
  return context;
};

interface RewardsProviderProps {
  children: React.ReactNode;
}

export const RewardsProvider: React.FC<RewardsProviderProps> = ({
  children,
}) => {
  const [notification, setNotification] = useState<RewardEventType | null>(
    null
  );

  const showRewardNotification = (eventType: RewardEventType) => {
    setNotification(eventType);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const value = {
    showRewardNotification,
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
      {notification && (
        <RewardNotification
          eventType={notification}
          onClose={handleCloseNotification}
        />
      )}
    </RewardsContext.Provider>
  );
};
