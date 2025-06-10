import { useAuthModal } from "@/context/adda/authModalContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import { useEffect, useRef, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import {
  FaFaceAngry,
  FaFaceLaughSquint,
  FaFaceSadTear,
  FaFire,
  FaThumbsUp,
} from "react-icons/fa6";
import { toast } from "sonner";

// Define reaction types
export type ReactionType = "like" | "love" | "laugh" | "angry" | "sad" | "fire";

// Define reaction data structure
const reactionData: Record<
  ReactionType,
  {
    activeIcon: JSX.Element;
    inactiveIcon: JSX.Element;
    label: string;
    color: string;
  }
> = {
  like: {
    activeIcon: <FaThumbsUp className="w-8 text-blue-500 m:w-12 sm:h-12" />,
    inactiveIcon: <FaThumbsUp className="w-8 text-gray-400 sm:w-6 sm:h-6" />,
    label: "Like",
    color: "text-blue-500",
  },
  love: {
    activeIcon: <FaHeart className="w-4 text-red-500 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaRegHeart className="w-4 text-orange-500 sm:w-6 sm:h-6" />,
    label: "Love",
    color: "text-red-500",
  },
  // Add proper icons for other reaction types
  laugh: {
    activeIcon: (
      <FaFaceLaughSquint className="w-4 text-yellow-500 sm:w-6 sm:h-6" />
    ),
    inactiveIcon: (
      <FaFaceLaughSquint className="w-4 text-gray-400 sm:w-6 sm:h-6" />
    ),
    label: "Laugh",
    color: "text-yellow-500",
  },
  angry: {
    activeIcon: <FaFaceAngry className="w-4 text-red-600 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaFaceAngry className="w-4 text-gray-400 sm:w-6 sm:h-6" />,
    label: "Angry",
    color: "text-red-600",
  },
  sad: {
    activeIcon: <FaFaceSadTear className="w-4 text-blue-500 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaFaceSadTear className="w-4 text-gray-400 sm:w-6 sm:h-6" />,
    label: "Sad",
    color: "text-blue-500",
  },
  fire: {
    activeIcon: <FaFire className="w-4 text-orange-600 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaFire className="w-4 text-gray-400 sm:w-6 sm:h-6" />,
    label: "Fire",
    color: "text-orange-600",
  },
};

