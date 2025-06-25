import axiosInstance from "@/api/axios";
import useSocket from "@/hooks/adda/useSocket";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
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
  updatedAt: Date;
  createdAt: Date;
}

interface ConversationResponse {
  data: UserConversation[];
}

interface FriendsResponse {
  data: {
    friends: Friend[];
  };
}

type MergedResult =
  | { type: "conversation"; data: UserConversation }
  | { type: "friend"; data: Friend };

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Friends = () => {
  const { selectedUser } = useParams();
  const { onlineUsers } = useSocket();
  console.log("onilen users :--------------->", onlineUsers);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        const response = await axiosInstance.get<ConversationResponse>(
          "/conversation",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("response :", response.data.data);
        setConversations(response.data.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError("Failed to fetch conversations. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [getToken]);

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

        console.log("response ==========>", response.data.data?.friends);
        setFriends(response.data.data?.friends);
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

  const filteredConversations = useMemo(
    () =>
      conversations.filter((conv) =>
        conv.friend.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [conversations, debouncedSearch]
  );

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

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[350px] bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col gap-5 border border-white/20"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200/50">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          className="outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search chats"
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {(loading || friendsLoading) && (
            <div className="text-center py-5">Loading...</div>
          )}
          {error && (
            <div className="text-red-500 text-center py-5">{error}</div>
          )}
          {mergedResults.length === 0 && !loading && !friendsLoading && (
            <div className="text-center text-gray-500 py-5">
              No results found.
            </div>
          )}
          {mergedResults.map((item, index) => (
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
                {(item.type === "conversation"
                  ? item.data.friend.isOnline
                  : item.data.isOnline) && (
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

              <div className="absolute top-3 right-3">
                {item.type === "conversation" ? (
                  <span className="text-xs text-gray-400">
                    {new Date(item.data.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                ) : (
                  <span className="text-xs text-blue-500 font-semibold">
                    New
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Friends;
