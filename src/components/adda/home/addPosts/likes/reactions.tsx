import { useAuthModal } from "@/context/adda/authModalContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { api } from "@/api/axiosInstance/axiosInstance";
import { AnimatePresence, motion } from "framer-motion";

import { RewardEventType } from "@/types/rewards";
import { reactionEventEmitter } from "@/utils/reactionEvents";
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
    inactiveIcon: <FaThumbsUp className="w-4 text-gray-500 sm:w-6 sm:h-6" />,
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
      <FaFaceLaughSquint className="w-4 text-gray-500 sm:w-6 sm:h-6" />
    ),
    label: "Laugh",
    color: "text-yellow-500",
  },
  angry: {
    activeIcon: <FaFaceAngry className="w-4 text-red-600 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaFaceAngry className="w-4 text-gray-500 sm:w-6 sm:h-6" />,
    label: "Angry",
    color: "text-red-600",
  },
  sad: {
    activeIcon: <FaFaceSadTear className="w-4 text-blue-500 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaFaceSadTear className="w-4 text-gray-500 sm:w-6 sm:h-6" />,
    label: "Sad",
    color: "text-blue-500",
  },
  fire: {
    activeIcon: <FaFire className="w-4 text-orange-600 sm:w-6 sm:h-6" />,
    inactiveIcon: <FaFire className="w-4 text-gray-500 sm:w-6 sm:h-6" />,
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
  toggleReaction = true,
  showLikeCount = true,
  toggleBorder = false,
  onReactionUpdate,
}: {
  type: "post" | "meme";
  id: string;
  likeCount: number;
  enabledReactionTypes?: ReactionType[];
  toggleReaction?: boolean;
  showLikeCount?: boolean;
  toggleBorder?: boolean;
  onReactionUpdate?: (counts: Record<ReactionType, number>) => void;
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

      // Emit event for real-time updates across components
      reactionEventEmitter.emitReactionUpdate(id, updated);

      return updated;
    });

    try {
      let endpoint;

      if (isTogglingOff) {
        endpoint = `${import.meta.env.VITE_PROD_URL}/reactions/remove-reaction`;
      } else {
        endpoint = `${import.meta.env.VITE_PROD_URL}/reactions/add-reaction`;
      }

      // Add reactionType to the payload
      const response = await api.post(endpoint, {
        type,
        id,
        reactionType: newReaction,
      });

      // Update with server response if available
      if (response.data.reactionCounts) {
        setReactionCounts(response.data.reactionCounts);
        // Emit event with server-confirmed data
        reactionEventEmitter.emitReactionUpdate(
          id,
          response.data.reactionCounts,
        );
        // Call callback if provided
        onReactionUpdate?.(response.data.reactionCounts);
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
      setReactionCounts((prev) => {
        const reverted = { ...prev };

        // Revert the optimistic update
        if (userReaction) {
          // If user had a previous reaction, add it back
          reverted[userReaction] = reverted[userReaction] + 1;
        }

        if (!isTogglingOff) {
          // If we were adding a new reaction, remove it
          reverted[reactionType] = Math.max(0, reverted[reactionType] - 1);
        }

        return reverted;
      });

      console.error("Error updating reaction:", error);
      toast.error("Failed to update reaction. Please try again.");
    }
  };

  useEffect(() => {
    const checkReactions = async () => {
      if (!isSignedIn) return;

      try {
        const endpoint = `${
          import.meta.env.VITE_PROD_URL
        }/reactions/check-reaction?type=${type}&id=${id}`;

        const response = await api.get(endpoint);

        // Handle new response format if available
        if (response.data.userReaction) {
          setUserReaction(response.data.userReaction);
        } else if (response.data.liked) {
          // Backward compatibility
          setUserReaction("like");
        }

        if (response.data.reactionCounts) {
          // Only update if we don't have a pending optimistic update
          setReactionCounts((prev) => {
            // If total reactions in prev state differs from server,
            // it means we have an optimistic update in progress
            const prevTotal = Object.values(prev).reduce(
              (sum, count) => sum + count,
              0,
            );
            const serverTotal = Object.values(
              response.data.reactionCounts as Record<string, number>,
            ).reduce((sum: number, count: number) => sum + count, 0);

            // If counts match or this is initial load (prevTotal was from initial state), use server data
            if (prevTotal === serverTotal || prevTotal === (likeCount || 0)) {
              return response.data.reactionCounts;
            }

            // Otherwise, keep the optimistic update
            return prev;
          });
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
        const endpoint = `${
          import.meta.env.VITE_PROD_URL
        }/reactions/get-reactions?type=${type}&id=${id}`;

        const response = await api.get(endpoint);

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

  //Get the default reaction icon (like)
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
      className="relative flex items-center justify-center gap-3 "
    >
      <style>{`
        @keyframes rx-pop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes rx-spin { to { transform: rotate(360deg); } }
        .rx-pop { animation: rx-pop 0.4s cubic-bezier(.2,.9,.3,1.4) both; }

        .rx-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .rx-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .rx-main {
          background: #fff;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.1s ease, background 0.1s ease;
        }
        .rx-main:hover { background: #fef9c3; transform: translate(-2px, -2px) rotate(-2deg); box-shadow: 5px 5px 0 #000; }
        .rx-main:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
        .rx-main-on { background: #fde047; }
        .rx-main-on:hover { background: #facc15; }

        .rx-count {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          min-width: 26px;
          padding: 0 6px;
          text-align: center;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
          cursor: pointer;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), box-shadow 0.1s ease;
        }
        .rx-count:hover { transform: rotate(0deg) scale(1.1); box-shadow: 3px 3px 0 #000; }
        .rx-count:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }

        .rx-selector {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 999px;
        }
        .rx-option {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1), background 0.1s ease;
        }
        .rx-option:hover { background: #fde047; transform: translateY(-4px) rotate(-6deg) scale(1.12); }
        .rx-option-on { background: #fde047; }
        .rx-label {
          background: #fde047;
          color: #000;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 6px;
          padding: 0 6px;
          white-space: nowrap;
          pointer-events: none;
        }

        .rx-panel {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
          background-size: 14px 14px;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 12px;
        }
        .rx-title {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 0 10px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }
        .rx-pill {
          background: #fff;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          transform: rotate(var(--rot, 0deg));
        }
        .rx-row {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 10px;
          transition: transform 0.15s ease, background 0.1s ease;
        }
        .rx-row:hover { background: #fef9c3; transform: translate(-1px, -1px); }
        .rx-avatar {
          border: 3px solid #000;
          border-radius: 999px;
          box-shadow: 2px 2px 0 #000;
        }
        .rx-close {
          background: #ef4444;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          transition: box-shadow 0.1s ease, transform 0.1s ease;
        }
        .rx-close:hover { background: #f87171; }
        .rx-close:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
        .rx-spinner {
          width: 2rem;
          height: 2rem;
          border: 4px solid #000;
          border-top-color: #f97316;
          border-radius: 999px;
          animation: rx-spin 0.7s steps(8) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .rx-pop, .rx-spinner { animation: none; }
        }
      `}</style>

      {/* Main reaction button */}
      <motion.button
        aria-label={getReactionLabel()}
        className={`rx-main flex items-center justify-center gap-2 px-4 py-2 cursor-pointer ${
          toggleBorder && userReaction ? "rx-main-on" : ""
        }`}
        onClick={toggleReaction ? toggleReactionSelector : undefined}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {!showLikeCount && (
          <span className="flex items-center justify-center w-5 h-5 mr-1">
            {getDisplayedReaction()}
          </span>
        )}

        {!showLikeCount && (
          <span className="rx-chip-font flex items-center justify-center mr-1 text-sm uppercase">
            {getReactionLabel()}
          </span>
        )}

        {showLikeCount && (
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
        )}
      </motion.button>

      {/* Reaction count */}
      {showLikeCount && (
        <div className="flex items-center gap-1">
          <span
            role="button"
            tabIndex={0}
            aria-label="Show who reacted"
            className="rx-count rx-chip-font text-sm"
            onClick={() =>
              setShowReactionListDropdown(!showReactionListDropdown)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setShowReactionListDropdown(!showReactionListDropdown);
              }
            }}
          >
            {getTotalReactions()}
          </span>
        </div>
      )}

      {/* Reaction selector popup */}
      <AnimatePresence>
        {showReactionSelector && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="rx-selector absolute left-0 z-50 flex items-center gap-2 px-3 py-2 mb-3 bottom-full"
          >
            {enabledReactions.map((reactionType, i) => (
              <motion.div
                key={reactionType}
                className="relative group"
                whileTap={{ scale: 0.92 }}
                onClick={() => handleReaction(reactionType)}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={reactionData[reactionType].label}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleReaction(reactionType);
                    }
                  }}
                  className={`rx-option rx-pop flex items-center justify-center w-10 h-10 cursor-pointer ${
                    userReaction === reactionType ? "rx-option-on" : ""
                  }`}
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  {reactionData[reactionType].activeIcon}
                </div>
                {/* Mini label */}
                <div className="rx-label rx-chip-font absolute text-xs transition-opacity transform -translate-x-1/2 opacity-0 -bottom-8 left-1/2 group-hover:opacity-100 z-10">
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
            className="rx-panel absolute left-0 z-50 p-3"
            style={{
              top: "calc(100% + 10px)",
              minWidth: "270px",
            }}
          >
            <h3 className="rx-title rx-font mb-3 pr-1 text-base">
              Who reacted to this post
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(reactionCounts)
                .filter(([, count]) => count > 0)
                .map(([type, count], i) => (
                  <div
                    key={type}
                    className="rx-pill flex items-center gap-1 px-2 py-0.5"
                    style={
                      {
                        ["--rot" as string]: `${i % 2 === 0 ? -2 : 2}deg`,
                      } as React.CSSProperties
                    }
                  >
                    <span className="flex items-center justify-center w-5 h-5">
                      {reactionData[type as ReactionType].activeIcon}
                    </span>
                    <span
                      className={`rx-chip-font text-sm ${
                        reactionData[type as ReactionType].color
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                ))}
            </div>

            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto p-1">
              {isLoadingReactions ? (
                <div className="flex items-center justify-center py-4">
                  <div className="rx-spinner"></div>
                </div>
              ) : reactionsList && reactionsList.length > 0 ? (
                reactionsList.map((reaction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rx-row flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={reaction?.user?.picture}
                        alt=""
                        className="rx-avatar w-8 h-8 shrink-0 object-cover"
                      />
                      <span className="rx-font text-sm text-black truncate">
                        {reaction?.user?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 shrink-0">
                      {reactionData[reaction?.reactionType]?.activeIcon}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rx-font text-center text-orange-600">
                  No reactions yet
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close reactions list"
              className="rx-close absolute flex items-center justify-center top-2 right-2 w-7 h-7 cursor-pointer"
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
                  strokeWidth={3}
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
