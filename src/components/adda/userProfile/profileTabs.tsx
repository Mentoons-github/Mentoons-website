import { TabType } from "@/types";
import React from "react";
import { FiAward } from "react-icons/fi";

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  friendBlocked: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  friendBlocked,
}) => {
  if (friendBlocked) return null;
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-1 py-4 text-sm font-medium ${
            activeTab === "posts"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-1 py-4 text-sm font-medium ${
            activeTab === "about"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          About
        </button>
        {/* <button
          onClick={() => setActiveTab("friends")}
          className={`px-1 py-4 text-sm font-medium ${
            activeTab === "friends"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Friends
        </button> */}
        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-1 py-4 text-sm font-medium flex items-center ${
            activeTab === "rewards"
              ? "border-b-2 border-orange-500 text-orange-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          <FiAward className="mr-1" /> Rewards
        </button>
      </div>
    </div>
  );
};

export default ProfileTabs;
