import React from "react";
import { TabType } from "@/types";

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-8">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-1 py-4 text-sm font-medium ${
            activeTab === "posts"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-1 py-4 text-sm font-medium ${
            activeTab === "about"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          About
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-1 py-4 text-sm font-medium ${
            activeTab === "friends"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Friends
        </button>
      </div>
    </div>
  );
};

export default ProfileTabs;
