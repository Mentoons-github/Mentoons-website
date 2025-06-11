import axiosInstance from "@/api/axios";
import UserListModal from "@/components/common/modal/userList";
import { User } from "@/types";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import {
  Calendar,
  Check,
  Clock,
  Loader2,
  User as UserIcon,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface ProfileHeaderProps {
  user: User;
  totalPosts: number;
  totalFollowing: string[];
  totalFollowers: string[];
  isCurrentUser: boolean;
}

type FriendStatus = "pending" | "accepted" | "rejected" | "one_way" | "none";

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  totalPosts,
  totalFollowing,
  totalFollowers,
  isCurrentUser,
}) => {
  const { getToken } = useAuth();
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(!isCurrentUser);
  const [isRequester, setIsRequester] = useState(false);
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null
  );
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  useEffect(() => {
    if (isCurrentUser) {
      setIsStatusLoading(false);
      return;
    }

    const checkFriendStatus = async () => {
      try {
        const token = await getToken();
        const response = await axiosInstance.get(
          `/adda/check-friend-status/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const { status, isRequester, requestId } = response.data.data;
        setFriendStatus(status || "none");
        setIsRequester(isRequester || false);
        setRequestId(requestId);
      } catch (error) {
        setFriendStatus("none");
      } finally {
        setIsStatusLoading(false);
      }
    };

    checkFriendStatus();
  }, [user._id, getToken, isCurrentUser]);

  const formatDate = (dateString?: Date | string): string => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFriendAction = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const endpoint =
        friendStatus === "accepted" || friendStatus === "one_way"
          ? `/adda/unfriend/${user._id}`
          : friendStatus === "pending" && isRequester
          ? `/adda/cancelRequest/${user._id}`
          : friendStatus === "pending"
          ? `/adda/rejectRequest/${requestId}`
          : `/adda/request/${user._id}`;
      const method =
        friendStatus === "pending" && !isRequester ? "patch" : "post";

      const response = await axiosInstance({
        method,
        url: endpoint,
        headers: { Authorization: `Bearer ${token}` },
      });

      setFriendStatus(
        response.data.status ||
          (friendStatus === "accepted" || friendStatus === "one_way"
            ? "none"
            : friendStatus === "pending" && isRequester
            ? "none"
            : friendStatus === "pending"
            ? "rejected"
            : "pending")
      );
      setIsRequester(
        response.data.isRequester ||
          friendStatus === "none" ||
          friendStatus === "rejected"
      );
      successToast(response.data.message || "Friend status updated");
    } catch (error) {
      errorToast("Friend action failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      await axiosInstance.patch(
        `/adda/acceptRequest/${requestId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFriendStatus("accepted");
      successToast("Friend request accepted");
    } catch (error) {
      errorToast("Failed to accept friend request");
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendButtonConfig = () => {
    if (!friendStatus) return null;

    const configs: Record<
      FriendStatus,
      { text: string; icon: JSX.Element; classes: string; action?: () => void }
    > = {
      accepted: {
        text: "Unfriend",
        icon: <UserMinus size={14} />,
        classes: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-200",
        action: handleFriendAction,
      },
      pending: isRequester
        ? {
            text: "Cancel Request",
            icon: <X size={14} />,
            classes:
              "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-200",
            action: handleFriendAction,
          }
        : {
            text: "Respond to Request",
            icon: <Clock size={14} />,
            classes:
              "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-200",
          },
      rejected: {
        text: "Send Request",
        icon: <UserPlus size={14} />,
        classes:
          "bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-blue-200",
        action: handleFriendAction,
      },
      one_way: {
        text: "Unfriend",
        icon: <UserMinus size={14} />,
        classes:
          "bg-purple-50 text-purple-600 hover:bg-purple-100 focus:ring-purple-200",
        action: handleFriendAction,
      },
      none: {
        text: "Add Friend",
        icon: <UserPlus size={14} />,
        classes:
          "bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-blue-200",
        action: handleFriendAction,
      },
    };

    return configs[friendStatus];
  };

  const buttonConfig = getFriendButtonConfig();

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowPhotoModal(false);
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showPhotoModal) {
        setShowPhotoModal(false);
      }
    };

    if (showPhotoModal) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [showPhotoModal]);

  return (
    <>
      <style>
        {`
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes imagePop {
            from {
              transform: scale(0.8);
              opacity: 0.5;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-modal {
            animation: fadeInScale 0.3s ease-out forwards;
          }
          .animate-image {
            animation: imagePop 0.4s ease-out forwards;
          }
        `}
      </style>

      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-20 sm:h-24 md:h-28 lg:h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 relative">
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>

        <div className="relative px-2 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-3 sm:mb-6 -mt-8 sm:-mt-12">
            <div className="relative mb-3 sm:mb-0 self-center sm:self-auto">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-cover rounded-full border-3 sm:border-4 border-white shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  onClick={() => setShowPhotoModal(true)}
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
              ) : (
                <div
                  className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center rounded-full border-3 sm:border-4 border-white shadow-xl cursor-pointer bg-gradient-to-br from-gray-200 to-gray-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  onClick={() => setShowPhotoModal(true)}
                >
                  <span className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-500">
                    {user.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <UserIcon
                        size={20}
                        className="sm:w-6 sm:h-6 text-gray-500"
                      />
                    )}
                  </span>
                </div>
              )}

              {user.subscription?.plan && user.subscription.plan !== "free" && (
                <div className="absolute -top-0.5 -right-0.5 sm:-top-2 sm:-right-2 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold text-white bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-md">
                  {user.subscription.plan.toUpperCase()}
                </div>
              )}
            </div>
            {!isCurrentUser && (
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end">
                {isStatusLoading ? (
                  <div className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 rounded-full bg-gray-50 border border-gray-200">
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Loading...
                  </div>
                ) : friendStatus === "pending" && !isRequester ? (
                  <>
                    <button
                      onClick={handleAcceptRequest}
                      disabled={isLoading}
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-green-600 rounded-full bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 border border-green-200 font-medium min-w-[60px] sm:min-w-auto"
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Accept</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleFriendAction}
                      disabled={isLoading}
                      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-red-600 rounded-full bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 border border-red-200 font-medium min-w-[60px] sm:min-w-auto"
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Reject</span>
                        </>
                      )}
                    </button>
                  </>
                ) : buttonConfig?.action ? (
                  <button
                    onClick={buttonConfig.action}
                    disabled={isLoading}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-200 focus:outline-none focus:ring-2 border font-medium min-w-[80px] sm:min-w-auto ${buttonConfig.classes}`}
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        {buttonConfig.icon}
                        <span className="hidden sm:inline">
                          {buttonConfig.text}
                        </span>
                        <span className="sm:hidden text-xs">
                          {friendStatus === "accepted" ||
                          friendStatus === "one_way"
                            ? "Remove"
                            : friendStatus === "pending"
                            ? "Cancel"
                            : "Add"}
                        </span>
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            )}
          </div>
          <div className="space-y-3 sm:space-y-4">
  
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 text-center sm:text-left">
                {user.name || "Unnamed User"}
              </h1>
              <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-500">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Joined {formatDate(user.joinedDate)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:gap-4 py-2 sm:py-4 border-t border-b border-gray-100">
              <button
                onClick={() => setModalType("followers")}
                className="group text-center p-1 sm:p-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
              >
                <div className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {totalFollowers.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Followers
                </div>
              </button>

              <button
                onClick={() => setModalType("following")}
                className="group text-center p-1 sm:p-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
              >
                <div className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {totalFollowing.length}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  Following
                </div>
              </button>

              <div className="text-center p-1 sm:p-2">
                <div className="text-sm sm:text-lg md:text-xl font-bold text-gray-900">
                  {totalPosts}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Posts</div>
              </div>
            </div>

            {user.bio && (
              <div className="bg-gray-50 rounded-lg p-2 sm:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  About
                </h3>
                <p className="text-xs sm:text-base text-gray-800 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {user.interests?.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-3">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-blue-700 bg-blue-50 rounded-full border border-blue-200 font-medium hover:bg-blue-100 transition-colors"
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
      {modalType && (
        <UserListModal
          userIds={modalType === "followers" ? totalFollowers : totalFollowing}
          title={modalType === "followers" ? "Followers" : "Following"}
          setShowModal={() => setModalType(null)}
        />
      )}
      {showPhotoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute z-10 p-2 sm:p-3 text-gray-600 transition-all duration-200 bg-white rounded-full shadow-xl -top-3 -right-3 sm:-top-4 sm:-right-4 hover:text-gray-800 hover:bg-gray-100 hover:scale-110"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="w-[80vw] h-[80vw] max-w-[280px] max-h-[280px] sm:w-[70vw] sm:h-[70vw] sm:max-w-[400px] sm:max-h-[400px] md:max-w-[500px] md:max-h-[500px] lg:max-w-[600px] lg:max-h-[600px] rounded-full overflow-hidden shadow-2xl animate-modal">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="object-cover w-full h-full animate-image"
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-image">
                  <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-500">
                    {user.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <UserIcon className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 text-gray-500" />
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileHeader;
