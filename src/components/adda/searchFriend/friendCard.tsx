import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Friend } from "@/components/adda/searchFriend/searchFriend";
import FriendModal from "@/components/common/modal/userDetailModal";
import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { errorToast } from "@/utils/toastResposnse";

interface FriendCardProps {
  friend: Friend;
  index: number;
  onSendRequest: (friendId: string) => void;
  onCancelRequest: (friendId: string) => void;
  isConnecting: boolean;
}

interface UserDetails {
  _id: string;
  name: string;
  picture: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  index,
  onSendRequest,
  onCancelRequest,
  isConnecting,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { getToken } = useAuth();

  const fetchUserDetails = useCallback(async () => {
    if (isLoadingDetails) return;
    setIsLoadingDetails(true);
    try {
      const token = await getToken();
      const response = await axiosInstance.get(
        `/user/other-user/${friend._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setUserDetails(response.data.data);
      } else {
        errorToast("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      errorToast("Failed to fetch user details");
    } finally {
      setIsLoadingDetails(false);
    }
  }, [friend._id, getToken]);

  useEffect(() => {
    if (isHovered) {
      fetchUserDetails();
    } else {
      setUserDetails(null);
    }
  }, [isHovered, fetchUserDetails]);

  return (
    <div
      ref={cardRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        className="p-4 bg-white border border-orange-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="flex flex-col items-center">
          <img
            src={friend.picture}
            alt={friend.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 mb-2"
            onError={(e) => {
              e.currentTarget.src = "/default-avatar.png";
            }}
          />
          <h3 className="text-sm font-medium text-gray-800 text-center line-clamp-1">
            {friend.name}
          </h3>
          <p className="text-xs text-gray-500 capitalize mb-3">
            {friend.status.replace(/([A-Z])/g, " $1").trim()}
          </p>
          {friend.status === "friends" ? (
            <div className="w-full px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-full text-center">
              Friends
            </div>
          ) : friend.status === "pendingSent" ? (
            <button
              onClick={() => onCancelRequest(friend._id)}
              className="w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 min-h-[44px] focus:ring-2 focus:ring-orange-400 focus:outline-none"
              aria-label={`Cancel friend request to ${friend.name}`}
            >
              Cancel Request
            </button>
          ) : friend.status === "pendingReceived" ? (
            <div className="w-full px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full text-center">
              Request Pending
            </div>
          ) : (
            <button
              onClick={() => onSendRequest(friend._id)}
              disabled={isConnecting || friend.status === "followBack"}
              className={`w-full px-3 py-1.5 text-sm font-medium text-white ${
                isConnecting
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } rounded-full transition-colors duration-200 min-h-[44px] flex items-center justify-center focus:ring-2 focus:ring-orange-400 focus:outline-none`}
              aria-label={`Connect with ${friend.name}`}
            >
              {isConnecting ? (
                <div className="flex items-center justify-center gap-1">
                  <div className="w-4 h-4 border-2 rounded-full border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <span>Connecting...</span>
                </div>
              ) : friend.status === "followBack" ? (
                "Follow Back"
              ) : (
                "Connect"
              )}
            </button>
          )}
        </div>
      </motion.div>
      <div className="absolute top-0 right-1/6">
        <FriendModal
          friend={friend}
          userDetails={userDetails}
          isVisible={isHovered}
          onSendRequest={onSendRequest}
          onCancelRequest={onCancelRequest}
          isConnecting={isConnecting}
          isLoadingDetails={isLoadingDetails}
        />
      </div>
    </div>
  );
};

export default FriendCard;
