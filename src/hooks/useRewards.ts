import { fetchUserRewards } from "@/redux/rewardSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { RewardTier } from "@/types/rewards";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Tier configuration with benefits
export const TIER_CONFIG = {
  [RewardTier.BRONZE]: {
    minPoints: 0,
    maxPoints: 499,
    benefits: [
      "Basic access to platform features",
      "Participation in community events",
      "Unlock basic stickers and badges",
    ],
  },
  [RewardTier.SILVER]: {
    minPoints: 500,
    maxPoints: 1499,
    benefits: [
      "All Bronze benefits",
      "Early access to new content",
      "50% off on digital products",
      "Custom profile features",
    ],
  },
  [RewardTier.GOLD]: {
    minPoints: 1500,
    maxPoints: Infinity,
    benefits: [
      "All Silver benefits",
      "Priority support",
      "Exclusive content access",
      "Free monthly digital product",
      "Special badges and recognition",
    ],
  },
};

export const useRewards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();

  // Define default values for when the rewards slice is not yet added to state
  const defaultRewardsState = {
    totalPoints: 0,
    currentTier: RewardTier.BRONZE,
    pointsToNextTier: TIER_CONFIG[RewardTier.SILVER].minPoints,
    transactions: [],
    availableRewards: [],
    loading: false,
    error: null,
  };

  const {
    totalPoints,
    currentTier,
    pointsToNextTier,
    transactions,
    availableRewards,
    loading,
    error,
  } = useSelector((state: RootState) =>
    // Use a safe check to see if rewards exists in state
    "rewards" in state ? state.rewards : defaultRewardsState
  );

  // Fetch user rewards on component mount
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const token = await getToken();
        if (token) {
          dispatch(fetchUserRewards({ token }));
        }
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };

    fetchRewards();
  }, [dispatch, getToken]);

  // Calculate progress percentage to next tier
  const getProgressToNextTier = (): number => {
    if (currentTier === RewardTier.GOLD) return 100;

    const currentTierMin = TIER_CONFIG[currentTier].minPoints;
    const nextTierMin =
      currentTier === RewardTier.BRONZE
        ? TIER_CONFIG[RewardTier.SILVER].minPoints
        : TIER_CONFIG[RewardTier.GOLD].minPoints;

    const pointsInCurrentTier = totalPoints - currentTierMin;
    const pointsRequiredForNextTier = nextTierMin - currentTierMin;

    return Math.min(
      Math.round((pointsInCurrentTier / pointsRequiredForNextTier) * 100),
      100
    );
  };

  // Check if user can redeem a reward
  const canRedeemReward = (pointsRequired: number): boolean => {
    return totalPoints >= pointsRequired;
  };

  // Redeem a reward
  const redeem = async (rewardId: string) => {
    // This would call an API to redeem the reward
    console.log(`Redeeming reward ${rewardId}`);
    // This is where you'd implement the redemption logic
    alert("Reward redemption feature will be implemented in the next update");
  };

  // Get benefits for a specific tier
  const getBenefitsForTier = (tier: RewardTier): string[] => {
    return TIER_CONFIG[tier].benefits;
  };

  return {
    totalPoints,
    currentTier,
    pointsToNextTier,
    transactions,
    availableRewards,
    loading,
    error,
    getProgressToNextTier,
    canRedeemReward,
    redeem,
    TIER_CONFIG,
    getBenefitsForTier,
  };
};
