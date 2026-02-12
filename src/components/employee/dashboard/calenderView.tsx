import { AttendanceRecord } from "@/types/employee";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Sun,
} from "lucide-react";

interface CalendarViewProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  allAttendance: AttendanceRecord[];
}

const CalendarView = ({
  currentMonth,
  setCurrentMonth,
  allAttendance,
}: CalendarViewProps) => {
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
      (att) => att.date && att.date.split("T")[0] === dateStr,
    );
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "present":
        return {
          bg: "bg-gradient-to-br from-green-100 to-emerald-100",
          border: "border-green-400",
          text: "text-green-800",
          icon: CheckCircle,
          label: "Present",
          dot: "bg-green-500",
        };
      case "absent":
        return {
          bg: "bg-gradient-to-br from-red-100 to-rose-100",
          border: "border-red-400",
          text: "text-red-800",
          icon: XCircle,
          label: "Absent",
          dot: "bg-red-500",
        };
      case "onLeave":
        return {
          bg: "bg-gradient-to-br from-purple-100 to-violet-100",
          border: "border-purple-400",
          text: "text-purple-800",
          icon: Sun,
          label: "Leave",
          dot: "bg-purple-500",
        };
      case "halfDay":
        return {
          bg: "bg-gradient-to-br from-yellow-100 to-amber-100",
          border: "border-yellow-400",
          text: "text-yellow-800",
          icon: Clock,
          label: "Half Day",
          dot: "bg-yellow-500",
        };
      default:
        return {
          bg: "bg-white",
          border: "border-gray-200",
          text: "text-gray-600",
          icon: Calendar,
          label: "No Data",
          dot: "bg-gray-400",
        };
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 md:h-28 bg-gray-50 border-2 border-gray-100 rounded-lg"
        ></div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      const attendance = getAttendanceForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isFuture = date > new Date();
      const statusConfig = attendance
        ? getStatusConfig(attendance.status)
        : getStatusConfig("default");
      const StatusIcon = statusConfig.icon;

      days.push(
        <div
          key={day}
          className={`group h-24 md:h-28 border-2 rounded-xl p-2 md:p-3 transition-all hover:shadow-lg ${
            isToday ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg" : ""
          } ${
            isFuture
              ? "bg-gray-50 border-gray-200 opacity-50"
              : attendance
                ? `${statusConfig.bg} ${statusConfig.border} hover:scale-105`
                : "bg-white border-gray-200 hover:border-blue-300"
          }`}
        >
          <div className="flex items-start justify-between mb-1">
            <div
              className={`flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg font-bold text-sm md:text-base ${
                isToday
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md"
                  : attendance
                    ? `${statusConfig.text} bg-white/50`
                    : "text-gray-700"
              }`}
            >
              {day}
            </div>
            {attendance && (
              <div
                className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}
              ></div>
            )}
          </div>

          {attendance && !isFuture && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <StatusIcon
                  className={`w-3 h-3 md:w-4 md:h-4 ${statusConfig.text}`}
                />
                <span
                  className={`text-[10px] md:text-xs font-bold ${statusConfig.text} capitalize truncate`}
                >
                  {statusConfig.label}
                </span>
              </div>
              {attendance.lateBy > 0 && (
                <div className="flex items-center gap-1 bg-red-200 text-red-800 px-2 py-0.5 rounded text-[9px] md:text-[10px] font-semibold">
                  <Clock className="w-2.5 h-2.5" />
                  Late {attendance.lateBy}m
                </div>
              )}
              {attendance.earlyLeave && attendance.earlyLeave > 0 && (
                <div className="flex items-center gap-1 bg-orange-200 text-orange-800 px-2 py-0.5 rounded text-[9px] md:text-[10px] font-semibold">
                  <Clock className="w-2.5 h-2.5" />
                  Early {attendance.earlyLeave}m
                </div>
              )}
            </div>
          )}

          {isFuture && (
            <div className="flex items-center justify-center h-12">
              <span className="text-xs text-gray-400">Upcoming</span>
            </div>
          )}
        </div>,
      );
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-white/50">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <p className="text-sm text-gray-600">Monthly attendance calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToPreviousMonth}
            className="p-3 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white rounded-xl border-2 border-gray-200 hover:border-transparent transition-all shadow-md hover:shadow-lg group"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-white" />
          </button>

          <button
            onClick={goToToday}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Today
          </button>

          <button
            onClick={goToNextMonth}
            className="p-3 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white rounded-xl border-2 border-gray-200 hover:border-transparent transition-all shadow-md hover:shadow-lg group"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 md:gap-3">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className={`font-bold text-center py-3 rounded-lg text-sm md:text-base ${
              index === 0 || index === 6
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                : "bg-gradient-to-br from-gray-100 to-slate-100 text-gray-700"
            }`}
          >
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-green-700 font-semibold">Present</p>
            <p className="text-lg font-bold text-green-800">
              {allAttendance.filter((a) => a.status === "present").length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl border-2 border-red-200">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-red-700 font-semibold">Absent</p>
            <p className="text-lg font-bold text-red-800">
              {allAttendance.filter((a) => a.status === "absent").length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-xl border-2 border-purple-200">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
            <Sun className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-purple-700 font-semibold">On Leave</p>
            <p className="text-lg font-bold text-purple-800">
              {allAttendance.filter((a) => a.status === "onLeave").length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-xl border-2 border-yellow-200">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xs text-yellow-700 font-semibold">Half Day</p>
            <p className="text-lg font-bold text-yellow-800">
              {allAttendance.filter((a) => a.status === "halfDay").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
