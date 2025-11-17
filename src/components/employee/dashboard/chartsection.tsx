import { AttendanceStats, MonthlyStats } from "@/types/employee";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface ChartViewProps {
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  viewMode: "bar" | "pie" | "line";
  setViewMode: (mode: "bar" | "pie" | "line") => void;
  monthlyStats: MonthlyStats[];
  overallStats: AttendanceStats;
}

const ChartView = ({
  selectedYear,
  setSelectedYear,
  viewMode,
  setViewMode,
  monthlyStats,
  overallStats,
}: ChartViewProps) => {
  const getPieData = () => {
    return [
      { name: "Present", value: overallStats.presentDays, color: "#4ADE80" },
      { name: "Absent", value: overallStats.absentDays, color: "#F87171" },
      { name: "On Leave", value: overallStats.onLeaveDays, color: "#A78BFA" },
      { name: "Half Day", value: overallStats.halfDays, color: "#FBBF24" },
    ].filter((item) => item.value > 0);
  };

  const pieData = getPieData();

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Attendance Overview
        </h2>
        <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("bar")}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === "bar"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setViewMode("pie")}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === "pie"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Pie
            </button>
            <button
              onClick={() => setViewMode("line")}
              className={`px-3 py-1 text-sm rounded-md ${
                viewMode === "line"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Line
            </button>
          </div>
          <select
            className="border outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1 rounded-md text-sm bg-white"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
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

export default ChartView;
