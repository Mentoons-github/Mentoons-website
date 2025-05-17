import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRewards } from "@/hooks/useRewards";
import { RewardTier } from "@/types/rewards";
import React from "react";
import { FaCrown, FaGift } from "react-icons/fa";
import { FiAward } from "react-icons/fi";
import RewardBadge from "./RewardBadge";
import RewardProgressBar from "./RewardProgressBar";

interface RewardsDashboardProps {
  className?: string;
}

const RewardsDashboard: React.FC<RewardsDashboardProps> = ({ className }) => {
  const {
    totalPoints,
    currentTier,
    transactions,
    availableRewards,
    redeem,
    canRedeemReward,
    TIER_CONFIG,
    getBenefitsForTier,
  } = useRewards();

  return (
    <Card
      className={`p-4 border border-orange-200 shadow-lg shadow-orange-100/80 rounded-xl ${className}`}
    >
      <h3 className="mb-4 text-xl font-semibold text-gray-800">
        Your Reward Points
      </h3>

      {/* Points Overview */}
      <div className="p-4 mb-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-16 w-16 rounded-full bg-[#EC9600] flex items-center justify-center mr-4">
              <FaCrown className="text-3xl text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-3xl font-bold text-gray-800">
                {totalPoints.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="mb-1 text-sm text-gray-600">Current Level</p>
            <div className="flex items-center">
              <RewardBadge tier={currentTier} size="md" />
            </div>
            <div className="mt-2 w-full max-w-[200px]">
              <RewardProgressBar />
            </div>
          </div>
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="mb-6">
        <h4 className="mb-3 text-lg font-semibold text-gray-800">
          Reward Tiers
        </h4>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="p-3 border border-orange-100 rounded-lg bg-orange-50">
            <div className="flex items-center mb-2">
              <RewardBadge tier={RewardTier.BRONZE} size="sm" />
              <p className="ml-2 font-medium text-gray-800">Bronze</p>
            </div>
            <p className="text-sm text-gray-600">
              {TIER_CONFIG[RewardTier.BRONZE].minPoints} -{" "}
              {TIER_CONFIG[RewardTier.BRONZE].maxPoints} points
            </p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {getBenefitsForTier(RewardTier.BRONZE).map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-1">•</span> {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`p-3 border border-orange-100 rounded-lg ${
              currentTier === RewardTier.SILVER
                ? "bg-gradient-to-r from-gray-100 to-gray-200"
                : "bg-gray-50"
            }`}
          >
            <div className="flex items-center mb-2">
              <RewardBadge tier={RewardTier.SILVER} size="sm" />
              <p className="ml-2 font-medium text-gray-800">
                Silver {currentTier === RewardTier.SILVER && "(Current)"}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              {TIER_CONFIG[RewardTier.SILVER].minPoints} -{" "}
              {TIER_CONFIG[RewardTier.SILVER].maxPoints} points
            </p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {getBenefitsForTier(RewardTier.SILVER).map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-1">•</span> {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`p-3 border border-orange-100 rounded-lg ${
              currentTier === RewardTier.GOLD
                ? "bg-gradient-to-r from-yellow-50 to-amber-100"
                : "bg-amber-50"
            }`}
          >
            <div className="flex items-center mb-2">
              <RewardBadge tier={RewardTier.GOLD} size="sm" />
              <p className="ml-2 font-medium text-gray-800">
                Gold {currentTier === RewardTier.GOLD && "(Current)"}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              {TIER_CONFIG[RewardTier.GOLD].minPoints}+ points
            </p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {getBenefitsForTier(RewardTier.GOLD).map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span className="mr-1">•</span> {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      {availableRewards && availableRewards.length > 0 && (
        <div className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-800">
            Available Rewards
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {availableRewards.map((reward) => (
              <div
                key={reward.id}
                className="overflow-hidden border border-orange-100 rounded-lg"
              >
                <div className="flex items-center justify-center h-32 bg-orange-100">
                  {reward.imageUrl ? (
                    <img
                      src={reward.imageUrl}
                      alt={reward.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaGift className="text-[#EC9600] text-4xl" />
                  )}
                </div>
                <div className="p-3">
                  <h5 className="font-medium text-gray-800">{reward.name}</h5>
                  <p className="text-xs text-gray-600 mt-1 mb-2">
                    {reward.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-600">
                      {reward.pointsRequired} points
                    </p>
                    <Button
                      size="sm"
                      className={`text-xs ${
                        canRedeemReward(reward.pointsRequired)
                          ? "bg-[#EC9600] hover:bg-[#EC9600]/90"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      disabled={!canRedeemReward(reward.pointsRequired)}
                      onClick={() => redeem(reward.id)}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Points History */}
      <div>
        <h4 className="mb-3 text-lg font-semibold text-gray-800">
          Points History
        </h4>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">
              No point transactions yet.
            </p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-3 border border-orange-100 rounded-lg hover:bg-orange-50"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 bg-orange-100 rounded-full">
                    <FiAward className="text-[#EC9600]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.description || transaction.eventType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-[#EC9600]">
                  +{transaction.points}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};

export default RewardsDashboard;
