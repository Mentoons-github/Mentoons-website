import React, { useState } from "react";

interface Session {
  _id: string;
  sessionId?: string;
  name: string;
  state: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  status: "booked" | "pending" | "completed" | "cancelled" | "aborted";
  description: string;
  completedAt?: Date;
  doctorName?: string;
  symptoms?: string;
  symptomsId?: string;
  remedies?: string;
  remediesId?: string;
}

const initialSessions: Session[] = [
  {
    _id: "1",
    name: "Arjun Sharma",
    state: "Maharashtra",
    phone: "+91-9876543210",
    email: "arjun.sharma@example.com",
    date: new Date("2024-09-10"),
    time: "10:00 AM",
    status: "booked",
    description:
      "Consultation for mobile phone addiction. Client reports excessive screen time affecting sleep and productivity.",
  },
  {
    _id: "2",
    name: "Priya Patel",
    state: "Gujarat",
    phone: "+91-8765432109",
    email: "priya.patel@example.com",
    date: new Date("2024-09-10"),
    time: "2:00 PM",
    status: "pending",
    description:
      "Follow-up session for online gambling addiction. Review of relapse triggers and coping mechanisms.",
  },
  {
    _id: "3",
    sessionId: "847",
    name: "Vikram Singh",
    state: "Rajasthan",
    phone: "+91-7654321098",
    email: "vikram.singh@example.com",
    date: new Date("2024-09-11"),
    time: "11:30 AM",
    status: "completed",
    description:
      "Therapy session addressing gaming addiction. Focus on balancing leisure activities with daily responsibilities.",
    completedAt: new Date("2024-09-09"),
    doctorName: "Dr. Sarah Johnson",
    symptoms:
      "Excessive gaming, irritability when not playing, neglect of social interactions",
    symptomsId: "101",
    remedies:
      "Scheduled gaming hours, mindfulness practices, engaging in offline hobbies",
    remediesId: "102",
  },
];

const generateThreeDigitId = (existingIds: string[]): string => {
  let newId: number;
  do {
    newId = Math.floor(100 + Math.random() * 900);
  } while (existingIds.includes(newId.toString()));
  return newId.toString();
};

