import { Conversations, Friend } from "@/types";
import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

interface UserListProps {
  friends: Friend[] | null;
  conversations: Conversations[] | null;
  loading: boolean;
  onSelectUser: (user: Friend) => void;
  selectedUserId: string | undefined;
}

const UserList = ({
  friends,
  conversations,
  loading,
  onSelectUser,
  selectedUserId,
}: UserListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredFriends = !friends
    ? []
    : friends.filter((friend) =>
        friend.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const getLastMessage = (friendId: string) => {
    if (!conversations) return null;

    const conversation = conversations.find((conv) =>
      conv.members.includes(friendId)
    );

    if (
      !conversation ||
      !conversation.messages ||
      conversation.messages.length === 0
    ) {
      return null;
    }
    return conversation.messages[conversation.messages.length - 1];
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-80 h-[520px] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-gray-800 font-bold">Messages</h1>
        <div className="flex items-center gap-2">
          <button
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-3 flex gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "all"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>
      )}

      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-4">
        <FaSearch className="w-4 h-4 text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search conversations..."
          className="bg-transparent outline-none w-full text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-1">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading conversations...
          </div>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => {
            const lastMessage = getLastMessage(friend._id);

            return (
              <div
                key={friend._id}
                className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 
                  ${
                    selectedUserId === friend._id
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                onClick={() => onSelectUser(friend)}
              >
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full object-cover">
                    <img
                      src={
                        friend.picture || "https://avatar.iran.liara.run/public"
                      }
                      alt={friend.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3 max-w-[168px]">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-700">
                        {friend.name}
                      </h3>
                      {friend.isPinned && (
                        <svg
                          className="w-3 h-3 text-gray-400 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.293 1.293a1 1 0 011.414 0l3 3A1 1 0 0113 6H3a1 1 0 01-.707-1.707l3-3zM7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"></path>
                        </svg>
                      )}
                    </div>
                    <p className="text-sm truncate w-full text-gray-500">
                      {lastMessage ? lastMessage.text : "Start a conversation"}
                    </p>
                  </div>
                </div>
                <div className="text-xs whitespace-nowrap text-gray-400">
                  {friend.lastSeen || ""}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchTerm
              ? "No conversations match your search"
              : "No friends found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
