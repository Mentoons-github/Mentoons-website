import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { AdminMonthlyStats, AdminStats } from "@/types/employee";
import { BarChart3, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

interface AttendanceChartProps {
  viewMode: "bar" | "pie" | "line";
  monthlyStats: AdminMonthlyStats[];
  yearlyStats: AdminStats | null;
  selectedYear: string;
  selectedMonth: string;
  onViewModeChange: (mode: "bar" | "pie" | "line") => void;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({
  viewMode,
  monthlyStats,
  yearlyStats,
  selectedYear,
  selectedMonth,
  onViewModeChange,
}) => {
  const getPieData = () => {
    const stats = yearlyStats || {
      presentDays: 0,
      absentDays: 0,
      onLeaveDays: 0,
      halfDays: 0,
    };
    return [
      { name: "Present", value: stats.presentDays, color: "#4ADE80" },
      { name: "Absent", value: stats.absentDays, color: "#F87171" },
      { name: "On Leave", value: stats.onLeaveDays, color: "#A78BFA" },
      { name: "Half Day", value: stats.halfDays, color: "#FBBF24" },
    ].filter((item) => item.value > 0);
  };

  const pieData = getPieData();

  const monthName = new Date(0, parseInt(selectedMonth) - 1).toLocaleString(
    "default",
    {
      month: "long",
    }
  );

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Attendance Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {monthName} {selectedYear}
          </p>
        </div>
        <div className="flex gap-2 mt-3 md:mt-0">
          <button
            onClick={() => onViewModeChange("bar")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
              viewMode === "bar"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Bar
          </button>
          <button
            onClick={() => onViewModeChange("pie")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
              viewMode === "pie"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
            }`}
          >
            <PieChartIcon className="w-4 h-4" />
            Pie
          </button>
          <button
            onClick={() => onViewModeChange("line")}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${
              viewMode === "line"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Line
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "bar" ? (
              <BarChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" name="Present" fill="#4ADE80" />
                <Bar dataKey="absent" name="Absent" fill="#F87171" />
                <Bar dataKey="onLeave" name="On Leave" fill="#A78BFA" />
                <Bar dataKey="halfDay" name="Half Day" fill="#FBBF24" />
              </BarChart>
            ) : viewMode === "pie" ? (
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${
                      percent !== undefined ? (percent * 100).toFixed(0) : 0
                    }%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <LineChart data={monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="present"
                  name="Present"
                  stroke="#4ADE80"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  name="Absent"
                  stroke="#F87171"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="onLeave"
                  name="On Leave"
                  stroke="#A78BFA"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="halfDay"
                  name="Half Day"
                  stroke="#FBBF24"
                  strokeWidth={2}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;