const PsychologistTask: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [activeTab, setActiveTab] = useState<"not-completed" | "completed">(
    "not-completed"
  );
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string>("");
  const [symptoms, setSymptoms] = useState<string>("");
  const [remedies, setRemedies] = useState<string>("");
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Update stats
  const getStats = (): {
    total: number;
    pending: number;
    today: number;
    completed: number;
  } => {
    const total = sessions.length;
    const pending = sessions.filter(
      (s) => s.status === "pending" || s.status === "booked"
    ).length;
    const today = sessions.filter((s) => isToday(new Date(s.date))).length;
    const completed = sessions.filter((s) => s.status === "completed").length;
    return { total, pending, today, completed };
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFilteredSessions = (): Session[] => {
    const tabFilteredSessions = sessions.filter((session) => {
      if (activeTab === "completed") {
        return session.status === "completed";
      } else {
        return session.status !== "completed";
      }
    });

    return tabFilteredSessions.filter((session) => {
      const statusMatch = !statusFilter || session.status === statusFilter;
      const dateMatch =
        !dateFilter ||
        new Date(session.date).toDateString() ===
          new Date(dateFilter).toDateString();
      const searchMatch =
        !searchFilter ||
        session.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        session.phone.includes(searchFilter);
      return statusMatch && dateMatch && searchMatch;
    });
  };

  const toggleSessionDetails = (sessionId: string): void => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const openCompleteModal = (sessionId: string): void => {
    setCurrentSessionId(sessionId);
    setDoctorName("");
    setSymptoms("");
    setRemedies("");
    setShowModal(true);
  };

  const completeSession = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    if (!currentSessionId) return;

    const sessionIndex = sessions.findIndex((s) => s._id === currentSessionId);
    if (sessionIndex === -1) return;

    const existingIds = sessions.flatMap((s) =>
      [s.symptomsId, s.remediesId, s.sessionId].filter(Boolean)
    ) as string[];

    const sessionId = generateThreeDigitId(existingIds);
    const symptomsId = generateThreeDigitId([...existingIds, sessionId]);
    const remediesId = generateThreeDigitId([
      ...existingIds,
      sessionId,
      symptomsId,
    ]);

    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex] = {
      ...updatedSessions[sessionIndex],
      status: "completed",
      sessionId: sessionId,
      completedAt: new Date(),
      doctorName: doctorName,
      symptoms: symptoms,
      symptomsId: symptomsId,
      remedies: remedies,
      remediesId: remediesId,
    };

    setSessions(updatedSessions);
    setShowModal(false);
    setCurrentSessionId(null);
    alert(
      `Session completed successfully! Session ID: ${sessionId}, Symptoms ID: ${symptomsId}, Remedies ID: ${remediesId}`
    );
  };

  const cancelSession = (sessionId: string): void => {
    if (!window.confirm("Are you sure you want to cancel this session?"))
      return;

    const sessionIndex = sessions.findIndex((s) => s._id === sessionId);
    if (sessionIndex === -1) return;

    const updatedSessions = [...sessions];
    updatedSessions[sessionIndex].status = "cancelled";
    setSessions(updatedSessions);
  };

  const getCurrentSession = (): Session | null => {
    if (!currentSessionId) return null;
    return sessions.find((s) => s._id === currentSessionId) || null;
  };

  const stats = getStats();

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-800 text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">🧠</span> Psychology Consultation
            Dashboard
          </h1>
          <p className="text-lg opacity-90">
            Manage your client sessions and consultations
          </p>
        </div>

        {/* Stats Bar */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex flex-wrap justify-around border-b border-gray-200">
          {[
            {
              label: "Total Sessions",
              value: stats.total,
              icon: "📊",
              color: "text-blue-600",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: "⏳",
              color: "text-orange-600",
            },
            {
              label: "Today",
              value: stats.today,
              icon: "📅",
              color: "text-purple-600",
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: "✅",
              color: "text-green-600",
            },
          ].map((stat, index) => (
            <div key={index} className="text-center mb-4 sm:mb-0">
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm uppercase text-gray-600 tracking-wide font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs and View Toggle */}
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
              📋 Active Sessions (
              {sessions.filter((s) => s.status !== "completed").length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 py-4 px-6 text-center font-semibold text-lg transition-all ${
                activeTab === "completed"
                  ? "bg-green-500 text-white border-b-2 border-green-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ✅ Completed Sessions (
              {sessions.filter((s) => s.status === "completed").length})
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

        {/* Filters */}
        <div className="bg-white p-6 flex flex-wrap gap-4 border-b border-gray-200 shadow-sm">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📋 Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatusFilter(e.target.value)
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">All Statuses</option>
              {activeTab === "not-completed" ? (
                <>
                  <option value="booked">Booked</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="aborted">Aborted</option>
                </>
              ) : (
                <option value="completed">Completed</option>
              )}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Date Filter
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDateFilter(e.target.value)
              }
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔍 Search Client
            </label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchFilter(e.target.value)
              }
              placeholder="Search by name or phone..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Sessions */}
        <div className="p-6">
          {getFilteredSessions().length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-8xl mb-6">
                {activeTab === "completed" ? "✅" : "📅"}
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                No {activeTab === "completed" ? "completed" : "active"} sessions
                found
              </h3>
              <p className="text-lg">
                No sessions match your current filters in the{" "}
                {activeTab === "completed" ? "completed" : "active"} tab.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredSessions().map((session) => (
                <div
                  key={session._id}
                  className="bg-white border-2 border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        👤 {session.name}
                        {session.sessionId && (
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-bold">
                            #{session.sessionId}
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm
                          ${
                            session.status === "booked"
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : session.status === "pending"
                              ? "bg-orange-100 text-orange-700 border border-orange-200"
                              : session.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : session.status === "cancelled"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-purple-100 text-purple-700 border border-purple-200"
                          }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <div className="text-indigo-600 font-semibold text-sm">
                      📅 {formatDate(session.date)} at {session.time}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="block text-xs uppercase text-gray-500 font-bold">
                          📞 Phone
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {session.phone}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="block text-xs uppercase text-gray-500 font-bold">
                          📧 Email
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {session.email}
                        </span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <span className="block text-xs uppercase text-gray-500 font-bold">
                          📍 State
                        </span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {session.state}
                        </span>
                      </div>
                      {session.completedAt && (
                        <div className="bg-green-50 p-2 rounded-lg">
                          <span className="block text-xs uppercase text-green-600 font-bold">
                            ✅ Completed
                          </span>
                          <span className="font-semibold text-green-800 text-sm">
                            {new Date(session.completedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {session.description && (
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-indigo-500 mb-4">
                        <h4 className="text-indigo-800 font-bold text-sm mb-1">
                          🩺 Description
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {session.description}
                        </p>
                      </div>
                    )}
                    {session.status === "completed" && (
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500 mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-green-800 font-bold text-sm">
                            📋 Summary
                          </h4>
                          <button
                            onClick={() => toggleSessionDetails(session._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-all"
                          >
                            {expandedSessions.has(session._id)
                              ? "🔼 Hide"
                              : "🔽 Details"}
                          </button>
                        </div>
                        {session.doctorName && (
                          <div className="bg-white p-2 rounded-md mb-2">
                            <span className="text-xs uppercase text-green-600 font-bold">
                              👨‍⚕️ Doctor:
                            </span>
                            <p className="text-gray-800 text-sm font-semibold">
                              {session.doctorName}
                            </p>
                          </div>
                        )}
                        {expandedSessions.has(session._id) && (
                          <div className="space-y-2">
                            {session.symptoms && (
                              <div className="bg-white p-2 rounded-md border-l-2 border-red-300">
                                <span className="text-xs uppercase text-green-600 font-bold">
                                  🩺 Symptoms (ID: {session.symptomsId}):
                                </span>
                                <p className="text-gray-700 text-sm">
                                  {session.symptoms}
                                </p>
                              </div>
                            )}
                            {session.remedies && (
                              <div className="bg-white p-2 rounded-md border-l-2 border-green-300">
                                <span className="text-xs uppercase text-green-600 font-bold">
                                  💊 Treatment (ID: {session.remediesId}):
                                </span>
                                <p className="text-gray-700 text-sm">
                                  {session.remedies}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 justify-end">
                      <a
                        href={`tel:${session.phone}`}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all font-semibold"
                      >
                        📞 Call
                      </a>
                      <a
                        href={`mailto:${session.email}`}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all font-semibold"
                      >
                        📧 Email
                      </a>
                      {session.status !== "completed" &&
                        session.status !== "cancelled" && (
                          <>
                            <button
                              onClick={() => openCompleteModal(session._id)}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-all font-semibold"
                            >
                              ✅ Complete
                            </button>
                            <button
                              onClick={() => cancelSession(session._id)}
                              className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all font-semibold"
                            >
                              ❌ Cancel
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            getFilteredSessions().map((session) => (
              <div
                key={session._id}
                className="bg-white border-2 border-gray-200 rounded-xl mb-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 border-b-2 border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                  <div>
                    <div className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-3">
                      👤 {session.name}
                      {session.sessionId && (
                        <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold">
                          #{session.sessionId}
                        </span>
                      )}
                    </div>
                    <div className="text-indigo-600 font-semibold text-lg">
                      📅 {formatDate(session.date)} at {session.time}
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-md
                      ${
                        session.status === "booked"
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                          : session.status === "pending"
                          ? "bg-orange-100 text-orange-700 border-2 border-orange-200"
                          : session.status === "completed"
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : session.status === "cancelled"
                          ? "bg-red-100 text-red-700 border-2 border-red-200"
                          : "bg-purple-100 text-purple-700 border-2 border-purple-200"
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
                      <span className="font-semibold text-gray-800">
                        {session.phone}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-xs uppercase text-gray-500 tracking-wide font-bold mb-1">
                        📧 Email
                      </span>
                      <span className="font-semibold text-gray-800 text-sm">
                        {session.email}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-xs uppercase text-gray-500 tracking-wide font-bold mb-1">
                        📍 State
                      </span>
                      <span className="font-semibold text-gray-800">
                        {session.state}
                      </span>
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
                      <h4 className="text-indigo-800 font-bold mb-2 text-lg">
                        🩺 Session Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {session.description}
                      </p>
                    </div>
                  )}
                  {session.status === "completed" && (
                    <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-green-800 font-bold text-lg">
                          📋 Session Summary
                        </h4>
                        <button
                          onClick={() => toggleSessionDetails(session._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-semibold"
                        >
                          {expandedSessions.has(session._id)
                            ? "🔼 Hide Details"
                            : "🔽 Full Details"}
                        </button>
                      </div>
                      {session.doctorName && (
                        <div className="bg-white p-3 rounded-md mb-3">
                          <span className="text-sm uppercase text-green-600 tracking-wide font-bold">
                            👨‍⚕️ Doctor:
                          </span>
                          <p className="text-gray-800 font-semibold mt-1">
                            {session.doctorName}
                          </p>
                        </div>
                      )}
                      {expandedSessions.has(session._id) && (
                        <div className="space-y-3 animate-in slide-in-from-top duration-200">
                          {session.symptoms && (
                            <div className="bg-white p-3 rounded-md border-l-4 border-red-300">
                              <span className="text-sm uppercase text-green-600 tracking-wide font-bold">
                                🩺 Symptoms (ID: {session.symptomsId}):
                              </span>
                              <p className="text-gray-700 mt-1 leading-relaxed">
                                {session.symptoms}
                              </p>
                            </div>
                          )}
                          {session.remedies && (
                            <div className="bg-white p-3 rounded-md border-l-4 border-green-300">
                              <span className="text-sm uppercase text-green-600 tracking-wide font-bold">
                                💊 Treatment (ID: {session.remediesId}):
                              </span>
                              <p className="text-gray-700 mt-1 leading-relaxed">
                                {session.remedies}
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
                    {session.status !== "completed" &&
                      session.status !== "cancelled" && (
                        <>
                          <button
                            onClick={() => openCompleteModal(session._id)}
                            className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center font-semibold shadow-md hover:shadow-lg"
                          >
                            ✅ Complete Session
                          </button>
                          <button
                            onClick={() => cancelSession(session._id)}
                            className="px-5 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center font-semibold shadow-md hover:shadow-lg"
                          >
                            ❌ Cancel
                          </button>
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Complete Session Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                  ✅ Complete Session
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ❌
                </button>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-100">
                  <h4 className="text-lg font-bold text-blue-800 mb-4">
                    👥 Session Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        👤 Patient Name
                      </label>
                      <input
                        type="text"
                        value={getCurrentSession()?.name || ""}
                        readOnly
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm bg-gray-100 text-gray-700 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        👨‍⚕️ Doctor Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={doctorName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setDoctorName(e.target.value)
                        }
                        placeholder="Enter doctor's name"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-xl border-2 border-red-100">
                  <label className="block text-lg font-bold text-red-800 mb-3">
                    🩺 Patient Symptoms <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setSymptoms(e.target.value)
                    }
                    placeholder="Describe the patient's symptoms, concerns, and observations in detail..."
                    className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-y transition-all"
                  />
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-2 border-green-100">
                  <label className="block text-lg font-bold text-green-800 mb-3">
                    💊 Prescribed Treatment & Remedies{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={remedies}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setRemedies(e.target.value)
                    }
                    placeholder="Enter prescribed medications, therapy recommendations, lifestyle changes, follow-up instructions, and treatment plan..."
                    className="w-full min-h-[140px] p-4 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-y transition-all"
                  />
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t-2 border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-semibold shadow-md"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={completeSession}
                    disabled={
                      !doctorName.trim() || !symptoms.trim() || !remedies.trim()
                    }
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold shadow-md"
                  >
                    ✅ Complete Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PsychologistTask;
