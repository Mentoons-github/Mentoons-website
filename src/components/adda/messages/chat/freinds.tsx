import axiosInstance from "@/api/axios";
import useSocket from "@/hooks/adda/useSocket";
import { fetchAllConversations } from "@/redux/adda/conversationSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { Message } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

interface Friend {
  _id: string;
  name: string;
  picture?: string;
  email?: string;
  bio?: string;
  isOnline?: boolean;
}

interface UserConversation {
  conversation_id: string;
  friend: Friend;
  lastMessage: string;
  messageType: string;
  isBlocked?: boolean;
  updatedAt: string;
  createdAt: string;
  unreadCounts: { [userId: string]: number };
}

interface FriendsResponse {
  data: {
    friends: Friend[];
  };
}

interface FriendsProps {
  lastMessage: Message | null;
}

type MergedResult =
  | { type: "conversation"; data: UserConversation }
  | { type: "friend"; data: Friend };

type FilterType = "all" | "online" | "read" | "unread";

interface FriendsResponse {
  data: {
    friends: Friend[];
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Friends: React.FC<FriendsProps> = () => {
  const { selectedUser } = useParams();
  const { onlineUsers, mongoUserId } = useSocket();

  console.log("omline users from backend : ", onlineUsers);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, status } = useSelector(
    (state: RootState) => state.conversation
  );

  const [friendsLoading, setFriendsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((user: { _id: string }) => user._id === userId);
  };

  const unreadCount = conversations.filter(
    (conv) => (conv.unreadCounts?.[mongoUserId] || 0) > 0
  ).length;

  const readCount = conversations.filter(
    (conv) => (conv.unreadCounts?.[mongoUserId] || 0) === 0
  ).length;

  const onlineCount = conversations.filter((conv) =>
    isUserOnline(conv.friend._id)
  ).length;

  const totalCount = conversations.length;

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "online", label: "Online", count: onlineCount },
    { key: "read", label: "Read", count: readCount },
    { key: "unread", label: "Unread", count: unreadCount },
  ];

  useEffect(() => {
    const fetch = async () => {
      const token = await getToken();
      if (!token) return;
      dispatch(fetchAllConversations({ token }));
    };
    fetch();
  }, [getToken, dispatch]);

  useEffect(() => {
    if (!debouncedSearch) {
      setFriends([]);
      return;
    }
    const controller = new AbortController();
    const fetchFriends = async () => {
      setFriendsLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await axiosInstance.get<FriendsResponse>(
          "/adda/getFriends",
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );

        setFriends(response.data.data?.friends || []);

      } catch (err: unknown) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.error("Error fetching friends:", err);
          setError("Failed to fetch friends. Please try again.");
        }
      } finally {
        setFriendsLoading(false);
      }
    };
    fetchFriends();
    return () => controller.abort();
  }, [debouncedSearch, getToken]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const nameMatch = conv.friend.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const isOnline = isUserOnline(conv.friend._id);
      const unreadCount = conv.unreadCounts?.[mongoUserId] || 0;

      switch (activeFilter) {
        case "online":
          return nameMatch && isOnline;
        case "read":
          return nameMatch && unreadCount === 0;
        case "unread":
          return nameMatch && unreadCount > 0;
        case "all":
        default:
          return nameMatch;
      }
    });
  }, [conversations, debouncedSearch, activeFilter, onlineUsers, mongoUserId]);


  const conversationFriendIds = useMemo(
    () => conversations.map((conv) => conv.friend._id),
    [conversations]
  );

  const filteredNewFriends = useMemo(
    () =>
      friends.filter(
        (friend) =>
          friend.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
          !conversationFriendIds.includes(friend._id)
      ),
    [friends, debouncedSearch, conversationFriendIds]
  );

  const mergedResults: MergedResult[] = useMemo(
    () => [
      ...filteredConversations.map(
        (conv) => ({ type: "conversation", data: conv } as const)
      ),
      ...filteredNewFriends.map(
        (friend) => ({ type: "friend", data: friend } as const)
      ),
    ],
    [filteredConversations, filteredNewFriends]
  );

  // Debug logging
  useEffect(() => {
    console.log("Online users updated in Friends component:", onlineUsers);
  }, [onlineUsers]);


  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:max-w-[300px] md:max-w-[350px] bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-5 border border-white/20 h-full"
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50/50 rounded-xl border border-gray-200/50">
        <FaSearch className="text-gray-400 text-sm sm:text-base" />
        <input
          type="text"
          placeholder="Search chats..."
          className="outline-none bg-transparent w-full text-xs sm:text-sm text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search chats"
        />
      </div>

      <div className="relative flex items-center gap-1 p-1 bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 shadow-inner">
        {filters.map((filter) => (
          <motion.button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex-1 px-2 py-2 text-[10px] sm:text-xs font-semibold rounded-xl transition-all duration-300 overflow-hidden ${
              activeFilter === filter.key
                ? "text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
            }`}
          >
            {activeFilter === filter.key && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <motion.div
              className="absolute inset-0 bg-orange-100/60 rounded-xl opacity-0"
              whileHover={{ opacity: activeFilter === filter.key ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <span className="relative z-10 tracking-wide font-sans flex items-center gap-1">
              {filter.label}
              {filter.count > 0 && (
                <span className="text-[8px] sm:text-[10px] bg-white/90 text-gray-700 font-bold px-1 sm:px-1.5 py-0.5 rounded-full shadow">
                  {filter.count}
                </span>
              )}
            </span>
            {activeFilter === filter.key && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-2 h-2 bg-orange-300 rounded-full shadow-sm z-20"
              />
            )}
          </motion.button>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5 rounded-2xl pointer-events-none" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {(status === "conversationLoading" || friendsLoading) && (
            <div className="text-center py-5">Loading...</div>

          )}
          {error && (
            <div className="text-red-500 text-center py-4 sm:py-5 text-xs sm:text-sm">
              {error}
            </div>
          )}
          {mergedResults.length === 0 &&
            status !== "conversationLoading" &&
            !friendsLoading && (
              <div className="text-center text-gray-500 py-4 sm:py-5 text-xs sm:text-sm">
                No results found.
              </div>
            )}
          {mergedResults.map((item, index) => {
            const isOnline = item.type === "conversation" 
              ? isUserOnline(item.data.friend._id)
              : isUserOnline(item.data._id);

            return (
              <motion.div
                key={
                  item.type === "conversation"
                    ? item.data.conversation_id
                    : item.data._id
                }
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  y: -2,
                  backgroundColor: "#f8fafc",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                }}
                onClick={() =>
                  navigate(
                    `/chat/${
                      item.type === "conversation"
                        ? item.data.friend._id
                        : item.data._id
                    }`
                  )
                }
                className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer mb-3 transition-all ${
                  selectedUser ===
                  (item.type === "conversation"
                    ? item.data.friend._id
                    : item.data._id)
                    ? "bg-indigo-50 border-2 border-indigo-200"
                    : "hover:bg-gray-50 border-2"
                }`}
              >
                <div className="relative">
                  <img
                    src={
                      (item.type === "conversation"
                        ? item.data.friend.picture
                        : item.data.picture) || "https://via.placeholder.com/48"
                    }
                    alt={
                      item.type === "conversation"
                        ? item.data.friend.name
                        : item.data.name
                    }
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  {isOnline && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                  )}
                </div>

                <div className="flex flex-col flex-grow min-w-0">
                  <h1 className="text-sm font-semibold text-gray-800">
                    {item.type === "conversation"
                      ? item.data.friend.name
                      : item.data.name}
                  </h1>
                  <p className="text-xs text-gray-500 truncate">
                    {item.type === "conversation"
                      ? item.data.messageType === "image"
                        ? "Image"
                        : item.data.messageType === "video"
                        ? "Video"
                        : item.data.messageType === "file"
                        ? "File"
                        : item.data.messageType === "audio"
                        ? "Audio"
                        : item.data.lastMessage || "Start chatting..."
                      : "Start chatting..."}
                  </p>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {item.type === "conversation" && (
                    <>
                      <span className="text-xs text-gray-400">
                        {new Date(item.data.updatedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                      </span>

                      {item.data.unreadCounts?.[mongoUserId] > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                          {item.data.unreadCounts[mongoUserId]}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Friends;