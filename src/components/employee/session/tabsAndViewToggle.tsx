import React from "react";
import { TabsAndViewToggleProps } from "@/types/employee";

const TabsAndViewToggle: React.FC<TabsAndViewToggleProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  activeSessionsCount,
  completedSessionsCount,
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center">
        <button
          onClick={() => setActiveTab("not-completed")}
          className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all ${
            activeTab === "not-completed"
              ? "bg-blue-500 text-white border-b-2 border-blue-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📋 Active Sessions ({activeSessionsCount})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all ${
            activeTab === "completed"
              ? "bg-green-500 text-white border-b-2 border-green-600"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ✅ Completed Sessions ({completedSessionsCount})
        </button>
        <div className="p-4 flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "list"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
            } hover:bg-indigo-700 hover:text-white transition-all`}
          >
            📄 List View
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
            } hover:bg-indigo-700 hover:text-white transition-all`}
          >
            🖼️ Grid View
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabsAndViewToggle;