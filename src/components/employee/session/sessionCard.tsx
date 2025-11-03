import React from "react";
import { SessionCardProps } from "@/types/employee";

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  viewMode,
  expanded,
  toggleSessionDetails,
  openCompleteModal,
  cancelSession,
}) => {
  const statusStyles = {
    booked: "bg-blue-100 text-blue-700 border border-blue-200",
    pending: "bg-orange-100 text-orange-700 border border-orange-200",
    completed: "bg-green-100 text-green-700 border border-green-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
    aborted: "bg-purple-100 text-purple-700 border border-purple-200",
  };

  return (
    <div
      className={`bg-white border-2 border-gray-200 rounded-xl ${
        viewMode === "list" ? "mb-6" : ""
      } shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
    >
      <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100 flex justify-between items-center">
        <div>
          <div className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-3">
            👤 {session.name}
          </div>
          <div className="text-indigo-600 font-semibold text-lg">
            📅 {formatDate(session.date)} at {session.time}
          </div>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-md ${
            statusStyles[session.status]
          }`}
        >
          {session.status}
        </span>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="block text-xs uppercase text-gray-500 tracking-wide font-bold mb-1">
              📞 Phone
            </span>
            <span className="font-semibold text-gray-800">{session.phone}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="block text-xs uppercase text-gray-500 tracking-wide font-bold mb-1">
              📧 Email
            </span>
            <span className="font-semibold text-gray-800 text-sm">{session.email}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <span className="block text-xs uppercase text-gray-500 tracking-wide font-bold mb-1">
              📍 State
            </span>
            <span className="font-semibold text-gray-800">{session.state}</span>
          </div>
          {session.completedAt && (
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="block text-xs uppercase text-green-600 tracking-wide font-bold mb-1">
                ✅ Completed At
              </span>
              <span className="font-semibold text-green-800 text-sm">
                {new Date(session.completedAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        {session.description && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-indigo-500 mb-4">
            <h4 className="text-indigo-800 font-bold mb-2 text-lg">🩺 Session Description</h4>
            <p className="text-gray-700 leading-relaxed">{session.description}</p>
          </div>
        )}
        {session.status === "completed" && session.diagnosis && (
          <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-green-800 font-bold text-lg">📋 Session Summary</h4>
              <button
                onClick={() => toggleSessionDetails(session._id!)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-semibold"
              >
                {expanded ? "🔼 Hide Details" : "🔽 Full Details"}
              </button>
            </div>
            {typeof session.psychologistId !== "string" && session.psychologistId && (
              <div className="bg-white p-3 rounded-md mb-3">
                <span className="text-sm uppercase text-green-600 tracking-wide font-bold">
                  👨‍⚕️ Doctor:
                </span>
                <p className="text-gray-800 font-semibold mt-1">
                  {session.psychologistId.name}
                </p>
              </div>
            )}
            {expanded && (
              <div className="space-y-3 animate-in slide-in-from-top duration-200">
                {session.diagnosis.symptoms && (
                  <div className="bg-white p-3 rounded-md border-l-4 border-red-300">
                    <span className="text-sm uppercase text-green-600 tracking-wide font-bold">
                      🩺 Symptoms (ID: {session.diagnosis._id}):
                    </span>
                    <p className="text-gray-700 mt-1 leading-relaxed">
                      {session.diagnosis.symptoms}
                    </p>
                  </div>
                )}
                {session.diagnosis.remedies && (
                  <div className="bg-white p-3 rounded-md border-l-4 border-green-300">
                    <span className="text-sm uppercase text-green-600 tracking-wide font-bold">
                      💊 Treatment (ID: {session.diagnosis._id}):
                    </span>
                    <p className="text-gray-700 mt-1 leading-relaxed">
                      {session.diagnosis.remedies}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-3 justify-end pt-4 border-t-2 border-gray-100">
          <a
            href={`tel:${session.phone}`}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center font-semibold shadow-md hover:shadow-lg"
          >
            📞 Call Client
          </a>
          <a
            href={`mailto:${session.email}`}
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center font-semibold shadow-md hover:shadow-lg"
          >
            📧 Email
          </a>
          {session.status !== "completed" && session.status !== "cancelled" && (
            <>
              <button
                onClick={() => openCompleteModal(session._id!)}
                className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center font-semibold shadow-md hover:shadow-lg"
              >
                ✅ Complete Session
              </button>
              <button
                onClick={() => cancelSession(session._id!)}
                className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center font-semibold shadow-md hover:shadow-lg"
              >
                ❌ Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;