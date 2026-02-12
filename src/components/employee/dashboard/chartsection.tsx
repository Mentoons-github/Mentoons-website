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
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Calendar,
} from "lucide-react";

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
      { name: "Present", value: overallStats.presentDays, color: "#10b981" },
      { name: "Absent", value: overallStats.absentDays, color: "#ef4444" },
      { name: "On Leave", value: overallStats.onLeaveDays, color: "#8b5cf6" },
      { name: "Half Day", value: overallStats.halfDays, color: "#f59e0b" },
    ].filter((item) => item.value > 0);
  };

  const pieData = getPieData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-4 shadow-xl">
          <p className="font-bold text-gray-900 mb-2">
            {payload[0].payload.month}
          </p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 mb-1"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {entry.name}:
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / overallStats.totalDays) * 100).toFixed(
        1,
      );
      return (
        <div className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            ></div>
            <p className="font-bold text-gray-900">{data.name}</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.value} days</p>
          <p className="text-sm text-gray-600">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Attendance Analytics
            </h2>
            <p className="text-sm text-gray-600">
              Visualize your attendance patterns
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-md border border-gray-200">
            <button
              onClick={() => setViewMode("bar")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                viewMode === "bar"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Bar
            </button>
            <button
              onClick={() => setViewMode("pie")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                viewMode === "pie"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
              Pie
            </button>
            <button
              onClick={() => setViewMode("line")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                viewMode === "line"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Line
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200">
            <Calendar className="w-4 h-4 text-gray-600" />
            <select
              className="outline-none font-semibold text-gray-700 bg-transparent cursor-pointer"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-white/50">
        <div className="h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "bar" ? (
              <BarChart data={monthlyStats}>
                <defs>
                  <linearGradient
                    id="presentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient
                    id="absentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient
                    id="leaveGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient
                    id="halfDayGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: "600" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: "600" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Bar
                  dataKey="present"
                  name="Present"
                  fill="url(#presentGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  name="Absent"
                  fill="url(#absentGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="onLeave"
                  name="On Leave"
                  fill="url(#leaveGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="halfDay"
                  name="Half Day"
                  fill="url(#halfDayGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            ) : viewMode === "pie" ? (
              <PieChart>
                <defs>
                  <filter id="shadow">
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${
                      percent !== undefined ? (percent * 100).toFixed(1) : 0
                    }%`
                  }
                  labelLine={{ stroke: "#6b7280", strokeWidth: 2 }}
                  style={{ filter: "url(#shadow)" }}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
              </PieChart>
            ) : (
              <LineChart data={monthlyStats}>
                <defs>
                  <linearGradient
                    id="presentLineGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="absentLineGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: "600" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px", fontWeight: "600" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="present"
                  name="Present"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{
                    fill: "#10b981",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="absent"
                  name="Absent"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{
                    fill: "#ef4444",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="onLeave"
                  name="On Leave"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{
                    fill: "#8b5cf6",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="halfDay"
                  name="Half Day"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{
                    fill: "#f59e0b",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {viewMode !== "pie" && monthlyStats.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-blue-700">Insight:</span> Your
              attendance rate for {selectedYear} is{" "}
              <span className="font-bold text-blue-700">
                {overallStats.presentPercentage}%
              </span>
              {overallStats.presentPercentage >= 90 ? (
                <span className="text-green-700">
                  {" "}
                  - Excellent performance! 🎉
                </span>
              ) : overallStats.presentPercentage >= 75 ? (
                <span className="text-yellow-700">
                  {" "}
                  - Good, but there's room for improvement.
                </span>
              ) : (
                <span className="text-red-700">
                  {" "}
                  - Consider improving your attendance.
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartView;
