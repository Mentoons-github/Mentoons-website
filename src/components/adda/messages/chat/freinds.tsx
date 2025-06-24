import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import useSocket from "@/hooks/adda/useSocket";

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
  isRead?: boolean;
}

interface ConversationResponse {
  data: UserConversation[];
}

interface FriendsResponse {
  data: {
    friends: Friend[];
  };
}

export interface SocketOnlineUser {
  _id: string;
  name: string;
  picture?: string;
  email?: string;
  bio?: string;
  conversation_id?: string;
  friend?: Friend;
  lastMessage?: string;
  updatedAt?: string;
  createdAt?: string;
  isRead?: boolean;
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
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const socket = useSocket();

  const [loading, setLoading] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "read" | "unread">(
    "all"
  );

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
    if (!socket) return;

    socket.on("online_users", (data: SocketOnlineUser[]) => {
      console.log("socket data rteceived :", data);
      setConversations((prev) =>
        prev.map((conv) => {
          const onlineUser = data.find(
            (u) => u.conversation_id && u.friend?._id === conv.friend._id
          );
          return onlineUser
            ? { ...conv, friend: { ...conv.friend, isOnline: true } }
            : { ...conv, friend: { ...conv.friend, isOnline: false } };
        })
      );

      setFriends((prev) =>
        prev.map((friend) => {
          const onlineUser = data.find(
            (u) => !u.conversation_id && u._id === friend._id
          );
          return onlineUser
            ? { ...friend, isOnline: true }
            : { ...friend, isOnline: false };
        })
      );
    });

    socket.on("refresh_online_users", () => {
      console.log("Received refresh_online_users, fetching online users");
      socket.emit("online_users");
    });

    return () => {
      socket.off("online_users");
      socket.off("refresh_online_users");
    };
  }, [socket]);

  useEffect(() => {
    if (!debouncedSearch) {
      setFriends([]);
      return;
    }
    const controller = new AbortController();
    const fetchFriends = async () => {
      setFriendsLoading(true);
      setError(null); // Clear previous errors
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

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let filtered = conversations.filter((conv) =>
      conv.friend.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (filter === "online") {
      filtered = filtered.filter((conv) => conv.friend.isOnline);
    } else if (filter === "read") {
      filtered = filtered.filter((conv) => conv.isRead);
    } else if (filter === "unread") {
      filtered = filtered.filter((conv) => !conv.isRead);
    }

    return filtered;
  }, [conversations, debouncedSearch, filter]);

  const conversationFriendIds = useMemo(
    () => conversations.map((conv) => conv.friend._id),
    [conversations]
  );

  const filteredNewFriends = useMemo(() => {
    let filtered = friends.filter(
      (friend) =>
        friend.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
        !conversationFriendIds.includes(friend._id)
    );

    if (filter === "online") {
      filtered = filtered.filter((friend) => friend.isOnline);
    }

    return filtered;
  }, [friends, debouncedSearch, conversationFriendIds, filter]);


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

  const handleNavigation = async (item: MergedResult) => {
    if (item.type === "friend") {
      try {
        const token = await getToken();
        const response = await axiosInstance.post<{ conversation_id: string }>(
          "/conversation",
          { friendId: item.data._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate(`/chat/${response.data.conversation_id}`);
      } catch (err) {
        console.error("Error creating conversation:", err);
        setError("Failed to start chat.");
      }
    } else {
      navigate(`/chat/${item.data.friend._id}`);
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[350px] bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col gap-5 border border-white/20"
      role="region"
      aria-label="Friends and Conversations"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200/50">
        <FaSearch className="text-gray-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search chats..."
          className="outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search chats"
        />
      </div>

      <div className="flex gap-2" role="group" aria-label="Filter options">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "all"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          aria-pressed={filter === "all"}
          aria-label="Show all conversations and friends"
        >
          All
        </button>
        <button
          onClick={() => setFilter("online")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "online"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          aria-pressed={filter === "online"}
          aria-label="Show online users only"
        >
          Online
        </button>
        <button
          onClick={() => setFilter("read")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "read"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          aria-pressed={filter === "read"}
          aria-label="Show read conversations"
          disabled={filteredConversations.length === 0}
        >
          Read
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1 text-sm rounded-full ${
            filter === "unread"
              ? "bg-indigo-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          aria-pressed={filter === "unread"}
          aria-label="Show unread conversations"
          disabled={filteredConversations.length === 0}
        >
          Unread
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {(loading || friendsLoading) && (
            <div className="text-center py-5" role="status">
              Loading...
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center py-5" role="alert">
              {error}
            </div>
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
              onClick={() => handleNavigation(item)}
              className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer mb-3 transition-all ${
                selectedUser ===
                (item.type === "conversation"
                  ? item.data.friend._id
                  : item.data._id)
                  ? "bg-indigo-50 border-2 border-indigo-200"
                  : "hover:bg-gray-50 border-2 border-transparent"
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Open chat with ${
                item.type === "conversation"
                  ? item.data.friend.name
                  : item.data.name
              }`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleNavigation(item);
                }
              }}
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
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"
                    aria-label="Online status"
                  ></span>
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
                    {!item.data.isRead && (
                      <span
                        className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full"
                        aria-label="Unread message"
                      ></span>
                    )}
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
