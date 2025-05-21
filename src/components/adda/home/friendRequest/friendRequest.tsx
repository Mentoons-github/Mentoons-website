import { useState } from "react";
import FriendRequestsList from "./friendRequests/requests";
import FriendSuggestionsList from "./friendRequests/suggestions";

const FriendRequest = () => {
  const [activeRequestTab, setActiveRequestTab] = useState<"send" | "receive">(
    "receive"
  );

  return (
    <div className="flex flex-col w-full max-h-[300px] overflow-y-auto box-border">
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
          {activeRequestTab === "receive"
            ? "Friend Requests"
            : "Friend Suggestions"}
        </h2>
      </div>
      <div className="flex gap-2 mb-2 border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 ${
            activeRequestTab === "receive"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "hover:text-orange-500"
          }`}
          onClick={() => setActiveRequestTab("receive")}
        >
          Requests
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium text-gray-600 transition-colors duration-200 ${
            activeRequestTab === "send"
              ? "text-orange-500 border-b-2 border-orange-500"
              : "hover:text-orange-500"
          }`}
          onClick={() => setActiveRequestTab("send")}
        >
          Suggestions
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
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
