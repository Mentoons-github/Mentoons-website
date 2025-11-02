import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminAttendanceRecord } from "@/types/employee";

interface AttendanceCalendarProps {
  currentMonth: Date;
  allAttendance: AdminAttendanceRecord[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  currentMonth,
  allAttendance,
  onPreviousMonth,
  onNextMonth,
}) => {
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return allAttendance.find(
      (att) => att.date && att.date.split("T")[0] === dateStr
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 border border-gray-200"></div>
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const attendance = getAttendanceForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      days.push(
        <div
          key={day}
          className={`h-20 border border-gray-200 p-2 ${
            isToday ? "ring-2 ring-blue-500" : ""
          } ${attendance ? getStatusColor(attendance.status) : "bg-white"}`}
        >
          <div className="font-semibold text-sm">{day}</div>
          {attendance && (
            <div className="text-xs mt-1">
              <div className="capitalize">{attendance.status}</div>
              {attendance.lateBy > 0 && (
                <div className="text-red-600">Late: {attendance.lateBy}m</div>
              )}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={onNextMonth} className="p-2 hover:bg-gray-100 rounded">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="font-semibold text-center py-2 bg-gray-100 border border-gray-200"
          >
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border border-purple-300"></div>
          <span>On Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300"></div>
          <span>Half Day</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
