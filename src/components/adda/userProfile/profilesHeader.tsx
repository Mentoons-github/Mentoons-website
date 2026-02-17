import axiosInstance from "@/api/axios";
import UserListModal from "@/components/common/modal/userList";
import { User } from "@/types";
import { errorToast, successToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import {
  Calendar,
  Check,
  Clock,
  EllipsisVertical,
  Loader2,
  User as UserIcon,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import SubscriptionModalManager, {
  AccessCheckResponse,
} from "@/components/protected/subscriptionManager";
import {
  acceptFriendRequest,
  fetchFollowBackUsers,
  fetchFriendRequests,
} from "@/redux/adda/friendRequest";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import ReportAbuseModal from "@/components/common/modal/BlockAndReportModal";
import { MdBlock, MdPersonAdd, MdReport } from "react-icons/md";

interface ProfileHeaderProps {
  user: User;
  totalPosts: number;
  totalFollowing: string[];
  totalFollowers: string[];
  isCurrentUser: boolean;
  currentUserClerkId?: string;
  reduceFollower: () => void;
  addFollowing: () => void;
  currentUserId: string;
  blockedUsers: string[];
  userId: string;
  onUnblockSuccess: () => void;
  friendBlocked: boolean;
}

type FriendStatus = "pending" | "accepted" | "rejected" | "none";

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  totalPosts,
  totalFollowing,
  totalFollowers,
  isCurrentUser,
  currentUserClerkId,
  reduceFollower,
  addFollowing,
  currentUserId,
  blockedUsers,
  userId,
  onUnblockSuccess,
  friendBlocked,
}) => {
  const { getToken } = useAuth();
  const [friendStatus, setFriendStatus] = useState<FriendStatus>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(!isCurrentUser);
  const [isRequester, setIsRequester] = useState(false);
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [receiverRequestId, setReceiverRequestId] = useState<string>("");
  const [modalType, setModalType] = useState<"followers" | "following" | null>(
    null,
  );
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [accessCheck, setAccessCheck] = useState<AccessCheckResponse | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [receiveStatus, setReceiveStatus] = useState("none");
  const [reportModal, setReportModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUserBlocked, setIsUserBlocked] = useState(
    blockedUsers?.includes(userId),
  );
  const [modalTypeBlock, setModalTypeBlock] = useState<
    "report" | "block" | "unblock"
  >("report");
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const isValidCoverImage =
    user.coverImage &&
    !user.coverImage.includes("via.placeholder.com") &&
    !friendBlocked;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (isCurrentUser) {
      setIsStatusLoading(false);
      return;
    }

    const checkFriendStatus = async (retries = 2): Promise<void> => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication token not found");

        const response = await axiosInstance.get(
          `/adda/check-friend-status/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const {
          status,
          isRequester,
          requestId,
          receiveRequestStatus,
          receiveRequestId,
        } = response.data.data || {};

        setFriendStatus(status || "none");
        setIsRequester(isRequester || false);
        setRequestId(requestId);
        setReceiveStatus(receiveRequestStatus);
        setReceiverRequestId(receiveRequestId);
      } catch (error) {
        console.error("Error checking friend status:", error);
        if (retries > 0) {
          console.log(
            `Retrying friend status check... (${retries} attempts left)`,
          );
          return checkFriendStatus(retries - 1);
        }
        setFriendStatus("none");
        errorToast("Failed to load friend status");
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
      if (!token) throw new Error("Authentication token not found");

      const isUnfriend = friendStatus === "accepted" && isRequester;
      const isCancel = friendStatus === "pending" && isRequester;
      const isReject = friendStatus === "pending" && !isRequester;

      if (isUnfriend) {
        reduceFollower();
      }

      const endpoint = isUnfriend
        ? `/adda/unfriend/${user._id}`
        : isCancel
          ? `/adda/cancelRequest/${user._id}`
          : isReject
            ? `/adda/rejectRequest/${requestId}`
            : `/adda/request/${user._id}`;
      const method = isReject ? "patch" : "post";

      const response = await axiosInstance({
        method,
        url: endpoint,
        headers: { Authorization: `Bearer ${token}` },
      });

      setFriendStatus(
        response.data.status ||
          (isUnfriend
            ? "none"
            : isCancel
              ? "none"
              : isReject
                ? "rejected"
                : "pending"),
      );
      setIsRequester(response.data.isRequester || !isUnfriend);
      successToast(response.data.message || "Friend status updated");
    } catch (error) {
      if (error instanceof AxiosError) {
        const accessCheck: AccessCheckResponse = error.response?.data?.error;
        if (accessCheck?.upgradeRequired) {
          setAccessCheck(accessCheck);
          setShowModal(true);
        } else {
          errorToast(
            error.response?.data.error || "Failed to send friend request",
          );
        }
      } else {
        errorToast("Friend action failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportAbuse = () => {
    setModalTypeBlock("report");
    setReportModal(true);
    setShowDropdown(false);
  };

  const handleBlockUser = () => {
    setModalTypeBlock("block");
    setReportModal(true);
    setShowDropdown(false);
  };

  const handleUnblockUser = () => {
    setModalTypeBlock("unblock");
    setReportModal(true);
    setShowDropdown(false);
  };

  const handleAcceptRequest = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication token not found");
      const result = await dispatch(
        acceptFriendRequest({
          requestId:
            friendStatus == "pending"
              ? (requestId as string)
              : (receiverRequestId as string),
          token,
        }),
      );
      if (acceptFriendRequest.fulfilled.match(result)) {
        // Notification updates are handled in the thunk
        dispatch(fetchFriendRequests({ page: 1, limit: 10, token }));
        dispatch(fetchFollowBackUsers(token));
      }
      // await axiosInstance.patch(
      //   `/adda/acceptRequest/${friendStatus == "pending" ? requestId : receiverRequestId}`,
      //   {},
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // );
      friendStatus == "pending"
        ? setFriendStatus("accepted")
        : setReceiveStatus("accepted");
      addFollowing();
      successToast("Friend request accepted");
    } catch (error: unknown) {
      errorToast("Failed to accept friend request");
      if (error instanceof AxiosError) {
        const accessCheck: AccessCheckResponse = error.response?.data?.error;
        if (accessCheck?.upgradeRequired) {
          setAccessCheck(accessCheck);
          setShowModal(true);
        } else {
          errorToast(
            error.response?.data.error || "Failed to send friend request",
          );
        }
      } else {
        errorToast("Failed to send friend request");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFriendButtonConfig = () => {
    const configs: Record<
      FriendStatus,
      { text: string; icon: JSX.Element; classes: string; action?: () => void }
    > = {
      accepted: isRequester
        ? {
            text: "Unfollow",
            icon: <UserMinus size={14} />,
            classes:
              "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-200 border-red-200",
            action: handleFriendAction,
          }
        : {
            text: "Follow",
            icon: <UserPlus size={14} />,
            classes:
              "bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-blue-200 border-blue-200",
            action: handleFriendAction,
          },
      pending: isRequester
        ? {
            text: "Cancel Request",
            icon: <X size={14} />,
            classes:
              "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-200 border-yellow-200",
            action: handleFriendAction,
          }
        : {
            text: "Respond to Request",
            icon: <Clock size={14} />,
            classes:
              "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 focus:ring-yellow-200 border-yellow-200",
          },
      rejected: {
        text: "Send Request",
        icon: <UserPlus size={14} />,
        classes:
          "bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-blue-200 border-blue-200",
        action: handleFriendAction,
      },
      none: {
        text: "Follow",
        icon: <UserPlus size={14} />,
        classes:
          "bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-blue-200 border-blue-200",
        action: handleFriendAction,
      },
    };

    return configs[friendStatus] || null;
  };

  const buttonConfig = getFriendButtonConfig();

  const handleModalBackdropClick = (
    e: React.MouseEvent,
    modalType: "photo" | "cover",
  ) => {
    if (e.target === e.currentTarget) {
      if (modalType === "photo") setShowPhotoModal(false);
      else setShowCoverModal(false);
    }
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPhotoModal) setShowPhotoModal(false);
        if (showCoverModal) setShowCoverModal(false);
      }
    };

    if (showPhotoModal || showCoverModal) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [showPhotoModal, showCoverModal]);

  return (
    <>
      <style>
        {`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes imagePop {
            from { transform: scale(0.8); opacity: 0.5; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes coverFade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-modal { animation: fadeInScale 0.3s ease-out forwards; }
          .animate-image { animation: imagePop 0.4s ease-out forwards; }
          .animate-cover { animation: coverFade 0.5s ease-out forwards; }
        `}
      </style>

      <motion.div
        className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className={`h-20 sm:h-24 md:h-28 lg:h-32 relative ${
            isValidCoverImage ? "bg-cover bg-center cursor-pointer" : "bg-black"
          }`}
          onClick={
            isValidCoverImage ? () => setShowCoverModal(true) : undefined
          }
          style={
            isValidCoverImage
              ? { backgroundImage: `url(${user.coverImage})` }
              : undefined
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isValidCoverImage && (
            <div className="absolute inset-0 bg-black bg-opacity-20 animate-cover"></div>
          )}
        </motion.div>

        <div className="relative px-2 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-6 ">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-3 sm:mb-6 -mt-8 sm:-mt-12 ">
            <div className="relative mb-3 sm:mb-0 self-center sm:self-auto">
              {user.picture && !friendBlocked ? (
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
              <>
                {!friendBlocked && (
                  <>
                    {" "}
                    {isUserBlocked ? (
                      <div className="flex justify-center sm:justify-end">
                        <div className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-full">
                          You have blocked this user
                        </div>
                      </div>
                    ) : (
                      <div className=" flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end">
                        {isStatusLoading ? (
                          <div className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-600 rounded-full bg-gray-50 border border-gray-200">
                            <Loader2 size={14} className="mr-2 animate-spin" />
                            Loading...
                          </div>
                        ) : (!isRequester && friendStatus == "pending") ||
                          (receiveStatus === "pending" && isRequester) ? (
                          <>
                            <motion.button
                              onClick={handleAcceptRequest}
                              disabled={isLoading}
                              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-green-600 rounded-full bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200 border border-green-200 font-medium min-w-[60px] sm:min-w-auto"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">
                                    Accept
                                  </span>
                                </>
                              )}
                            </motion.button>
                            <motion.button
                              onClick={handleFriendAction}
                              disabled={isLoading}
                              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm text-red-600 rounded-full bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-200 border border-red-200 font-medium min-w-[60px] sm:min-w-auto"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <>
                                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden sm:inline">
                                    Reject
                                  </span>
                                </>
                              )}
                            </motion.button>
                          </>
                        ) : buttonConfig?.action ? (
                          <motion.button
                            onClick={buttonConfig.action}
                            disabled={isLoading}
                            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-200 border font-semibold ${buttonConfig.classes}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
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
                                  {friendStatus === "accepted"
                                    ? "Remove"
                                    : friendStatus === "pending" ||
                                        receiveStatus === "pending"
                                      ? "Cancel"
                                      : "Add"}
                                </span>
                              </>
                            )}
                          </motion.button>
                        ) : null}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="space-y-3 sm:space-y-4 relative">
            {!friendBlocked && (
              <div
                className="top-5 right-0 absolute h-7 w-7 rounded-full flex items-center justify-center"
                onClick={() => setShowDropdown(true)}
              >
                <EllipsisVertical className="w-10 h-10 hover:w-11 hover:h-11" />
              </div>
            )}
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 z-50 w-48 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-xl"
              >
                <>
                  <button
                    className="flex items-center w-full px-4 py-3 text-left text-orange-600 transition-colors hover:bg-gray-50"
                    onClick={handleReportAbuse}
                  >
                    <MdReport className="w-5 h-5 mr-2" />
                    Report Abuse
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-3 text-left text-red-600 transition-colors hover:bg-gray-50"
                    onClick={
                      isUserBlocked ? handleUnblockUser : handleBlockUser
                    }
                  >
                    {isUserBlocked ? (
                      <>
                        <MdPersonAdd className="w-5 h-5 mr-2" />
                        Unblock User
                      </>
                    ) : (
                      <>
                        <MdBlock className="w-5 h-5 mr-2" />
                        Block User
                      </>
                    )}
                  </button>
                </>
              </motion.div>
            )}
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1 sm:mb-2 text-center sm:text-left">
                {user.name || "Unnamed User"}
              </h2>
              {!friendBlocked && (
                <div className="flex items-center justify-center sm:justify-start text-xs sm:text-sm text-gray-600">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span>Joined {formatDate(user.joinedDate)}</span>
                </div>
              )}
            </div>
            {friendBlocked && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200">
                    <MdBlock className="w-6 h-6 text-gray-600" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    Profile Unavailable
                  </h3>

                  <p className="text-sm text-gray-600 max-w-md">
                    You can’t view this profile because the user has blocked
                    you.
                  </p>
                </div>
              </div>
            )}
            {!friendBlocked && (
              <>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 py-3 sm:p-4 border-t border-b border-gray-200">
                  <button
                    onClick={() => setModalType("followers")}
                    className="group text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                      {totalFollowers.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Followers
                    </div>
                  </button>
                  <button
                    onClick={() => setModalType("following")}
                    className="group text-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm sm:text-lg font-semibold text-gray-800 group-hover:text-blue-600">
                      {totalFollowing.length}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Following
                    </div>
                  </button>
                  <div className="text-center p-2">
                    <div className="text-sm sm:text-lg font-semibold text-gray-800">
                      {totalPosts}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Posts
                    </div>
                  </div>
                </div>
                {user.bio && (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      About
                    </h3>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {user.bio}
                    </p>
                  </div>
                )}
                {user.interests?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Interests
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-blue-700 bg-blue-50 rounded-full border border-blue-200 font-medium hover:bg-blue-100 transition-colors"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
      {modalType && (
        <UserListModal
          userIds={modalType === "followers" ? totalFollowers : totalFollowing}
          title={modalType === "followers" ? "Followers" : "Following"}
          setShowModal={() => setModalType(null)}
          currentUserClerkId={currentUserClerkId}
          currentUserId={currentUserId}
        />
      )}
      {showPhotoModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => handleModalBackdropClick(e, "photo")}
        >
          <div className="relative">
            <button
              onClick={() => setShowPhotoModal(false)}
              className="absolute z-10 p-2 sm:p-3 text-gray-600 bg-white rounded-full shadow-xl -top-3 -right-3 sm:-top-4 sm:-right-4 hover:text-gray-800 hover:bg-gray-100 hover:scale-110 transition-all"
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
                  <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-500">
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
      {showCoverModal && isValidCoverImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4"
          onClick={(e) => handleModalBackdropClick(e, "cover")}
        >
          <div className="relative">
            <button
              onClick={() => setShowCoverModal(false)}
              className="absolute z-10 p-2 sm:p-3 text-gray-600 bg-white rounded-full shadow-xl -top-3 -right-3 sm:-top-4 sm:-right-4 hover:text-gray-800 hover:bg-gray-100 hover:scale-110 transition-all"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="w-[90vw] max-w-[1200px] h-[50vh] max-h-[400px] sm:h-[60vh] sm:max-h-[600px] rounded-lg overflow-hidden shadow-2xl animate-modal">
              <img
                src={user.coverImage}
                alt="Cover image"
                className="object-cover w-full h-full animate-image"
                onError={() => setShowCoverModal(false)}
              />
            </div>
          </div>
        </div>
      )}
      <SubscriptionModalManager
        accessCheck={accessCheck}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      <ReportAbuseModal
        isOpen={reportModal}
        setIsOpen={setReportModal}
        modalType={modalTypeBlock}
        userId={user._id}
        reportType="user"
        onSuccess={() => {
          if (modalTypeBlock === "block") {
            setIsUserBlocked(true);
          }

          if (modalTypeBlock === "unblock") {
            setIsUserBlocked(false);
            onUnblockSuccess?.();
          }
        }}
      />
    </>
  );
};

export default ProfileHeader;
