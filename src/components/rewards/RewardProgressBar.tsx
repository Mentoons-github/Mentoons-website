import { useRewards } from "@/hooks/useRewards";
import { RewardTier } from "@/types/rewards";
import React from "react";

interface RewardProgressBarProps {
  showLabel?: boolean;
}

const RewardProgressBar: React.FC<RewardProgressBarProps> = ({
  showLabel = true,
}) => {
  const { currentTier, pointsToNextTier, getProgressToNextTier } = useRewards();

  // Get next tier based on current tier
  const getNextTier = () => {
    if (currentTier === RewardTier.BRONZE) return RewardTier.SILVER;
    if (currentTier === RewardTier.SILVER) return RewardTier.GOLD;
    return null; // No next tier for GOLD
  };

  const nextTier = getNextTier();
  const progress = getProgressToNextTier();

  // Get color based on tier
  const getBarColor = () => {
    switch (currentTier) {
      case RewardTier.BRONZE:
        return "from-amber-700 to-amber-500";
      case RewardTier.SILVER:
        return "from-gray-400 to-gray-300";
      case RewardTier.GOLD:
        return "from-yellow-500 to-yellow-400";
      default:
        return "from-amber-700 to-amber-500";
    }
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">
            {currentTier === RewardTier.GOLD
              ? "Max Tier Reached"
              : `${pointsToNextTier} points to ${nextTier}`}
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor()}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default RewardProgressBar;
