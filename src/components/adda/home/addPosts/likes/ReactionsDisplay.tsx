import { reactionEventEmitter } from "@/utils/reactionEvents";
import { useAuth } from "@clerk/clerk-react";
import { api } from "@/api/axiosInstance/axiosInstance";
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
        const endpoint = `${
          import.meta.env.VITE_PROD_URL
        }/reactions/check-reaction?type=${type}&id=${id}`;

        const response = await api.get(endpoint);

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
        const endpoint = `${
          import.meta.env.VITE_PROD_URL
        }/reactions/get-reactions?type=${type}&id=${id}`;

        const response = await api.get(endpoint);

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
      <style>{`
        @keyframes rd-pop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          70%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes rd-spin { to { transform: rotate(360deg); } }
        .rd-pop { animation: rd-pop 0.4s cubic-bezier(.2,.9,.3,1.4) both; }

        .rd-font {
          font-family: var(--font-comic) !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em;
        }
        .rd-chip-font {
          font-family: var(--font-comic-chip, var(--font-comic)) !important;
          font-weight: 400 !important;
          letter-spacing: 0.04em;
        }

        .rd-icon {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          transition: transform 0.15s cubic-bezier(.34,1.56,.64,1);
        }
        .rd-icons:hover .rd-icon { transform: translateY(-2px) rotate(-6deg); }

        .rd-count {
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
        .rd-count:hover { transform: rotate(0deg) scale(1.1); box-shadow: 3px 3px 0 #000; }
        .rd-count:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }

        .rd-panel {
          background-color: #fffbeb;
          background-image: radial-gradient(rgba(249,115,22,0.18) 1.5px, transparent 2px);
          background-size: 14px 14px;
          border: 3px solid #000;
          box-shadow: 5px 5px 0 #000;
          border-radius: 12px;
        }
        .rd-title {
          background: #fde047;
          color: #000;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 8px;
          padding: 0 10px;
          transform: rotate(-2deg) skewX(-6deg);
          display: inline-block;
        }
        .rd-pill {
          background: #fff;
          border: 2px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          transform: rotate(var(--rot, 0deg));
        }
        .rd-row {
          background: #fff;
          border: 3px solid #000;
          box-shadow: 3px 3px 0 #000;
          border-radius: 10px;
          transition: transform 0.15s ease, background 0.1s ease;
        }
        .rd-row:hover { background: #fef9c3; transform: translate(-1px, -1px); }
        .rd-avatar {
          border: 3px solid #000;
          border-radius: 999px;
          box-shadow: 2px 2px 0 #000;
        }
        .rd-close {
          background: #ef4444;
          color: #fff;
          border: 3px solid #000;
          box-shadow: 2px 2px 0 #000;
          border-radius: 999px;
          transition: box-shadow 0.1s ease, transform 0.1s ease;
        }
        .rd-close:hover { background: #f87171; }
        .rd-close:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #000; }
        .rd-spinner {
          width: 2rem;
          height: 2rem;
          border: 4px solid #000;
          border-top-color: #f97316;
          border-radius: 999px;
          animation: rd-spin 0.7s steps(8) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .rd-pop, .rd-spinner { animation: none; }
        }
      `}</style>

      {/* Reaction icons */}
      <div className="rd-icons flex -space-x-2">
        {topReactions.map(([reactionType], index) => (
          <span
            key={reactionType}
            className="rd-icon rd-pop flex items-center justify-center w-8 h-8 p-1"
            style={{
              zIndex: topReactions.length - index,
              animationDelay: `${index * 0.08}s`,
            }}
          >
            {reactionData[reactionType as ReactionType].activeIcon}
          </span>
        ))}
      </div>

      {/* Reaction count - clickable */}
      <span
        role="button"
        tabIndex={0}
        aria-label="Show who reacted"
        className="rd-count rd-chip-font text-sm"
        onClick={() => setShowReactionListDropdown(!showReactionListDropdown)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowReactionListDropdown(!showReactionListDropdown);
          }
        }}
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
            className="rd-panel absolute left-0 z-50 p-3"
            style={{
              top: "calc(100% + 10px)",
              minWidth: "270px",
            }}
          >
            <h3 className="rd-title rd-font mb-3 pr-1 text-base">
              Who reacted to this post
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(reactionCounts)
                .filter(([, count]) => count > 0)
                .map(([type, count], i) => (
                  <div
                    key={type}
                    className="rd-pill flex items-center gap-1 px-2 py-0.5"
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
                      className={`rd-chip-font text-sm ${
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
                  <div className="rd-spinner"></div>
                </div>
              ) : reactionsList && reactionsList.length > 0 ? (
                reactionsList.map((reaction, index) => (
                  <motion.div
                    key={reaction._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rd-row flex items-center justify-between p-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={reaction?.user?.picture}
                        alt=""
                        className="rd-avatar w-8 h-8 shrink-0 object-cover"
                      />
                      <span className="rd-font text-sm text-black truncate">
                        {reaction?.user?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 shrink-0">
                      {reactionData[reaction?.reactionType]?.activeIcon}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="rd-font text-center text-orange-600">
                  No reactions yet
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close reactions list"
              className="rd-close absolute flex items-center justify-center top-2 right-2 w-7 h-7 cursor-pointer"
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

export default ReactionsDisplay;
