import React from "react";
import { SessionListProps } from "@/types/employee";
import SessionCard from "./sessionCard";

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  viewMode,
  isLoading,
  error,
  activeTab,
  expandedSessions,
  toggleSessionDetails,
  openCompleteModal,
  cancelSession,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-8xl mb-6">⏳</div>
        <h3 className="text-2xl font-semibold mb-2">Loading sessions...</h3>
        <p className="text-lg">Please wait while we fetch your sessions.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-8xl mb-6">❌</div>
        <h3 className="text-2xl font-semibold mb-2">Error</h3>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <div className="text-8xl mb-6">
          {activeTab === "completed" ? "✅" : "📅"}
        </div>
        <h3 className="text-2xl font-semibold mb-2">
          No {activeTab === "completed" ? "completed" : "active"} sessions found
        </h3>
        <p className="text-lg">
          No sessions match your current filters in the{" "}
          {activeTab === "completed" ? "completed" : "active"} tab.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-6 ${
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          : ""
      }`}
    >
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          viewMode={viewMode}
          expanded={expandedSessions.has(session._id!)}
          toggleSessionDetails={toggleSessionDetails}
          openCompleteModal={openCompleteModal}
          cancelSession={cancelSession}
        />
      ))}
    </div>
  );
};

export default SessionList;
