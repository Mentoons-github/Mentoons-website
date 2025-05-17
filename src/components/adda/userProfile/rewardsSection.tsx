import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { fetchUserRewards } from '@/redux/rewardSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { FiAward, FiClock, FiStar, FiTrendingUp } from 'react-icons/fi';
import { FaRegGem, FaMedal, FaTrophy } from 'react-icons/fa';
import { RewardTier, PointTransaction } from '@/types/rewards';

const RewardsSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    totalPoints, 
    currentTier, 
    pointsToNextTier, 
    transactions,
    loading,
    error
  } = useSelector((state: RootState) => state.rewards);

  useEffect(() => {
    const loadRewards = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        // We need to pass token to the thunk
        if (token) {
          await dispatch(fetchUserRewards({ token }));
        }
      } catch (error) {
        console.error('Error loading rewards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRewards();
  }, [dispatch, getToken]);

  // Function to get tier icon
  const getTierIcon = (tier: RewardTier) => {
    switch (tier) {
      case RewardTier.BRONZE:
        return <FaMedal className="text-amber-700 w-8 h-8" />;
      case RewardTier.SILVER:
        return <FaMedal className="text-gray-400 w-8 h-8" />;
      case RewardTier.GOLD:
        return <FaTrophy className="text-yellow-400 w-8 h-8" />;
      default:
        return <FaRegGem className="text-blue-500 w-8 h-8" />;
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Error Loading Rewards</h3>
        <p>{error}</p>
        <p className="mt-2 text-sm">Please try refreshing the page or contact support if the issue persists.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rewards Overview Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <FiAward className="mr-2 text-orange-500" /> Rewards Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Points */}
          <div className="bg-orange-50 rounded-lg p-4 flex items-center">
            <div className="mr-4 bg-orange-100 p-3 rounded-full">
              <FiStar className="text-orange-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-800">{totalPoints}</p>
            </div>
          </div>
          
          {/* Current Tier */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-center">
            <div className="mr-4 bg-blue-100 p-3 rounded-full">
              {getTierIcon(currentTier)}
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Tier</p>
              <p className="text-2xl font-bold text-gray-800 capitalize">{currentTier.toLowerCase()}</p>
            </div>
          </div>
          
          {/* Points to Next Tier */}
          <div className="bg-green-50 rounded-lg p-4 flex items-center">
            <div className="mr-4 bg-green-100 p-3 rounded-full">
              <FiTrendingUp className="text-green-500 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Points to Next Tier</p>
              {currentTier !== RewardTier.GOLD ? (
                <p className="text-2xl font-bold text-gray-800">{pointsToNextTier}</p>
              ) : (
                <p className="text-lg font-medium text-gray-800">Max Tier Reached!</p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <p className="text-sm text-gray-600">Progress to Next Tier</p>
            {currentTier !== RewardTier.GOLD && (
              <p className="text-sm text-gray-600">
                {totalPoints} / {totalPoints + pointsToNextTier}
              </p>
            )}
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            {currentTier === RewardTier.GOLD ? (
              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 w-full"></div>
            ) : (
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600" 
                style={{ 
                  width: `${(totalPoints / (totalPoints + pointsToNextTier)) * 100}%` 
                }}
              ></div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <FiClock className="mr-2 text-orange-500" /> Recent Reward Activities
        </h2>
        
        {transactions && transactions.length > 0 ? (
          <div className="overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {transactions.slice(0, 10).map((transaction: PointTransaction) => (
                <li key={transaction._id} className="py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-orange-100 p-2 rounded-full">
                      <FiAward className="text-orange-500" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      +{transaction.points} points
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {transactions.length > 10 && (
              <div className="mt-4 text-center">
                <button className="text-sm text-orange-500 hover:text-orange-600">
                  View all activities
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No reward activities yet. Start engaging with the platform to earn points!</p>
          </div>
        )}
      </div>

      {/* How to Earn More Points */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">How to Earn More Points</h2>
        
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="bg-orange-100 p-1 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <FiStar className="text-orange-500 w-4 h-4" />
            </span>
            <div>
              <p className="font-medium text-gray-800">Daily Login</p>
              <p className="text-gray-600 text-sm">Earn 5 points each day you log in</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-orange-100 p-1 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <FiStar className="text-orange-500 w-4 h-4" />
            </span>
            <div>
              <p className="font-medium text-gray-800">Engagement</p>
              <p className="text-gray-600 text-sm">Earn 2 points for each like, 5 points for comments, and 10 points for shares</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-orange-100 p-1 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <FiStar className="text-orange-500 w-4 h-4" />
            </span>
            <div>
              <p className="font-medium text-gray-800">Profile Completion</p>
              <p className="text-gray-600 text-sm">Earn 100 points for completing your profile</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-orange-100 p-1 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <FiStar className="text-orange-500 w-4 h-4" />
            </span>
            <div>
              <p className="font-medium text-gray-800">Content Creation</p>
              <p className="text-gray-600 text-sm">Earn 8 points for creating a status update</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RewardsSection; 