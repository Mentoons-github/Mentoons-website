import React, { useState, useEffect } from "react";
import { User } from "@/types";
import {
  Calendar,
  User as UserIcon,
  UserPlus,
  UserMinus,
  Clock,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import axiosInstance from "@/api/axios";
import { AxiosError } from "axios";
import { errorToast, successToast } from "@/utils/toastResposnse";

interface ProfileHeaderProps {
  user: User;
  totalPosts: number;
  totalFollowing: number;
  isCurrentUser: boolean;
}

type FriendStatus = "pending" | "accepted" | "rejected" | "one_way" | "none";

interface FriendStatusResponse {
  status: FriendStatus;
  isRequester: boolean;
  requestId?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  totalPosts,
  totalFollowing,
  isCurrentUser,
}) => {
  const { getToken } = useAuth();
  const [friendStatus, setFriendStatus] = useState<FriendStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [isRequester, setIsRequester] = useState(false);
  const [requestId, setRequestId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkFriendStatus = async () => {
      setIsStatusLoading(true);
      try {
        const token = await getToken();
        const response = await axiosInstance.get(
          `/adda/check-friend-status/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Friend status response:", response.data);

        const statusData: FriendStatusResponse = response.data.data;
        setFriendStatus(statusData.status || "none");
        setIsRequester(statusData.isRequester || false);
        setRequestId(statusData.requestId);
      } catch (error) {
        console.error("Failed to fetch friend status:", error);
        setFriendStatus("none");
      } finally {
        setIsStatusLoading(false);
      }
    };

    if (!isCurrentUser) {
      checkFriendStatus();
    } else {
      setIsStatusLoading(false);
    }
  }, [user._id, getToken, isCurrentUser]);

  const formatDate = (dateString: Date | string | undefined): string => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFriendAction = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();

      let endpoint;
      switch (friendStatus) {
        case "accepted":
          endpoint = `/adda/unfriend/${user._id}`;
          break;
        case "pending":
          endpoint = isRequester
            ? `/adda/cancelRequest/${user._id}`
            : `/adda/rejectRequest/${requestId}`;
          break;
        case "rejected":
          endpoint = `/adda/request/${user._id}`;
          break;
        case "one_way":
          endpoint = `/adda/unfriend/${user._id}`;
          break;
        case "none":
        default:
          endpoint = `/adda/request/${user._id}`;
          break;
      }

      const method =
        friendStatus === "pending" && !isRequester ? "patch" : "post";

      const response = await (method === "patch"
        ? axiosInstance.patch(
            endpoint,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        : axiosInstance.post(
            endpoint,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ));

      if (response.data.status) {
        setFriendStatus(response.data.status);
        if (response.data.isRequester !== undefined) {
          setIsRequester(response.data.isRequester);
        }
        successToast(response.data.message || "Friend status updated");
      } else {
        if (friendStatus === "accepted" || friendStatus === "one_way") {
          setFriendStatus("none");
        } else if (friendStatus === "pending" && isRequester) {
          setFriendStatus("none");
        } else if (friendStatus === "pending" && !isRequester) {
          setFriendStatus("rejected");
        } else {
          setFriendStatus("pending");
          setIsRequester(true);
        }
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToast(error?.response?.data.error || "Request failed");
      } else {
        errorToast("Friend action failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axiosInstance.patch(
        `/adda/acceptRequest/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response);

      setFriendStatus("accepted");
      successToast("Friend request accepted");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        errorToast(error?.response?.data.error || "Request failed");
      } else {
        errorToast("Failed to accept friend request");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendButtonConfig = () => {
    console.log(
      "Current friendStatus:",
      friendStatus,
      "isRequester:",
      isRequester,
      "requestId:",
      requestId
    );

    if (!friendStatus) return null;

    switch (friendStatus) {
      case "accepted":
        return {
          text: "Unfriend",
          icon: <UserMinus size={14} />,
          classes: "bg-red-50 text-red-600 hover:bg-red-100",
          action: handleFriendAction,
        };
      case "pending":
        if (isRequester) {
          return {
            text: "Cancel Request",
            icon: <X size={14} />,
            classes: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
            action: handleFriendAction,
          };
        } else {
          return {
            text: "Respond to Request",
            icon: <Clock size={14} />,
            classes: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
            action: null,
          };
        }
      case "rejected":
        return {
          text: "Send Request",
          icon: <UserPlus size={14} />,
          classes: "bg-blue-50 text-blue-600 hover:bg-blue-100",
          action: handleFriendAction,
        };
      case "one_way":
        return {
          text: "Unfriend",
          icon: <UserMinus size={14} />,
          classes: "bg-purple-50 text-purple-600 hover:bg-purple-100",
          action: handleFriendAction,
        };
      case "none":
      default:
        return {
          text: "Add Friend",
          icon: <UserPlus size={14} />,
          classes: "bg-blue-50 text-blue-600 hover:bg-blue-100",
          action: handleFriendAction,
        };
    }
  };

  const buttonConfig = getFriendButtonConfig();
  console.log(buttonConfig);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-4 w-full">
      <div className="h-20 sm:h-24 md:h-40 bg-gradient-to-r from-blue-100 to-purple-100"></div>

      <div className="px-2 sm:px-4 md:px-6 pb-4 sm:pb-6 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-10 sm:-mt-12 md:-mt-16 mb-3 sm:mb-4">
          <div className="relative">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name || "User"}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                <UserIcon size={24} className="text-gray-400" />
              </div>
            )}
            {user.subscription?.plan && user.subscription.plan !== "free" && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                {user.subscription.plan}
              </div>
            )}
          </div>

          {!isCurrentUser && (
            <div className="flex gap-1 sm:gap-2 mt-2 sm:mt-0">
              {isStatusLoading ? (
                <div className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors bg-gray-50 text-gray-600">
                  <Loader2 size={14} className="animate-spin mr-1 sm:mr-2" />
                  <span>Loading...</span>
                </div>
              ) : friendStatus === "pending" && !isRequester ? (
                <>
                  <button
                    onClick={handleAcceptRequest}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={14} />
                        <span>Accept</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleFriendAction}
                    disabled={isLoading}
                    className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        <X size={14} />
                        <span>Reject</span>
                      </>
                    )}
                  </button>
                </>
              ) : buttonConfig?.action ? (
                <button
                  onClick={buttonConfig.action}
                  disabled={isLoading}
                  className={`flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${buttonConfig.classes}`}
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      {buttonConfig.icon}
                      <span>{buttonConfig.text}</span>
                    </>
                  )}
                </button>
              ) : null}
            </div>
          )}
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {user.name || "Unnamed User"}
            </h1>

            <div className="mt-1 flex flex-col gap-1 sm:gap-2 text-gray-500 text-xs sm:text-sm">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span>Joined {formatDate(user.joinedDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-medium">
              {user.role || "USER"}
            </div>
            <div className="bg-green-50 text-green-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-medium">
              <span>Last active: </span>
              {user.lastActive
                ? new Date(user.lastActive).toLocaleDateString()
                : "Never"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 sm:gap-2 text-center py-2 sm:py-3 border-y border-gray-100">
            <div>
              <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {totalFollowing || 0}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                Followers
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {user.following?.length || 0}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                Following
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                {totalPosts || 0}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                Posts
              </div>
            </div>
          </div>
          {user.bio && (
            <div>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">
                Bio
              </h3>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm md:text-base text-gray-900">
                {user.bio}
              </p>
            </div>
          )}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500">
                Interests
              </h3>
              <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
