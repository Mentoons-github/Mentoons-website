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

}

const Friends = () => {

  const {selectedUser} = useParams()

  console.log(selectedUser,'ssss')
  
  const navigate = useNavigate();
    const [friends, setFriends] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const limit = 10;
  const { getToken } = useAuth();

  const fetchFriends = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();

      const response = await axiosInstance.get("/adda/getFriends", {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const { friends, totalCount, currentPage, totalPages } =
        response.data.data;
      setFriends(friends);
      setTotalCount(totalCount);
      setCurrentPage(currentPage);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError("Failed to fetch friends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchFriends(currentPage);
    }, [currentPage]);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[350px] bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 flex flex-col gap-5 border border-white/20"
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200/50 focus-within:ring-2 focus-within:ring-indigo-300 transition-all">
        <FaSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          className="outline-none bg-transparent w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {friends?.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{
                y: -2,
                backgroundColor: "#f8fafc",
                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
              }}
              onClick={() => navigate(`/chat/${user._id}`)}
              className={`relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer mb-3 transition-all ${
                selectedUser === user._id
                  ? "bg-indigo-50 border-2 border-indigo-200"
                  : "hover:bg-gray-50 border-2" 
              }`}
            >
              <div className="relative">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
                {/* {user.online && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
                )} */}
              </div>
              <div className="flex flex-col flex-grow min-w-0">
                <h1 className="text-sm font-semibold text-gray-800">
                  {user.name}
                </h1>
                {/* <p className="text-xs text-gray-500 truncate">
                  {user.recentChat}
                </p> */}
              </div>

              {/* <div className="absolute top-3 right-3">
                <span className="text-xs text-gray-400">{user.time}</span>
              </div> */}

              
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Friends;
