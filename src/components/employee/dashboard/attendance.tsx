import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useStatusModal } from "@/context/adda/statusModalContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Timer,
  Calendar,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { AttendanceRecord } from "@/types/employee";

interface TodayAttendanceProps {
  todayAttendance: AttendanceRecord | null;
  currentTime: Date;
  fetchAttendanceData: () => Promise<void>;
}

const BASE_URL = `${import.meta.env.VITE_PROD_URL}/attendance`;

const TodayAttendance = ({
  todayAttendance,
  currentTime,
  fetchAttendanceData,
}: TodayAttendanceProps) => {
  const { getToken } = useAuth();
  const { showStatus } = useStatusModal();

  const handleCheckIn = async () => {
    if (todayAttendance?.checkInTime) {
      showStatus("error", "You have already checked in today!");
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/check-in`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        showStatus("success", "Successfully checked in!");
        await fetchAttendanceData();
      }
    } catch (error: any) {
      console.error("Error checking in:", error);
      showStatus("error", error.response?.data?.error || "Error checking in");
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance?.checkInTime) {
      showStatus("error", "Please check in first!");
      return;
    }
    if (todayAttendance?.checkOutTime) {
      showStatus("error", "You have already checked out today!");
      return;
    }
    try {
      const token = await getToken();
      if (!token) {
        showStatus("error", "Authentication error. Please log in again.");
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/check-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        showStatus("success", "Successfully checked out!");
        await fetchAttendanceData();
      }
    } catch (error: any) {
      console.error("Error checking out:", error);
      showStatus("error", error.response?.data?.error || "Error checking out");
    }
  };

  const formatTime = (dateString?: string): string => {
    if (!dateString) return "--:--:--";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const calculateWorkHours = (): string => {
    if (!todayAttendance?.workHours) return "0h 0m";
    const hours = Math.floor(todayAttendance.workHours);
    const minutes = Math.floor((todayAttendance.workHours % 1) * 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return {
          bg: "bg-gradient-to-br from-green-50 to-emerald-50",
          border: "border-green-300",
          text: "text-green-700",
          icon: CheckCircle,
          label: "On Time ✓",
          gradient: "from-green-500 to-emerald-600",
        };
      case "absent":
        return {
          bg: "bg-gradient-to-br from-red-50 to-rose-50",
          border: "border-red-300",
          text: "text-red-700",
          icon: XCircle,
          label: "Absent",
          gradient: "from-red-500 to-rose-600",
        };
      case "onLeave":
        return {
          bg: "bg-gradient-to-br from-purple-50 to-violet-50",
          border: "border-purple-300",
          text: "text-purple-700",
          icon: Calendar,
          label: "On Leave",
          gradient: "from-purple-500 to-violet-600",
        };
      case "halfDay":
        return {
          bg: "bg-gradient-to-br from-yellow-50 to-amber-50",
          border: "border-yellow-300",
          text: "text-yellow-700",
          icon: AlertCircle,
          label: "Half Day",
          gradient: "from-yellow-500 to-amber-600",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-50 to-slate-50",
          border: "border-gray-300",
          text: "text-gray-700",
          icon: Clock,
          label: "Not Marked",
          gradient: "from-gray-500 to-slate-600",
        };
    }
  };

  const statusConfig = todayAttendance
    ? getStatusConfig(todayAttendance.status)
    : getStatusConfig("default");
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-white/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Today's Attendance
            </h2>
            <p className="text-sm text-gray-600">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg">
          <Clock className="w-5 h-5" />
          <span className="font-bold text-lg">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all">
          <div className="absolute top-3 right-3">
            <LogIn className="w-5 h-5 text-blue-600 opacity-50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              Check-in Time
            </p>
            <p className="text-3xl font-bold text-blue-700">
              {formatTime(todayAttendance?.checkInTime)}
            </p>
            {todayAttendance?.checkInTime && (
              <p className="text-xs text-blue-600 mt-2">
                Logged in successfully
              </p>
            )}
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all">
          <div className="absolute top-3 right-3">
            <LogOut className="w-5 h-5 text-purple-600 opacity-50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              Check-out Time
            </p>
            <p className="text-3xl font-bold text-purple-700">
              {formatTime(todayAttendance?.checkOutTime)}
            </p>
            {todayAttendance?.checkOutTime && (
              <p className="text-xs text-purple-600 mt-2">
                Logged out successfully
              </p>
            )}
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all">
          <div className="absolute top-3 right-3">
            <Timer className="w-5 h-5 text-green-600 opacity-50" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              Total Hours
            </p>
            <p className="text-3xl font-bold text-green-700">
              {calculateWorkHours()}
            </p>
            {todayAttendance?.workHours && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <p className="text-xs text-green-600">Productive day</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleCheckIn}
          disabled={todayAttendance?.checkInTime !== undefined}
          className={`group relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all overflow-hidden ${
            todayAttendance?.checkInTime
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl hover:shadow-green-200 hover:scale-105"
          }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 ${
              todayAttendance?.checkInTime
                ? ""
                : "group-hover:translate-x-full transition-transform duration-700"
            }`}
          ></div>
          <LogIn className="w-6 h-6 relative z-10" />
          <span className="relative z-10">
            {todayAttendance?.checkInTime ? "Already Checked In" : "Check In"}
          </span>
        </button>

        <button
          onClick={handleCheckOut}
          disabled={
            !todayAttendance?.checkInTime ||
            todayAttendance?.checkOutTime !== undefined
          }
          className={`group relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all overflow-hidden ${
            !todayAttendance?.checkInTime || todayAttendance?.checkOutTime
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:shadow-2xl hover:shadow-red-200 hover:scale-105"
          }`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 ${
              !todayAttendance?.checkInTime || todayAttendance?.checkOutTime
                ? ""
                : "group-hover:translate-x-full transition-transform duration-700"
            }`}
          ></div>
          <LogOut className="w-6 h-6 relative z-10" />
          <span className="relative z-10">
            {todayAttendance?.checkOutTime
              ? "Already Checked Out"
              : "Check Out"}
          </span>
        </button>
      </div>

      {todayAttendance && todayAttendance.status !== "absent" && (
        <div
          className={`relative p-6 rounded-xl border-2 ${statusConfig.border} ${statusConfig.bg} overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 bg-gradient-to-br ${statusConfig.gradient} rounded-xl flex items-center justify-center shadow-lg`}
              >
                <StatusIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Current Status
                </p>
                <p className={`text-2xl font-bold ${statusConfig.text}`}>
                  {statusConfig.label}
                </p>
              </div>
            </div>
            <div className="text-right">
              {todayAttendance.lateBy > 0 && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-2 border border-red-300">
                  <p className="text-xs font-semibold">Late Arrival</p>
                  <p className="text-lg font-bold">
                    {todayAttendance.lateBy} min
                  </p>
                </div>
              )}
              {todayAttendance.earlyLeave && todayAttendance.earlyLeave > 0 && (
                <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg border border-orange-300">
                  <p className="text-xs font-semibold">Early Leave</p>
                  <p className="text-lg font-bold">
                    {todayAttendance.earlyLeave} min
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayAttendance;
