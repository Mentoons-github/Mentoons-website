import { useEffect, useState } from "react";
import "./friendRequest.css";
import { useAuth } from "@clerk/clerk-react";
import FriendRequestsList from "./friendRequests/requests";
import FriendSuggestionsList from "./friendRequests/suggestions";
import { RequestInterface } from "@/types";
import axiosInstance from "@/api/axios";

const FriendRequest = () => {
  const [requests, setRequests] = useState<RequestInterface[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [activeRequestTab, setActiveRequestTab] = useState<"send" | "receive">(
    "receive"
  );
  const { getToken } = useAuth();

  const fetchRequests = async () => {
    if (loading) return;
    setLoading(true);

    const token = await getToken();
    try {
      const response = await axiosInstance(
        `/adda/getMyFriendRequests?page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const friendRequest = response.data.data;
      setRequests((prev) =>
        response.data.data.length > 0
          ? prev
            ? [...prev, ...friendRequest]
            : friendRequest
          : prev || []
      );
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeRequestTab === "receive") {
      if (!requests) fetchRequests();
    }
  }, [activeRequestTab]);

  return (
    <div className="flex flex-col items-center w-full rounded-xl p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full">
            <img
              src="/assets/adda/sidebar/dd917c3b5f69868482390319c6a80c25.png"
              alt="friend-requests"
              className="w-full"
            />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 figtree">
            {activeRequestTab === "receive"
              ? "Friend Requests"
              : "Friend Suggestions"}
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activeRequestTab === "receive" &&
            requests &&
            requests.length > 0 && (
              <span className="flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-orange-500 rounded-full">
                {requests.length}
              </span>
            )}
          <div className="flex p-1 bg-gray-100 rounded-lg w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-auto px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all ${
                activeRequestTab === "receive"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveRequestTab("receive")}
            >
              Requests
            </button>
            <button
              className={`flex-1 sm:flex-auto px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-md transition-all ${
                activeRequestTab === "send"
                  ? "bg-white text-orange-500 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveRequestTab("send")}
            >
              Suggestions
            </button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-y-auto max-h-[300px] sm:max-h-[400px] scrollbar-hide">
        {activeRequestTab === "receive" ? (
          <FriendRequestsList
            requests={requests}
            loading={loading}
            onFetchMore={fetchRequests}
          />
        ) : (
          <FriendSuggestionsList />
        )}
      </div>

      {activeRequestTab === "receive" && loading && (
        <div className="flex items-center justify-center w-full py-3 sm:py-4">
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <span className="ml-2 text-xs sm:text-sm text-gray-500">
            Loading more requests...
          </span>
        </div>
      )}
    </div>
  );
};

export default FriendRequest;
