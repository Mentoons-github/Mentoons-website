import React from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, UserPlus, Heart, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Friend {
  _id: string;
  name: string;
  picture: string;
  status: string;
}

interface UserDetails {
  _id: string;
  name: string;
  picture: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
  followers?: number;
  following?: number;
  friends?: number;
  socialLinks?: string[];
}

interface FriendModalProps {
  friend: Friend;
  userDetails: UserDetails | null;
  isVisible: boolean;
  onSendRequest: (friendId: string) => void;
  onCancelRequest: (friendId: string) => void;
  isConnecting: boolean;
  isLoadingDetails: boolean;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const FriendModal: React.FC<FriendModalProps> = ({
  friend,
  userDetails,
  isVisible,
  onSendRequest,
  onCancelRequest,
  isConnecting,
  isLoadingDetails,
}) => {
  const navigate = useNavigate();

  const handleClick = (userId: string) => {
    navigate(`/adda/user/${userId}`);
  };
  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      onClick={() => handleClick(friend._id)}
      animate={isVisible ? "visible" : "hidden"}
      className="absolute top-0 left-full ml-3 z-20 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden w-64"
    >
      <div className="relative bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500 p-4 pb-10">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex flex-col items-center">
          <div className="relative mb-2">
            <img
              src={friend.picture}
              alt={friend.name}
              className="w-14 h-14 rounded-full object-cover border-3 border-white/20 backdrop-blur-sm shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          </div>
          <h3 className="font-semibold text-white text-base mb-1 text-center drop-shadow-sm">
            {friend.name}
          </h3>
        </div>
      </div>

      <div className="p-4 -mt-6 relative">
        <div className="bg-white rounded-lg border border-gray-100 p-3 shadow-sm mb-3">
          {isLoadingDetails ? (
            <div className="flex justify-center items-center py-4">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <span className="text-xs">Loading...</span>
              </div>
            </div>
          ) : userDetails ? (
            <div className="space-y-3">
              {/* Bio Section */}
              {userDetails.bio && (
                <div>
                  <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2">
                    "{userDetails.bio}"
                  </p>
                </div>
              )}

              {/* Location and Join Date */}
              <div className="space-y-2">
                {userDetails.location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="truncate">{userDetails.location}</span>
                  </div>
                )}
                {userDetails.joinedDate && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>
                      Joined{" "}
                      {new Date(userDetails.joinedDate).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats - Only Followers and Following */}
              {(userDetails.followers !== undefined ||
                userDetails.following !== undefined) && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                  {userDetails.followers !== undefined && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-0.5">
                        <Heart className="w-3 h-3 text-pink-500" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {userDetails.followers}
                      </div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                  )}
                  {userDetails.following !== undefined && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-0.5">
                        <Eye className="w-3 h-3 text-blue-500" />
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {userDetails.following}
                      </div>
                      <div className="text-xs text-gray-500">Following</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500">No details available</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="space-y-2">
          {friend.status === "friends" ? (
            <div className="w-full py-2 text-center font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center justify-center gap-1.5">
                <Heart className="w-3 h-3" />
                <span className="text-sm">Connected</span>
              </div>
            </div>
          ) : friend.status === "pendingSent" ? (
            <div className="space-y-1.5">
              <div className="w-full py-2 text-center font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Request Sent</span>
                </div>
              </div>
              <button
                onClick={() => onCancelRequest(friend._id)}
                className="w-full py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-gray-300 focus:outline-none text-sm"
                aria-label={`Cancel friend request to ${friend.name}`}
              >
                Cancel Request
              </button>
            </div>
          ) : friend.status === "pendingReceived" ? (
            <div className="w-full py-2 text-center font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Awaiting Response</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onSendRequest(friend._id)}
              disabled={isConnecting}
              className={`w-full py-2 font-medium text-white rounded-lg transition-all duration-200 focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm ${
                isConnecting
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
              aria-label={`Connect with ${friend.name}`}
            >
              {isConnecting ? (
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-3 h-3 border-2 rounded-full border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5">
                  <UserPlus className="w-3 h-3" />
                  <span>
                    {friend.status === "followBack" ? "Follow Back" : "Connect"}
                  </span>
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FriendModal;
