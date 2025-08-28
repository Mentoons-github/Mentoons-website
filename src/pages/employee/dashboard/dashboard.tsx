import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const EmployeeDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [viewMode, setViewMode] = useState("bar");
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const attendanceData = [
    { month: "Jan", present: 21, absent: 2, late: 1 },
    { month: "Feb", present: 19, absent: 1, late: 2 },
    { month: "Mar", present: 22, absent: 0, late: 0 },
    { month: "Apr", present: 20, absent: 2, late: 1 },
    { month: "May", present: 21, absent: 1, late: 2 },
    { month: "Jun", present: 18, absent: 3, late: 1 },
    { month: "Jul", present: 20, absent: 2, late: 1 },
    { month: "Aug", present: 22, absent: 0, late: 0 },
    { month: "Sep", present: 19, absent: 1, late: 2 },
    { month: "Oct", present: 21, absent: 2, late: 1 },
    { month: "Nov", present: 20, absent: 1, late: 1 },
    { month: "Dec", present: 18, absent: 3, late: 2 },
  ];

  const pieData = [
    { name: "Present", value: 221, color: "#4ADE80" },
    { name: "Absent", value: 18, color: "#F87171" },
    { name: "Late", value: 14, color: "#FBBF24" },
  ];

  const stats = {
    totalDays: 242,
    presentDays: 221,
    absentDays: 18,
    lateDays: 14,
    presentPercentage: Math.round((221 / 242) * 100),
  };

  const renderChart = () => {
    if (viewMode === "bar") {
      return (
        <BarChart
          data={attendanceData}
          margin={{
            top: 20,
            right: 30,
            left: screenSize < 768 ? 0 : 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" name="Present" fill="#4ADE80" />
          <Bar dataKey="absent" name="Absent" fill="#F87171" />
          <Bar dataKey="late" name="Late" fill="#FBBF24" />
        </BarChart>
      );
    } else if (viewMode === "pie") {
      return (
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={screenSize < 768 ? 80 : 100}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value} />
          <Legend />
        </PieChart>
      );
    } else {
      return (
        <LineChart
          data={attendanceData}
          margin={{
            top: 20,
            right: 30,
            left: screenSize < 768 ? 0 : 20,
            bottom: 5,
          }}
        >
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
            dataKey="late"
            name="Late"
            stroke="#FBBF24"
            strokeWidth={2}
          />
        </LineChart>
      );
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-100 ">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 md:p-6 text-white shadow-lg mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Welcome Devan P. S</h1>
        <p className="mt-1 opacity-90">
          Here's your attendance dashboard for {selectedYear}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Employee Attendance
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
              <option>Select a Year</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-lg font-medium text-gray-500">
              Total Working Days
            </h3>
            <div className="flex justify-between items-end mt-2">
              <p className="text-xl md:text-2xl font-bold text-gray-800">
                {stats.totalDays}
              </p>
              <span className="text-xs md:text-sm text-blue-500 font-medium">
                100%
              </span>
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-lg font-medium text-gray-500">
              Present Days
            </h3>
            <div className="flex justify-between items-end mt-2">
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {stats.presentDays}
              </p>
              <span className="text-xs md:text-sm text-green-500 font-medium">
                {stats.presentPercentage}%
              </span>
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-lg font-medium text-gray-500">
              Absent Days
            </h3>
            <div className="flex justify-between items-end mt-2">
              <p className="text-xl md:text-2xl font-bold text-red-600">
                {stats.absentDays}
              </p>
              <span className="text-xs md:text-sm text-red-500 font-medium">
                {Math.round((stats.absentDays / stats.totalDays) * 100)}%
              </span>
            </div>
          </div>

          <div className="bg-white p-3 md:p-4 rounded-lg shadow-md border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <h3 className="text-sm md:text-lg font-medium text-gray-500">
              Late Days
            </h3>
            <div className="flex justify-between items-end mt-2">
              <p className="text-xl md:text-2xl font-bold text-yellow-600">
                {stats.lateDays}
              </p>
              <span className="text-xs md:text-sm text-yellow-500 font-medium">
                {Math.round((stats.lateDays / stats.totalDays) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
