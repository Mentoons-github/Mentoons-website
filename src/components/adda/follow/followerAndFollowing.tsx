import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";
import { UserSummary } from "@/types";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { AxiosError } from "axios";

interface FollowSectionProps {
  userId: string;
}

const FollowSection: React.FC<FollowSectionProps> = ({ userId }) => {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const [followers, setFollowers] = useState<UserSummary[]>([]);
  const [following, setFollowing] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchFollowData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("No token found");
        }

        const followersResponse = await axiosInstance.get(
          `/adda/getFollowers/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowers(followersResponse.data.data || []);

        const followingResponse = await axiosInstance.get(
          `/adda/getFollowing/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFollowing(followingResponse.data.data || []);

        // Initialize follow status for each user
        const initialFollowStatus: { [key: string]: boolean } = {};
        followersResponse.data.data.forEach((user: UserSummary) => {
          initialFollowStatus[user._id] = followingResponse.data.data.some(
            (f: UserSummary) => f._id === user._id
          );
        });
        followingResponse.data.data.forEach((user: UserSummary) => {
          initialFollowStatus[user._id] = true; // Users in following are followed
        });
        setFollowStatus(initialFollowStatus);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching follow data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load follow data"
        );
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchFollowData();
    } else {
      setError("User ID is required");
      setIsLoading(false);
    }
  }, [userId, getToken]);

  const handleFollowAction = async (
    targetUserId: string,
    isFollowing: boolean
  ) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const endpoint = isFollowing
        ? `/adda/unfollow/${targetUserId}`
        : `/adda/follow/${targetUserId}`;

      const response = await axiosInstance.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setFollowStatus((prev) => ({
          ...prev,
          [targetUserId]: !isFollowing,
        }));
        successToast(isFollowing ? "Unfollowed user" : "Followed user");
        // Update following list if unfollowed
        if (isFollowing) {
          setFollowing((prev) =>
            prev.filter((user) => user._id !== targetUserId)
          );
        } else {
          // Optionally fetch user data to add to following list
          const userResponse = await axiosInstance.get(
            `/user/${targetUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setFollowing((prev) => [...prev, userResponse.data.data]);
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToast(error?.response?.data.error || "Request failed");
      } else {
        errorToast(isFollowing ? "Failed to unfollow" : "Failed to follow");
      }
    }
  };

  const renderUserList = (users: UserSummary[]) => (
    <div className="grid gap-3 sm:gap-4">
      {users.length === 0 ? (
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          No {activeTab === "followers" ? "followers" : "following"} yet
        </p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-2 sm:gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserPlus size={16} className="text-gray-400" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                {user.name || "Unnamed User"}
              </span>
            </div>
            <button
              onClick={() =>
                handleFollowAction(user._id, followStatus[user._id] || false)
              }
              disabled={isLoading}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                followStatus[user._id]
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-blue-50 text-blue-600 hover:bg-blue-100"
              }`}
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : followStatus[user._id] ? (
                <>
                  <UserMinus size={14} />
                  <span>Unfollow</span>
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        ))
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex justify-center">
          <Loader2 size={24} className="animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <p className="text-xs sm:text-sm text-red-600 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden w-full">
      <div className="flex border-b border-gray-100">
        <button
          className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium ${
            activeTab === "followers"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers ({followers.length})
        </button>
        <button
          className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium ${
            activeTab === "following"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following ({following.length})
        </button>
      </div>
      <div className="p-3 sm:p-4">
        {activeTab === "followers"
          ? renderUserList(followers)
          : renderUserList(following)}
      </div>
    </div>
  );
};

export default FollowSection;
