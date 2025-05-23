import { RewardTier } from "@/types/rewards";
import React from "react";
import { FaCrown, FaMedal, FaStar } from "react-icons/fa";

interface RewardBadgeProps {
  tier: RewardTier;
  size?: "sm" | "md" | "lg";
}

const RewardBadge: React.FC<RewardBadgeProps> = ({
  tier,
  size = "md",
}) => {
  // Define size classes
  const sizeClasses = {
    sm: {
      badge: "h-6 w-6",
      icon: "text-xs",
    },
    md: {
      badge: "h-8 w-8",
      icon: "text-sm",
    },
    lg: {
      badge: "h-10 w-10",
      icon: "text-base",
    },
  };

  // Define tier-specific styling
  const tierStyle = {
    [RewardTier.BRONZE]: {
      bg: "bg-amber-700",
      icon: <FaMedal />,
      label: "Bronze",
    },
    [RewardTier.SILVER]: {
      bg: "bg-gray-400",
      icon: <FaStar />,
      label: "Silver",
    },
    [RewardTier.GOLD]: {
      bg: "bg-yellow-500",
      icon: <FaCrown />,
      label: "Gold",
    },
  };

  return (
    <div className={`relative group`}>
      <div
        className={`${sizeClasses[size].badge} ${tierStyle[tier].bg} rounded-full flex items-center justify-center text-white`}
        title={`${tierStyle[tier].label} Tier`}
      >
        <span className={sizeClasses[size].icon}>{tierStyle[tier].icon}</span>
      </div>
      <div className="absolute px-2 py-1 mt-1 text-xs text-white transition-opacity duration-200 transform -translate-x-1/2 bg-gray-800 rounded opacity-0 pointer-events-none top-full left-1/2 group-hover:opacity-100 whitespace-nowrap">
        {tierStyle[tier].label} Tier
      </div>
    </div>
  );
};

export default RewardBadge; 