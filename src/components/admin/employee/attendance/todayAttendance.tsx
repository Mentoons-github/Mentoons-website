import { AdminAttendanceRecord } from "@/types/employee";

interface TodayAttendanceProps {
  todayAttendance: AdminAttendanceRecord | null;
}

const TodayAttendance: React.FC<TodayAttendanceProps> = ({
  todayAttendance,
}) => {
  if (!todayAttendance) return null;

  const formatTime = (time: string | undefined): string => {
    if (!time) return "--:--:--";
    const date = new Date(time);
    return date instanceof Date && !isNaN(date.getTime())
      ? date.toLocaleTimeString()
      : "--:--:--";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Today's Attendance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Check-in Time</p>
          <p className="text-xl font-bold text-blue-600">
            {formatTime(todayAttendance.checkInTime)}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-600 mb-1">Check-out Time</p>
          <p className="text-xl font-bold text-purple-600">
            {formatTime(todayAttendance.checkOutTime)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600 mb-1">Total Hours</p>
          <p className="text-xl font-bold text-green-600">
            {Math.floor(todayAttendance.workHours)}h{" "}
            {Math.floor((todayAttendance.workHours % 1) * 60)}m
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodayAttendance;
