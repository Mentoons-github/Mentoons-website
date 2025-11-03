import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useStatusModal } from "@/context/adda/statusModalContext";
import { Clock, CheckCircle, XCircle } from "lucide-react";
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
        }
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
        }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-700 border-green-300";
      case "absent":
        return "bg-red-100 text-red-700 border-red-300";
      case "onLeave":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "halfDay":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-400";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
          Today's Attendance
        </h2>
        <div className="flex items-center gap-2 text-sm md:text-base">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="font-medium text-gray-700">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Check-in Time</p>
          <p className="text-xl font-bold text-blue-600">
            {formatTime(todayAttendance?.checkInTime)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Check-out Time</p>
          <p className="text-xl font-bold text-purple-600">
            {formatTime(todayAttendance?.checkOutTime)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Total Hours</p>
          <p className="text-xl font-bold text-green-600">
            {calculateWorkHours()}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <button
          onClick={handleCheckIn}
          disabled={todayAttendance?.checkInTime !== undefined}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
            todayAttendance?.checkInTime
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg"
          }`}
        >
          <CheckCircle className="w-5 h-5" />
          {todayAttendance?.checkInTime ? "Checked In" : "Check In"}
        </button>
        <button
          onClick={handleCheckOut}
          disabled={
            !todayAttendance?.checkInTime ||
            todayAttendance?.checkOutTime !== undefined
          }
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
            !todayAttendance?.checkInTime || todayAttendance?.checkOutTime
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg"
          }`}
        >
          <XCircle className="w-5 h-5" />
          {todayAttendance?.checkOutTime ? "Checked Out" : "Check Out"}
        </button>
      </div>
      {todayAttendance && todayAttendance.status !== "absent" && (
        <div
          className={`mt-4 p-3 rounded-lg text-center font-medium ${getStatusColor(
            todayAttendance.status
          )}`}
        >
          Status:{" "}
          {todayAttendance.status === "present"
            ? "On Time ✓"
            : todayAttendance.status === "halfDay"
            ? "Half Day"
            : "On Leave"}
          {todayAttendance.lateBy > 0 &&
            ` (Late by ${todayAttendance.lateBy} minutes)`}
          {todayAttendance.earlyLeave &&
            todayAttendance.earlyLeave > 0 &&
            ` (Early leave by ${todayAttendance.earlyLeave} minutes)`}
        </div>
      )}
    </div>
  );
};

export default TodayAttendance;
