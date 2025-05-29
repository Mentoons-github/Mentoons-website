import { useState, useEffect } from "react";
import axiosInstance from "@/api/axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface Friend {
  _id: string;
  name: string;
  picture?: string;
  followers: string[];
  following: string[];
}

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-2">
      {loading ? (
        <p className="text-sm text-gray-500">Loading friends...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : friends.length > 0 ? (
        <>
          {friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => navigate(`/adda/user/${friend._id}`)}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={friend.picture || "https://via.placeholder.com/40"}
                  alt={friend.name}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-medium text-gray-800">
                  {friend.name}
                </span>
              </div>
              {/* <button
                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                onClick={() => alert(`Remove friend ${friend.name}`)}
              >
                Remove
              </button> */}
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-3 py-1 text-sm text-white bg-orange-500 rounded hover:bg-orange-600 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({totalCount} friends)
              </span>
              <button
                className={`px-3 py-1 text-sm text-white bg-orange-500 rounded hover:bg-orange-600 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="p-3 mb-3 text-orange-500 rounded-full bg-orange-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <p className="font-medium text-gray-600">No friends yet</p>
          <p className="text-sm text-gray-500">
            Connect with others by sending or accepting friend requests
          </p>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
