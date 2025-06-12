import { reactionEventEmitter } from "@/utils/reactionEvents";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
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
    label: string;
    color: string;
  }
> = {
  like: {
    activeIcon: <FaThumbsUp className="w-4 h-4 text-blue-500" />,
    label: "Like",
    color: "text-blue-500",
  },
  love: {
    activeIcon: <FaHeart className="w-4 h-4 text-red-500" />,
    label: "Love",
    color: "text-red-500",
  },
  laugh: {
    activeIcon: <FaFaceLaughSquint className="w-4 h-4 text-yellow-500" />,
    label: "Laugh",
    color: "text-yellow-500",
  },
  angry: {
    activeIcon: <FaFaceAngry className="w-4 h-4 text-red-600" />,
    label: "Angry",
    color: "text-red-600",
  },
  sad: {
    activeIcon: <FaFaceSadTear className="w-4 h-4 text-blue-500" />,
    label: "Sad",
    color: "text-blue-500",
  },
  fire: {
    activeIcon: <FaFire className="w-4 h-4 text-orange-600" />,
    label: "Fire",
    color: "text-orange-600",
  },
};

interface ReactionsDisplayProps {
  type: "post" | "meme";
  id: string;
  initialLikeCount?: number;
  onReactionUpdate?: (counts: Record<ReactionType, number>) => void;
}

const ReactionsDisplay = ({
  type,
  id,
  initialLikeCount = 0,
  onReactionUpdate,
}: ReactionsDisplayProps) => {
  const [reactionCounts, setReactionCounts] = useState<
    Record<ReactionType, number>
  >({
    like: initialLikeCount,
    love: 0,
    laugh: 0,
    angry: 0,
    sad: 0,
    fire: 0,
  });

  const [showReactionListDropdown, setShowReactionListDropdown] =
    useState(false);
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

  const reactionListDropdownRef = useRef<HTMLDivElement>(null);
  const { getToken, isSignedIn } = useAuth();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  // Listen for reaction updates from other components
  useEffect(() => {
    const handleReactionUpdate = (event: CustomEvent) => {
      const { postId, reactionCounts: newCounts } = event.detail;
      if (postId === id) {
        setReactionCounts(newCounts);
      }
    };

    const cleanup = reactionEventEmitter.onReactionUpdate(handleReactionUpdate);

    return cleanup;
  }, [id]);

  // Fetch reaction counts with polling for real-time updates
  useEffect(() => {
    const fetchReactionCounts = async () => {
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

        if (response.data.reactionCounts) {
          setReactionCounts(response.data.reactionCounts);
          onReactionUpdate?.(response.data.reactionCounts);
        } else if (response.data.likeCount !== undefined) {
          // Backward compatibility
          setReactionCounts((prev) => {
            const updated = {
              ...prev,
              like: response.data.likeCount,
            };
            onReactionUpdate?.(updated);
            return updated;
          });
        }
      } catch (error) {
        console.error("Error fetching reaction counts:", error);
      }
    };

    fetchReactionCounts();

    // Poll for updates every 5 seconds for real-time experience
    const interval = setInterval(fetchReactionCounts, 5000);

    return () => clearInterval(interval);
  }, [type, id, getToken, isSignedIn, onReactionUpdate]);

  // Fetch reactions list when dropdown is opened
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
          setReactionsList(response.data.reactions || []);
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

  // Calculate total reactions
  const getTotalReactions = () => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  };

  // Get top reactions
  const getTopReactions = () => {
    return Object.entries(reactionCounts)
      .filter(([, count]) => count > 0)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 3);
  };

  const totalReactions = getTotalReactions();
  const topReactions = getTopReactions();

  // Don't render if no reactions
  if (totalReactions === 0) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Reaction icons */}
      <div className="flex -space-x-1">
        {topReactions.map(([reactionType], index) => (
          <span
            key={reactionType}
            className="flex items-center justify-center w-8 h-8 p-1 bg-white border border-orange-200 rounded-full"
            style={{ zIndex: topReactions.length - index }}
          >
            {reactionData[reactionType as ReactionType].activeIcon}
          </span>
        ))}
      </div>

      {/* Reaction count - clickable */}
      <span
        className="text-sm text-gray-600 transition-colors cursor-pointer hover:text-gray-800"
        onClick={() => setShowReactionListDropdown(!showReactionListDropdown)}
      >
        {totalReactions}
      </span>

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
                    key={reaction._id}
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

export default ReactionsDisplay;
