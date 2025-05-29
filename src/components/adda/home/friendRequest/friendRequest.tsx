import { useState } from "react";
import FriendRequestsList from "./friendRequests/requests";
import FriendSuggestionsList from "./friendRequests/suggestions";
import FriendsList from "./friendRequests/friendList";

const FriendRequest = () => {
  const [activeRequestTab, setActiveRequestTab] = useState<
    "send" | "receive" | "friends"
  >("receive");

  return (
    <div className="flex flex-col w-full box-border">
      <div className="mb-1">
        <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
          {activeRequestTab === "receive"
            ? "Friend Requests"
            : activeRequestTab === "send"
            ? "Friend Suggestions"
            : "My Friends"}
        </h2>
      </div>
      <div className="sticky top-0 z-10 flex gap-2 mb-1 border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-1.5 text-sm font-medium text-gray-600 transition-colors duration-200 ${
            activeRequestTab === "receive"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "hover:text-orange-500"
          }`}
          onClick={() => setActiveRequestTab("receive")}
        >
          Requests
        </button>
        <button
          className={`flex-1 py-1.5 text-sm font-medium text-gray-600 transition-colors duration-200 ${
            activeRequestTab === "send"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "hover:text-orange-500"
          }`}
          onClick={() => setActiveRequestTab("send")}
        >
          Suggestions
        </button>
        <button
          className={`flex-1 py-1.5 text-sm font-medium text-gray-600 transition-colors duration-200 ${
            activeRequestTab === "friends"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "hover:text-orange-500"
          }`}
          onClick={() => setActiveRequestTab("friends")}
        >
          Friends
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-1 max-h-[400px]">
        {activeRequestTab === "receive" ? (
          <FriendRequestsList />
        ) : activeRequestTab === "send" ? (
          <FriendSuggestionsList />
        ) : (
          <FriendsList />
        )}
      </div>
    </div>
  );
};

export default FriendRequest;
