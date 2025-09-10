import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchSessionEnquiries } from "@/redux/admin/sessionCall/thunkApi";
import { AppDispatch, RootState } from "@/redux/store";
import { ISessionCall } from "@/types/admin";

const SessionEnquiries = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.sessionCallAdmin
  );

  // State for modal and psychologist selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ISessionCall | null>(
    null
  );
  const [selectedPsychologist, setSelectedPsychologist] = useState<string>("");

  // Sample list of psychologists
  const psychologists = [
    {
      id: "1",
      name: "Dr. Jane Smith",
      specialty: "Cognitive Behavioral Therapy",
    },
    { id: "2", name: "Dr. Michael Brown", specialty: "Family Therapy" },
    { id: "3", name: "Dr. Sarah Johnson", specialty: "Trauma Counseling" },
    { id: "4", name: "Dr. David Lee", specialty: "Child Psychology" },
  ];

  useEffect(() => {
    const loadEnquiries = async () => {
      if (!isLoaded || !isSignedIn) {
        console.warn("User not signed in or Clerk not loaded");
        return;
      }

      try {
        const token = await getToken();
        if (token) {
          dispatch(fetchSessionEnquiries(token));
        }
      } catch (err) {
        console.error("Failed to get token:", err);
      }
    };

    loadEnquiries();
  }, [dispatch, getToken, isLoaded, isSignedIn]);

  const handleAllocate = (session: ISessionCall) => {
    setSelectedSession(session);
    setSelectedPsychologist(""); // Reset selection
    setIsModalOpen(true); // Open modal
  };

  const handleConfirmAllocation = () => {
    if (selectedSession && selectedPsychologist) {
      console.log(
        `Allocated session ${selectedSession._id} to psychologist: ${selectedPsychologist}`
      );
      // TODO: Dispatch Redux thunk to update session with selected psychologist
      // e.g., dispatch(allocateSession(token, selectedSession._id, selectedPsychologist));
    }
    setIsModalOpen(false); // Close modal
    setSelectedSession(null);
    setSelectedPsychologist("");
  };

  const handleCancel = (session: ISessionCall) => {
    console.log(`Cancel session ${session._id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "aborted":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "booked":
        return "✓";
      case "pending":
        return "⏳";
      case "completed":
        return "✅";
      case "cancelled":
        return "❌";
      case "aborted":
        return "🚫";
      default:
        return "○";
    }
  };

  const renderUserDetails = (user: string | any) => {
    if (typeof user === "string") {
      return <p className="text-gray-900 font-medium">User ID: {user}</p>;
    }

    const calculateAge = (dob: Date | string | undefined) => {
      if (!dob) return null;

      // Convert string to Date if needed (handles ISO strings like "2000-08-22T00:00:00.000+00:00")
      let date: Date;
      if (typeof dob === "string") {
        date = new Date(dob);
        // Check if the conversion was successful (invalid dates become Invalid Date)
        if (isNaN(date.getTime())) {
          return null;
        }
      } else if (dob instanceof Date) {
        date = dob;
      } else {
        return null;
      }

      const today = new Date("2025-09-09"); // Fixed date for consistency
      let age = today.getFullYear() - date.getFullYear();
      const monthDiff = today.getMonth() - date.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < date.getDate())
      ) {
        age--;
      }
      return age;
    };

    const age = calculateAge(user.dateOfBirth);
    return (
      <div className="space-y-1">
        <p className="text-gray-900 font-medium">{user.name}</p>
        {age !== null && (
          <p className="text-sm text-gray-600">Age: {age} years</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Session Call Allocation
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage and allocate therapy session requests
          </p>
          {data && data.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 shadow-sm border">
                Total: {data.length} sessions
              </span>
              <span className="bg-amber-100 px-3 py-1 rounded-full text-sm font-medium text-amber-700 border border-amber-200">
                Pending: {data.filter((s) => s.status === "pending").length}
              </span>
              <span className="bg-emerald-100 px-3 py-1 rounded-full text-sm font-medium text-emerald-700 border border-emerald-200">
                Booked: {data.filter((s) => s.status === "booked").length}
              </span>
              <span className="bg-blue-100 px-3 py-1 rounded-full text-sm font-medium text-blue-700 border border-blue-200">
                Completed: {data.filter((s) => s.status === "completed").length}
              </span>
              <span className="bg-rose-100 px-3 py-1 rounded-full text-sm font-medium text-rose-700 border border-rose-200">
                Cancelled: {data.filter((s) => s.status === "cancelled").length}
              </span>
              <span className="bg-red-100 px-3 py-1 rounded-full text-sm font-medium text-red-700 border border-red-200">
                Aborted: {data.filter((s) => s.status === "aborted").length}
              </span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading session enquiries...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-red-800">
                  Error Loading Data
                </h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data && data.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Session Enquiries
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are no session requests at the moment. New enquiries will
              appear here when submitted.
            </p>
          </div>
        )}

        {/* Allocation Modal */}
        {isModalOpen && selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Allocate Session
              </h2>
              <p className="text-gray-600 mb-4">
                Select a psychologist for session with {selectedSession.name}
              </p>
              <div className="mb-6">
                <label
                  htmlFor="psychologist"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Psychologist
                </label>
                <select
                  id="psychologist"
                  value={selectedPsychologist}
                  onChange={(e) => setSelectedPsychologist(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a psychologist
                  </option>
                  {psychologists.map((psych) => (
                    <option key={psych.id} value={psych.name}>
                      {psych.name} ({psych.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmAllocation}
                  disabled={!selectedPsychologist}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Session Cards Grid */}
        {!loading && !error && data && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.map((session) => (
              <div
                key={session._id}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {session.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {session.name}
                        </h3>
                        <p className="text-sm text-gray-500">Session Request</p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                        session.status
                      )}`}
                    >
                      <span className="mr-1">
                        {getStatusIcon(session.status)}
                      </span>
                      {session.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">👤</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          User
                        </p>
                        {renderUserDetails(session.user)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">📧</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Email
                        </p>
                        <p className="text-gray-900 font-medium">
                          {session.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">📱</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Phone
                        </p>
                        <p className="text-gray-900 font-medium">
                          {session.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-600">📅</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Date & Time
                        </p>
                        <p className="text-gray-900 font-medium">
                          {new Date(session.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">{session.time}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-6 pb-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAllocate(session)}
                      disabled={!["pending", "booked"].includes(session.status)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow group-hover:shadow-md"
                      title={
                        !["pending", "booked"].includes(session.status)
                          ? `Cannot allocate: Status is ${session.status}`
                          : "Allocate to psychologist"
                      }
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>👨‍⚕️</span>
                        Allocate
                      </span>
                    </button>
                    <button
                      onClick={() => handleCancel(session)}
                      disabled={
                        session.status === "completed" ||
                        session.status === "cancelled" ||
                        session.status === "aborted"
                      }
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2.5 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow group-hover:shadow-md"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span>✕</span>
                        Cancel
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionEnquiries;
