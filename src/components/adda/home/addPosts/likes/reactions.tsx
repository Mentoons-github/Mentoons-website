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
    activeIcon: <FaThumbsUp className="w-4 text-blue-500 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaThumbsUp className="w-4 text-gray-400 sm:w-6 sm:h-6" />,
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

      toast.success(
        isTogglingOff
          ? "Reaction removed"
          : `${reactionType} added successfully`
      );
    } catch (error) {
      console.error("Error updating reaction:", error);
      toast.error("Failed to update reaction. Please try again.");

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

  // Get the default reaction icon (like)
  const getDisplayedReaction = () => {
    if (userReaction) {
      return reactionData[userReaction].activeIcon;
    }
    return reactionData.like.inactiveIcon;
  };

  const getReactionLabel = () => {
    if (userReaction) {
      return reactionData[userReaction].label;
    }
    return "Like";
  };

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center gap-3"
    >
      {/* Main reaction button */}
      <motion.button
        className={`flex items-center justify-center gap-2 px-4 py-2 bg-white border ${
          userReaction ? "border-orange-500" : "border-orange-400"
        } rounded-full transition-colors`}
        onClick={toggleReactionSelector}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <span className="flex items-center justify-center w-5 h-5">
          {getDisplayedReaction()}
        </span>
        <span
          className={`text-sm ${
            userReaction ? reactionData[userReaction].color : "text-gray-600"
          }`}
        >
          {getReactionLabel()}
        </span>
      </motion.button>

      {/* Reaction count */}
      <div className="flex items-center gap-1">
        <span className="text-[#605F5F] figtree text-sm">
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
    </div>
  );
};

export default Reactions;
