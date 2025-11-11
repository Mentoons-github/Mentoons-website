import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { errorToast } from "@/utils/toastResposnse";
import { highlightText } from "@/utils/highlightText";

interface Friend {
  _id: string;
  name: string;
  picture: string;
  status:
    | "self"
    | "guest"
    | "connect"
    | "friends"
    | "followBack"
    | "pendingSent"
    | "pendingReceived";
}

interface UserDetails {
  _id: string;
  name: string;
  picture: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
}

interface FriendCardProps {
  friend: Friend;
  index: number;
  onSendRequest: (friendId: string) => void;
  onCancelRequest: (friendId: string) => void;
  isConnecting: boolean;
  searchQuery?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.15 } },
};

const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  index,
  onSendRequest,
  onCancelRequest,
  isConnecting,
  searchQuery = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [modalPos, setModalPos] = useState<{
    top: number;
    left: number;
    placement: "left" | "right" | "center";
  }>({ top: 0, left: 0, placement: "right" });

  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const { getToken } = useAuth();

  const fetchUserDetails = useCallback(async () => {
    if (isLoadingDetails) return;
    setIsLoadingDetails(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");

      const { data } = await axiosInstance.get(
        `/user/other-user/${friend._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setUserDetails(data.data);
      } else {
        errorToast("Failed to load user details");
      }
    } catch (err) {
      console.error(err);
      errorToast("Failed to load user details");
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  useEffect(() => {
    if (isHovered) fetchUserDetails();
    else setUserDetails(null);
  }, [isHovered, fetchUserDetails]);

  const calcModalPos = useCallback(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const modalW = 320;
    const gap = 8;

    let placement: "left" | "right" | "center" = "right";
    let left = 0;

    if (rect.right + gap + modalW <= vw) {
      placement = "right";
      left = rect.right + gap;
    } else if (rect.left - gap - modalW >= 0) {
      placement = "left";
      left = rect.left - modalW - gap;
    } else {
      placement = "center";
      left = Math.max(
        8,
        Math.min(rect.left + rect.width / 2 - modalW / 2, vw - modalW - 8)
      );
    }

    setModalPos({
      top: placement === "center" ? rect.bottom + gap : rect.top,
      left,
      placement,
    });
  }, []);

  const startHover = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    calcModalPos();
    setIsHovered(true);
  };

  const endHover = (e: React.MouseEvent) => {
    const modal = modalRef.current;
    if (modal && modal.contains(e.relatedTarget as Node)) return;

    hoverTimeout.current = setTimeout(() => setIsHovered(false), 150);
  };

  const keepHoverOnModal = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(true);
  };

  const leaveModal = () => {
    hoverTimeout.current = setTimeout(() => setIsHovered(false), 150);
  };

  useEffect(() => {
    if (!isHovered) return;
    const recalc = () => calcModalPos();
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc);
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc);
    };
  }, [isHovered, calcModalPos]);

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  const renderButton = () => {
    if (friend.status === "friends") {
      return (
        <div className="w-full px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-full text-center">
          Friends
        </div>
      );
    }

    if (friend.status === "pendingSent") {
      return (
        <button
          onClick={() => onCancelRequest(friend._id)}
          className="w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors duration-200 min-h-[44px] focus:ring-2 focus:ring-orange-400 focus:outline-none"
          aria-label={`Cancel friend request to ${friend.name}`}
        >
          Cancel Request
        </button>
      );
    }

    if (friend.status === "pendingReceived") {
      return (
        <div className="w-full px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-full text-center">
          Request Pending
        </div>
      );
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSendRequest(friend._id);
        }}
        disabled={isConnecting}
        className={`w-full px-3 py-1.5 text-sm font-medium text-white rounded-full transition-colors duration-200 min-h-[44px] flex items-center justify-center focus:ring-2 focus:ring-orange-400 focus:outline-none ${
          isConnecting
            ? "bg-orange-400 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
        aria-label={`Connect with ${friend.name}`}
      >
        {isConnecting ? (
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 border-2 rounded-full border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <span>Connecting…</span>
          </div>
        ) : friend.status === "followBack" ? (
          "Follow Back"
        ) : (
          "Connect"
        )}
      </button>
    );
  };

  return (
    <>
      <div
        ref={cardRef}
        onMouseEnter={startHover}
        onMouseLeave={endHover}
        className="relative"
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={index}
          className="p-4 bg-white border border-orange-100 rounded-xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <img
              src={friend.picture}
              alt={friend.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-orange-200 mb-2"
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            />
            <h3 className="text-sm font-medium text-gray-800 text-center line-clamp-1 w-full">
              {highlightText(friend.name, searchQuery)}
            </h3>
            <p className="text-xs text-gray-500 capitalize mb-3">
              {friend.status.replace(/([A-Z])/g, " $1").trim()}
            </p>
            {renderButton()}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isHovered && friend.status !== "guest" && (
          <motion.div
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={keepHoverOnModal}
            onMouseLeave={leaveModal}
            style={{
              position: "fixed",
              top: `${modalPos.top}px`,
              left: `${modalPos.left}px`,
              zIndex: 9999,
            }}
            className="w-80"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-orange-100 overflow-hidden">
              {modalPos.placement === "left" && (
                <div className="absolute right-0 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white translate-x-full" />
              )}
              {modalPos.placement === "right" && (
                <div className="absolute left-0 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white -translate-x-full" />
              )}
              {modalPos.placement === "center" && (
                <div className="absolute top-0 left-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white -translate-x-1/2 -translate-y-full" />
              )}

              {isLoadingDetails ? (
                <div className="p-6 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>
              ) : userDetails ? (
                <>
                  <div className="h-20 bg-gradient-to-r from-orange-400 to-orange-500" />
                  <div className="relative px-6 pb-4">
                    <img
                      src={userDetails.picture}
                      alt={userDetails.name}
                      className="w-20 h-20 rounded-full border-4 border-white object-cover -mt-10 shadow-lg"
                    />
                    <div className="mt-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {userDetails.name}
                      </h3>

                      {userDetails.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{userDetails.location}</span>
                        </div>
                      )}

                      {userDetails.bio && (
                        <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                          {userDetails.bio}
                        </p>
                      )}

                      {userDetails.joinedDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>Joined {userDetails.joinedDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6">{renderButton()}</div>
                </>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FriendCard;
