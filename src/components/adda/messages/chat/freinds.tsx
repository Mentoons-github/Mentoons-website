import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  updatedAt: Date;
  createdAt: Date;
}

const Friends = () => {
  const { selectedUser } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await axiosInstance.get("/conversation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setConversations(response.data.data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to fetch conversations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter((conv) =>
    conv.friend.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {loading && <div className="text-center py-5">Loading...</div>}
          {error && <div className="text-red-500 text-center py-5">{error}</div>}

          {filteredConversations.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-5">No Conversations</div>
          )}

          {filteredConversations.map((conv, index) => (
            <motion.div
              key={conv.conversation_id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{
                y: -2,
                backgroundColor: "#f8fafc",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              }}
              onClick={() => navigate(`/chat/${conv.friend._id}`)}
              className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer mb-3 transition-all ${
                selectedUser === conv.conversation_id
                  ? "bg-indigo-50 border-2 border-indigo-200"
                  : "hover:bg-gray-50 border-2"
              }`}
            >
              <div className="relative">
                <img
                  src={conv.friend.picture}
                  alt={conv.friend.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                {conv.friend.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </div>

              <div className="flex flex-col flex-grow min-w-0">
                <h1 className="text-sm font-semibold text-gray-800">{conv.friend.name}</h1>
                <p className="text-xs text-gray-500 truncate">
                  {conv.lastMessage || "Start chatting..."}
                </p>
              </div>

              <div className="absolute top-3 right-3">
                <span className="text-xs text-gray-400">
                  {new Date(conv.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Friends;
