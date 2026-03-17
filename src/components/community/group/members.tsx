import { useAppDispatch } from "@/hooks/useRedux";
import {
  cancelFriendRequestThunk,
  sendFollowBackRequest,
  unfollowUserThunk,
} from "@/redux/adda/friendRequest";
import { FilteredFriendRequest } from "@/types/adda/home";
import { User } from "@/types/adda/notification";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const memberVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 180, damping: 18 },
  },
};

type FollowStatus = "follow" | "following" | "requested" | "followBack";

const GroupMembers = ({
  members,
  mongoUserId,
  friendRequests,
  handleMemberClick,
}: {
  members: { name: string; picture: string; _id: string }[];
  mongoUserId: string;
  friendRequests: FilteredFriendRequest[];
  handleMemberClick: (memberId: string) => void;
}) => {
  const [localStatus, setLocalStatus] = useState<Record<string, FollowStatus>>(
    {},
  );
  const { getToken } = useAuth();
  const dispatch = useAppDispatch();
  const [statusClickedUser, setStatusClickedUser] = useState<User | null>(null);
  const [statusClickedStatus, setStatusClickedStatus] =
    useState<FollowStatus | null>(null);
  const [followStatusModalOpen, setFollowStatusModalOpen] =
    useState<boolean>(false);

  const getStatus = (userId: string): FollowStatus => {
    return localStatus[userId] ?? checkStatus(userId);
  };

  const checkStatus = (userId: string): FollowStatus => {
    console.log(userId, "userIdddddd");
    const item = friendRequests.find((val) => val.id === userId);

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
      const user = members.find((u) => u._id === userId);
      if (!user) return;

      setStatusClickedUser(user);
      setStatusClickedStatus(status);
      setFollowStatusModalOpen(true);
    }
  };

  const handleUnfollowCancelRequest = async (action: string) => {
    if (!statusClickedUser) return;
    const userId = statusClickedUser._id;
    const item = friendRequests.find((val) => val.id === userId);

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
      // if (reduceFollower) {
      //   reduceFollower(userId);
      // }

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

  /* Put current user first */
  const sortedMembers = [...members].sort((a, b) => {
    if (a._id === mongoUserId) return -1;
    if (b._id === mongoUserId) return 1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 mt-12">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedMembers.map((member) => {
          const isYou = member._id === mongoUserId;

          const status = getStatus(member._id);

          return (
            <motion.div
              key={member._id}
              variants={memberVariants}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-4 border-orange-400 cursor-pointer"
                onClick={() => handleMemberClick(member._id)}
              >
                <img
                  src={member.picture}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.name,
                      )}&background=f97316&color=ffffff&size=200`;
                  }}
                />
              </div>

              {/* Name */}
              <h2 className="mt-3 font-semibold text-gray-800">
                {isYou ? "You" : member.name}
              </h2>

              {!isYou && (
                <button
                  onClick={() => handleFollowToggle(member._id, status)}
                  className={`mt-3 px-4 py-1.5 text-sm rounded-full transition ${
                    status === "following"
                      ? "bg-gray-300 text-gray-700"
                      : status === "requested"
                        ? "bg-blue-200 text-blue-600"
                        : status === "followBack"
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 text-white"
                  }`}
                >
                  {status === "following"
                    ? "Following"
                    : status === "requested"
                      ? "Requested"
                      : status === "followBack"
                        ? "Follow Back"
                        : "Follow"}
                </button>
              )}

              <button
                onClick={() => handleMemberClick(member._id)}
                className="text-xs text-gray-500 hover:text-orange-500 mt-2"
              >
                View Profile
              </button>
            </motion.div>
          );
        })}
      </motion.div>
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

export default GroupMembers;