// Reactions component
const Reactions = ({
  type,
  id,
  likeCount,
  enabledReactionTypes = ["like", "love", "laugh", "angry", "sad", "fire"],
}: {
  type: "post" | "meme";
  id: string;
  likeCount: number;
  enabledReactionTypes?: ReactionType[];
}) => {
  const { isSignedIn } = useUser();
  const { openAuthModal } = useAuthModal();
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
  const [showReactionSelector, setShowReactionSelector] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showReactionListDropdown, setShowReactionListDropdown] =
    useState(false);
  const reactionListDropdownRef = useRef<HTMLDivElement>(null);
  const [reactionCounts, setReactionCounts] = useState<
    Record<ReactionType, number>
  >({
    like: likeCount || 0,
    love: 0,
    laugh: 0,
    angry: 0,
    sad: 0,
    fire: 0,
  });

  const { getToken } = useAuth();

  // Use the provided enabledReactionTypes
  const enabledReactions = enabledReactionTypes;

  const getTotalReactions = () => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  };

  // Handle click outside to close reaction selector
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowReactionSelector(false);
      }

      if (
        showReactionListDropdown &&
        reactionListDropdownRef.current &&
        !reactionListDropdownRef.current.contains(event.target as Node)
      ) {
        setShowReactionListDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactionListDropdown]);

  const toggleReactionSelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }
    setShowReactionSelector((prev) => !prev);
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (!isSignedIn) {
      openAuthModal("sign-in");
      return;
    }

    // Close the selector
    setShowReactionSelector(false);

    const isTogglingOff = userReaction === reactionType;
    const newReaction = isTogglingOff ? null : reactionType;

    // Update UI optimistically
    setUserReaction(newReaction);
    setReactionCounts((prev) => {
      const updated = { ...prev };

      // Remove previous reaction if any
      if (userReaction) {
        updated[userReaction] = Math.max(0, updated[userReaction] - 1);
      }

      // Add new reaction if not toggling off
      if (!isTogglingOff) {
        updated[reactionType] = updated[reactionType] + 1;
      }

      return updated;
    });

    try {
      const token = await getToken();
      let endpoint;

      if (isTogglingOff) {
        endpoint = `${import.meta.env.VITE_PROD_URL}/reactions/remove-reaction`;
      } else {
        endpoint = `${import.meta.env.VITE_PROD_URL}/reactions/add-reaction`;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Add reactionType to the payload
      const response = await axios.post(
        endpoint,
        { type, id, reactionType: newReaction },
        { headers }
      );

      // Update with server response if available
      if (response.data.reactionCounts) {
        setReactionCounts(response.data.reactionCounts);
      }

      // Trigger reward points only when adding a reaction (not when removing)
      if (!isTogglingOff) {
        if (reactionType === "like") {
          triggerReward(RewardEventType.LIKE_POST, id);
        } else if (reactionType === "love") {
          triggerReward(RewardEventType.LOVE_POST, id);
        }
      }
    } catch (error) {
      // Revert UI state on error
      setUserReaction(userReaction);
    }
  };

  useEffect(() => {
    const checkReactions = async () => {
      if (!isSignedIn) return;

      try {
        const token = await getToken();
        const endpoint = `${
          import.meta.env.VITE_PROD_URL
        }/reactions/check-reaction?type=${type}&id=${id}`;

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(endpoint, { headers });

        // Handle new response format if available
        if (response.data.userReaction) {
          setUserReaction(response.data.userReaction);
        } else if (response.data.liked) {
          // Backward compatibility
          setUserReaction("like");
        }

        if (response.data.reactionCounts) {
          setReactionCounts(response.data.reactionCounts);
        } else if (response.data.likeCount !== undefined) {
          // Backward compatibility
          setReactionCounts((prev) => ({
            ...prev,
            like: response.data.likeCount,
          }));
        }
      } catch (error) {
        console.error("Error checking reactions:", error);
      }
    };

    checkReactions();
  }, [type, id, getToken, isSignedIn]);

  // Fetch reaction list when dropdown is opened
  const [reactionsList, setReactionsList] = useState<
    {
      _id: string;
      user: {
        _id: string;
        email: string;
        name: string;
        picture: string;
      };
      createdAt: string;
      reactionType: ReactionType;
    }[]
  >([]);
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);

  useEffect(() => {
    const fetchReactionsList = async () => {
      if (!showReactionListDropdown) return;

      setIsLoadingReactions(true);
      try {
        const token = await getToken();
        const endpoint = `${
          import.meta.env.VITE_PROD_URL
        }/reactions/get-reactions?type=${type}&id=${id}`;

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.get(endpoint, { headers });

        if (response.status === 200) {
          setReactionsList(response.data.reactions);
        }
      } catch (error) {
        console.error("Error fetching reactions list:", error);
        toast.error("Failed to load reactions. Please try again.");
      } finally {
        setIsLoadingReactions(false);
      }
    };

    fetchReactionsList();
  }, [showReactionListDropdown, type, id, getToken]);

  // Get the default reaction icon (like)
  // const getDisplayedReaction = () => {
  //   if (userReaction) {
  //     return reactionData[userReaction].activeIcon;
  //   }
  //   return reactionData.like.inactiveIcon;
  // };

  // const getReactionLabel = () => {
  //   if (userReaction) {
  //     return reactionData[userReaction].label;
  //   }
  //   return "Like";
  // };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-3 "
    >
      {/* Main reaction button */}
      <motion.button
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border  ${
          userReaction ? "border-orange-500" : "border-orange-400"
        } rounded-full transition-colors`}
        onClick={toggleReactionSelector}
        whileTap={{ scale: 0.9 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0px 4px 10px rgba(255,110,0,0.30)",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex items-center">
          {/* User's reaction icon */}
          {/* Top three most common reactions or default like icon */}
          <div className="flex -space-x-1">
            {(() => {
              const topReactions = Object.entries(reactionCounts)
                .filter(([, count]) => count > 0)
                .sort(([, countA], [, countB]) => countB - countA)
                .slice(0, 3);

              if (topReactions.length === 0) {
                return (
                  <span className="flex items-center justify-center w-5 h-5">
                    {userReaction
                      ? reactionData[userReaction].activeIcon
                      : reactionData.like.inactiveIcon}
                  </span>
                );
              }

              return topReactions.map(([type]) => (
                <span
                  key={type}
                  className="flex items-center justify-center w-5 h-5"
                >
                  {reactionData[type as ReactionType].activeIcon}
                </span>
              ));
            })()}
          </div>
        </div>
      </motion.button>

      {/* Reaction count */}
      <div className="flex items-center gap-1">
        <span
          className="text-[#605F5F] figtree text-sm"
          onClick={() => setShowReactionListDropdown(!showReactionListDropdown)}
        >
          {getTotalReactions()}
        </span>
      </div>

      {/* Reaction selector popup */}
      <AnimatePresence>
        {showReactionSelector && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 z-50 flex items-center p-2 mb-2 bg-white border border-gray-200 shadow-lg bottom-full rounded-xl"
            style={{ boxShadow: "0px 4px 20px rgba(0,0,0,0.15)" }}
          >
            {enabledReactions.map((reactionType) => (
              <motion.div
                key={reactionType}
                className="relative p-1 mx-1 group"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleReaction(reactionType)}
              >
                <div className="flex items-center justify-center w-8 h-8 cursor-pointer">
                  {reactionData[reactionType].activeIcon}
                </div>
                {/* Mini label */}
                <div className="absolute text-xs font-medium transition-opacity transform -translate-x-1/2 opacity-0 -bottom-6 left-1/2 group-hover:opacity-100">
                  {reactionData[reactionType].label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Reaction list dropdown */}
      <AnimatePresence>
        {showReactionListDropdown && (
          <motion.div
            ref={reactionListDropdownRef}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 z-50 p-3 bg-white border border-orange-200 shadow-lg rounded-xl shadow-orange-100"
            style={{
              boxShadow: "0px 4px 16px rgba(255, 120, 0, 0.2)",
              top: "calc(100% + 10px)",
              minWidth: "250px",
            }}
          >
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Who reacted to this post
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(reactionCounts)
                .filter(([, count]) => count > 0)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center gap-1 px-2 py-1 bg-orange-100 rounded-full"
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      {reactionData[type as ReactionType].activeIcon}
                    </span>
                    <span
                      className={`text-xs ${
                        reactionData[type as ReactionType].color
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                ))}
            </div>

            <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {isLoadingReactions ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-8 h-8 border-t-4 border-orange-500 border-solid rounded-full animate-spin"></div>
                </div>
              ) : reactionsList && reactionsList.length > 0 ? (
                reactionsList.map((reaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-2 mb-2 transition-colors border border-orange-100 rounded-lg hover:bg-orange-100/50"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={reaction?.user?.picture}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {reaction?.user?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 ">
                      {reactionData[reaction?.reactionType]?.activeIcon}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-orange-500">
                  No reactions yet
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute flex items-center justify-center text-gray-500 bg-orange-100 rounded-full top-3 right-3 w-7 h-7 hover:text-orange-700"
              onClick={() => setShowReactionListDropdown(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reactions;
