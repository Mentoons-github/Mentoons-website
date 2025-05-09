import { useState } from "react";
import "./friendRequest.css";
import FriendRequestsList from "./friendRequests/requests";
import FriendSuggestionsList from "./friendRequests/suggestions";

const FriendRequest = () => {
  const [activeRequestTab, setActiveRequestTab] = useState<"send" | "receive">(
    "receive"
  );

  return (
    <div className="flex flex-col items-center w-full p-2 rounded-xl sm:p-4">
      <div className="flex flex-col items-start justify-between w-full gap-3 mb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full sm:w-10 sm:h-10">
            <img
              src="/assets/adda/sidebar/dd917c3b5f69868482390319c6a80c25.png"
              alt="friend-requests"
              className="w-full"
            />
          </div>
          <h2 className="text-base font-semibold text-gray-800 sm:text-lg figtree">
            {activeRequestTab === "receive"
              ? "Friend Requests"
              : "Friend Suggestions"}
          </h2>
        </div>

        <div className="flex items-center w-full gap-2 sm:w-auto">
          <div className="flex w-full p-1 bg-gray-100 rounded-lg sm:w-auto">
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
          <FriendRequestsList />
        ) : (
          <FriendSuggestionsList />
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
