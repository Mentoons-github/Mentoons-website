import axiosInstance from "@/api/axios";
import { useAppDispatch } from "@/hooks/useRedux";
import {
  cancelFriendRequestThunk,
  sendFollowBackRequest,
  unfollowUserThunk,
} from "@/redux/adda/friendRequest";
import { UserSummary } from "@/types";
import { FilteredFriendRequest } from "@/types/adda/home";
import { errorToast } from "@/utils/toastResposnse";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserListModalProps {
  userIds: string[];
  title: string;
  setShowModal: (show: boolean) => void;
  currentUserClerkId?: string;
  currentUserId?: string;
  reduceFollower?: (id: string) => void;
  // addFollowing?: (id: string) => void;
}

type FollowStatus = "follow" | "following" | "requested" | "followBack";

const UserListModal: React.FC<UserListModalProps> = ({
  userIds,
  title,
  setShowModal,
  currentUserClerkId,
  currentUserId,
  reduceFollower,
  // addFollowing,
}) => {
  const { getToken } = useAuth();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [filteredLists, setFilteredLists] = useState<FilteredFriendRequest[]>(
    [],
  );
  const [localStatus, setLocalStatus] = useState<Record<string, FollowStatus>>(
    {},
  );
  const [followStatusModalOpen, setFollowStatusModalOpen] =
    useState<boolean>(false);
  const [statusClickedUser, setStatusClickedUser] =
    useState<UserSummary | null>(null);
  const [statusClickedStatus, setStatusClickedStatus] =
    useState<FollowStatus | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const { loading } = useAppSelector((state) => state.friendRequests);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Authentication token not found");

        const response = await axiosInstance.post(
          "/user/bulk",
          { userIds },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const fetchedUsers = response.data.data.map((user: any) => ({
          _id: user._id,
          name: user.name,
          picture: user.picture,
          role: user.role,
          clerkId: user.clerkId,
          followers: user.followers,
          following: user.following,
        }));
        setFilteredLists(response.data.freindRequests);

        setUsers(fetchedUsers);
      } catch (error) {
        errorToast("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    if (userIds.length > 0) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [userIds, getToken]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(setShowModal, 200);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getStatus = (userId: string): FollowStatus => {
    return localStatus[userId] ?? checkStatus(userId);
  };

  const checkStatus = (userId: string): FollowStatus => {
    const item = filteredLists.find((val) => val.id === userId);

    if (!item) return "follow";

    const { sentRequest, receivedRequest } = item;

    if (sentRequest?.status === "accepted") {
      return "following";
    }

    if (
      sentRequest &&
      sentRequest.receiverId === userId &&
      sentRequest.status === "pending"
    ) {
      return "requested";
    }

    if (receivedRequest && receivedRequest.senderId === userId) {
      return "followBack";
    }

    return "follow";
  };

  const handleFollowToggle = async (userId: string, status: string) => {
    const token = await getToken();
    if (!token) return;
    if (status === "follow" || status === "followBack") {
      setLocalStatus((prev) => ({
        ...prev,
        [userId]: "requested",
      }));

      await dispatch(sendFollowBackRequest({ userId, token })).unwrap();
      return;
    }
    if (status === "requested" || status === "following") {
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      setStatusClickedUser(user);
      setStatusClickedStatus(status);
      setFollowStatusModalOpen(true);
    }
  };

  const handleUnfollowCancelRequest = async (action: string) => {
    if (!statusClickedUser) return;
    const userId = statusClickedUser._id;
    const item = filteredLists.find((val) => val.id === userId);

    const token = await getToken();
    if (!token) return;

    if (action === "unfollow") {
      await dispatch(unfollowUserThunk({ userId, token })).unwrap();

      setLocalStatus((prev) => ({
        ...prev,
        [userId]:
          item?.receivedRequest && item?.receivedRequest.senderId === userId
            ? "followBack"
            : "follow",
      }));
      if (reduceFollower) {
        reduceFollower(userId);
      }

      setFollowStatusModalOpen(false);
    }
    if (action === "cancel") {
      await dispatch(cancelFriendRequestThunk({ userId, token })).unwrap();

      setLocalStatus((prev) => ({
        ...prev,
        [userId]:
          item?.receivedRequest && item?.receivedRequest.senderId === userId
            ? "followBack"
            : "follow",
      }));

      setFollowStatusModalOpen(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-all duration-300 ease-out flex items-center justify-center z-50 ${
        isVisible ? "bg-opacity-60" : "bg-opacity-0"
      }`}
      onClick={handleBackdropClick}
      style={{ backdropFilter: isVisible ? "blur(4px)" : "blur(0px)" }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden transition-all duration-300 ease-out transform ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <User size={16} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 transition-colors duration-200 rounded-full hover:text-gray-600 hover:bg-white hover:bg-opacity-50"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <div className="absolute inset-0 border-2 border-blue-100 rounded-full"></div>
              </div>
              <p className="mt-3 text-sm text-gray-500">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <User size={24} className="text-gray-400" />
              </div>
              <p className="text-sm text-center text-gray-500">
                No {title.toLowerCase()} found.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((user, index) => {
                const isMe = user._id === currentUserId;
                // const isFollowing = user.followers?.includes(
                //   currentUserId as string,
                // );
                const status = getStatus(user._id);

                return (
                  <div
                    key={user._id}
                    className={`flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer group transform hover:scale-[1.02] ${
                      isVisible ? "animate-slideInUp" : ""
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Left: Avatar + Name */}
                    <div
                      className="flex items-center gap-3 flex-1 min-w-0"
                      onClick={() =>
                        navigate(
                          user.clerkId === currentUserClerkId
                            ? "/adda/user-profile"
                            : `/adda/user/${user._id}`,
                        )
                      }
                    >
                      <div className="relative w-12 h-12">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name}
                            className="object-cover w-full h-full transition-shadow duration-200 border-2 border-white rounded-full shadow-md group-hover:shadow-lg"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full rounded-full shadow-md bg-gradient-to-br from-blue-400 to-purple-500 group-hover:shadow-lg">
                            <span className="text-sm font-medium text-white">
                              {user.name[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate transition-colors duration-200 group-hover:text-blue-600">
                        {user.name}
                      </p>
                    </div>

                    {/* Right: Follow button (hidden if current user) */}
                    {!isMe && (
                      <button
                        onClick={() => handleFollowToggle(user._id, status)}
                        className={`py-1 px-3 rounded-md font-medium whitespace-nowrap
                          ${
                            status === "following"
                              ? "bg-gray-300 text-gray-700"
                              : status === "requested"
                                ? "bg-blue-200 text-blue-600"
                                : status === "followBack"
                                  ? "bg-green-500 text-white"
                                  : "bg-orange-500 text-white"
                          }
                        `}
                      >
                        {status === "following" && "Following"}
                        {status === "requested" && "Requested"}
                        {status === "followBack" && "Follow Back"}
                        {status === "follow" && "Follow"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {users.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-center text-gray-500">
              {users.length} {users.length === 1 ? "user" : "users"} total
            </p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slideInUp {
            animation: slideInUp 0.4s ease-out;
          }
        `}
      </style>
      {followStatusModalOpen && statusClickedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                src={statusClickedUser.picture}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{statusClickedUser.name}</p>
                <p className="text-xs text-gray-500">
                  {statusClickedStatus === "requested"
                    ? "Request pending"
                    : "You are following this user"}
                </p>
              </div>
            </div>

            {/* Actions */}
            {statusClickedStatus === "requested" && (
              <button
                onClick={() => handleUnfollowCancelRequest("cancel")}
                className="w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
              >
                Cancel Request
              </button>
            )}

            {statusClickedStatus === "following" && (
              <button
                onClick={() => handleUnfollowCancelRequest("unfollow")}
                className="w-full py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
              >
                Unfollow
              </button>
            )}

            <button
              onClick={() => setFollowStatusModalOpen(false)}
              className="w-full py-2 rounded-lg bg-gray-200 text-gray-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListModal;
