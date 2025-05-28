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
        classes: "bg-red-50 text-red-600 hover:bg-red-100",
        action: handleFriendAction,
      },
      pending: isRequester
        ? {
            text: "Cancel Request",
            icon: <X size={14} />,
            classes: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
            action: handleFriendAction,
          }
        : {
            text: "Respond to Request",
            icon: <Clock size={14} />,
            classes: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
          },
      rejected: {
        text: "Send Request",
        icon: <UserPlus size={14} />,
        classes: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        action: handleFriendAction,
      },
      one_way: {
        text: "Unfriend",
        icon: <UserMinus size={14} />,
        classes: "bg-purple-50 text-purple-600 hover:bg-purple-100",
        action: handleFriendAction,
      },
      none: {
        text: "Add Friend",
        icon: <UserPlus size={14} />,
        classes: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        action: handleFriendAction,
      },
    };

    return configs[friendStatus];
  };

  const buttonConfig = getFriendButtonConfig();

  // Handle closing photo modal when clicking outside
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
      document.body.style.overflow = "hidden"; // Prevent background scroll
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
      <div className="mb-4 bg-white rounded-lg shadow">
        <div className="h-24 bg-gradient-to-r from-blue-100 to-purple-100"></div>
        <div className="relative px-4 pb-4">
          <div className="flex items-end justify-between mb-4 -mt-12">
            <div className="relative">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="object-cover w-24 h-24 transition-transform duration-200 border-4 border-white rounded-full shadow-md cursor-pointer hover:scale-105"
                  onClick={() => setShowPhotoModal(true)}
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
              ) : (
                <div
                  className="flex items-center justify-center w-24 h-24 transition-transform duration-200 border-4 border-white rounded-full shadow-md cursor-pointer bg-gradient-to-br from-gray-200 to-gray-300 hover:scale-105"
                  onClick={() => setShowPhotoModal(true)}
                >
                  <span className="text-2xl font-bold text-gray-500">
                    {user.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <UserIcon size={24} className="text-gray-500" />
                    )}
                  </span>
                </div>
              )}
              {user.subscription?.plan && user.subscription.plan !== "free" && (
                <div className="absolute px-2 py-1 text-xs text-white bg-yellow-400 rounded-full -top-2 -right-2">
                  {user.subscription.plan}
                </div>
              )}
            </div>
            {!isCurrentUser && (
              <div className="flex gap-2">
                {isStatusLoading ? (
                  <div className="flex items-center px-4 py-2 text-sm text-gray-600 rounded-full bg-gray-50">
                    <Loader2 size={14} className="mr-2 animate-spin" />{" "}
                    Loading...
                  </div>
                ) : friendStatus === "pending" && !isRequester ? (
                  <>
                    <button
                      onClick={handleAcceptRequest}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-4 py-2 text-sm text-green-600 rounded-full bg-green-50 hover:bg-green-100"
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <Check size={14} /> Accept
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleFriendAction}
                      disabled={isLoading}
                      className="flex items-center gap-1 px-4 py-2 text-sm text-red-600 rounded-full bg-red-50 hover:bg-red-100"
                    >
                      {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <X size={14} /> Reject
                        </>
                      )}
                    </button>
                  </>
                ) : buttonConfig?.action ? (
                  <button
                    onClick={buttonConfig.action}
                    disabled={isLoading}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm ${buttonConfig.classes}`}
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>
                        {buttonConfig.icon} {buttonConfig.text}
                      </>
                    )}
                  </button>
                ) : null}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">
              {user.name || "Unnamed User"}
            </h1>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> Joined{" "}
                {formatDate(user.joinedDate)}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-3 text-center border-gray-100 border-y">
              <button onClick={() => setModalType("followers")}>
                <div className="text-lg font-bold text-gray-900 hover:text-blue-600">
                  {totalFollowers.length}
                </div>
                <div className="text-xs text-gray-500">Followers</div>
              </button>
              <button onClick={() => setModalType("following")}>
                <div className="text-lg font-bold text-gray-900 hover:text-blue-600">
                  {totalFollowing.length}
                </div>
                <div className="text-xs text-gray-500">Following</div>
              </button>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {totalPosts}
                </div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
            </div>
            {user.bio && (
              <div>
                <h3 className="text-xs font-medium text-gray-500">Bio</h3>
                <p className="mt-1 text-sm text-gray-900">{user.bio}</p>
              </div>
            )}
            {user.interests?.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-500">Interests</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full"
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
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999] p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="relative">
            {/* Close button - positioned outside the image */}
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute z-10 p-2 text-gray-600 transition-colors duration-200 bg-white rounded-full shadow-lg -top-4 -right-4 hover:text-gray-800 hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            {/* Round modal container */}
            <div className="w-[80vw] h-[80vw] max-w-[400px] max-h-[400px] sm:max-w-[500px] sm:max-h-[500px] md:max-w-[600px] md:max-h-[600px] rounded-full overflow-hidden shadow-2xl animate-modal">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="object-cover w-full h-full animate-image"
                  onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-image">
                  <span className="text-5xl font-bold text-gray-500 sm:text-6xl md:text-7xl lg:text-8xl">
                    {user.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <UserIcon size={80} className="text-gray-500" />
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
