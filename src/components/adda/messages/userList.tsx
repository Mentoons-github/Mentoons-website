import { useState } from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const users = [
    {
      id: 1,
      userName: "Neha Mathew",
      message:
        "Definitely! You could add more interactive features like typing indicators, read receipts...",
      profilePic: "https://avatar.iran.liara.run/public/94",
      lastSeen: "Online",
      unread: 1,
      isOnline: true,
      isPinned: true,
    },
    {
      id: 2,
      userName: "Shankar Patel",
      message:
        "Hi Devan, long time no see, how's your weekend is better i guess",
      profilePic: "https://avatar.iran.liara.run/public",
      lastSeen: "2 min ago",
      unread: 3,
      isOnline: true,
      isPinned: false,
    },
    {
      id: 3,
      userName: "Anjali Singh",
      message:
        "Hey, just wanted to check in. Hope everything's going well with you!",
      profilePic: "https://avatar.iran.liara.run/public/100",
      lastSeen: "Today",
      unread: 0,
      isOnline: false,
      isPinned: false,
    },
    {
      id: 4,
      userName: "Karthik Raman",
      message:
        "Devan, I saw your recent project updates, looking great! Let's catch up soon.",
      profilePic:
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
      lastSeen: "Yesterday",
      unread: 1,
      isOnline: false,
      isPinned: false,
    },
    {
      id: 5,
      userName: "Priya Sharma",
      message:
        "Hello Devan, how have you been? It's been a while since we last spoke.",
      profilePic: "https://avatar.iran.liara.run/public/97",
      lastSeen: "2 days ago",
      unread: 0,
      isOnline: false,
      isPinned: false,
    },
    {
      id: 6,
      userName: "Ravi Kumar",
      message:
        "Hi, just saw your post about the new project. Looks really exciting!",
      profilePic: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
      lastSeen: "3 days ago",
      unread: 0,
      isOnline: false,
      isPinned: false,
    },
    {
      id: 7,
      userName: "Vishal Verma",
      message:
        "Devan, it's been a while since we caught up. We should meet up soon.",
      profilePic: "https://robohash.org/mail@ashallendesign.co.uk",
      lastSeen: "2 weeks ago",
      unread: 0,
      isOnline: false,
      isPinned: false,
    },
    {
      id: 8,
      userName: "Nisha Reddy",
      message:
        "Hey Devan, how are things on your end? Let me know if you have some free time.",
      profilePic: "https://avatar.iran.liara.run/public/68",
      lastSeen: "3 weeks ago",
      unread: 0,
      isOnline: false,
      isPinned: false,
    },
    {
      id: 9,
      userName: "Suresh Menon",
      message:
        "Hi Devan, saw your recent updates. Let's chat soon about the next steps.",
      profilePic: "http://placebeard.it/250/250",
      lastSeen: "1 month ago",
      unread: 0,
      isOnline: false,
      isPinned: false,
    },
    {
      id: 10,
      userName: "Deepa Nair",
      message:
        "Hey Devan, long time! Hope everything's good on your side. We should connect.",
      profilePic: "https://avatar.iran.liara.run/public/90",
      lastSeen: "2 months ago",
      unread: 0,
      isOnline: false,
      isPinned: false,
    },
  ];

  const filteredUsers = users
    .filter((user) => {
      if (filter === "unread") return user.unread > 0;
      if (filter === "online") return user.isOnline;
      return true;
    })
    .filter(
      (user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.unread > b.unread) return -1;
    if (a.unread < b.unread) return 1;
    return 0;
  });

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
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "unread"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filter === "online"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => setFilter("online")}
          >
            Online
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
        {sortedUsers.length > 0 ? (
          sortedUsers.map((user) => (
            <div
              key={user.id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-200 
                ${
                  user.id === 1
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full object-cover">
                  <img
                    src={user.profilePic}
                    alt={user.userName}
                    className="w-full rounded-full"
                  />
                  {user.isOnline && (
                    <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full h-3 w-3"></span>
                  )}
                  {user.unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {user.unread}
                    </span>
                  )}
                </div>
                <div className="ml-3 max-w-[168px]">
                  <div className="flex items-center">
                    <h3
                      className={`font-medium ${
                        user.unread > 0
                          ? "text-gray-900 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {user.userName}
                    </h3>
                    {user.isPinned && (
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
                  <p
                    className={`text-sm truncate w-full ${
                      user.unread > 0
                        ? "text-gray-800 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {user.message}
                  </p>
                </div>
              </div>
              <div
                className={`text-xs whitespace-nowrap ${
                  user.unread > 0
                    ? "text-blue-600 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {user.lastSeen}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No conversations match your search
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
